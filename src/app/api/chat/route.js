import aboutData from "../../../data/about.json";
import skillsData from "../../../data/skills.json";
import projectsData from "../../../data/projects.json";
import experienceData from "../../../data/experience.json";
import educationData from "../../../data/education.json";
import achievementsData from "../../../data/achievements.json";
import certificatesData from "../../../data/certificates.json";
import resumeData from "../../../data/resume.json";
import contactData from "../../../data/contact.json";

export const runtime = "nodejs";

// Rate limiting in-memory map
const rateLimitMap = new Map();
const LIMIT = 15;
const WINDOW = 60 * 1000; // 1 minute window

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW });
    return true;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW });
    return true;
  }

  if (record.count >= LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Fetch helper with exponential backoff retry logic
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status !== 429 && response.status < 500) {
        return response; // Return on client errors (400, 401, etc.)
      }
    } catch (error) {
      if (i === retries - 1) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
  }
  throw new Error("External LLM API call failed after maximum retries");
}

export async function POST(request) {
  // 1. Rate Limiting Check
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please slow down and try again in a minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { message, history, language } = await request.json();
    const query = (message || "").toLowerCase().trim();
    const currentLang = language || "en";

    // Context preparation from static files
    const context = `
Prathamesh Bhagwat Portfolio Context:
---
ABOUT ME:
Name: ${aboutData.name}
Title: ${aboutData.title}
Bio: ${aboutData.bio}
Vision: ${aboutData.vision}
Core Focus: ${aboutData.focus}
Location: ${aboutData.location}
Career Goals: ${aboutData.career_goals}

SKILLS:
${skillsData.categories.map(c => `- ${c.label}: ${c.skills.join(", ")}`).join("\n")}

PROJECTS:
${projectsData.map(p => `- ${p.title}: ${p.description} (Tech: ${p.tags.join(", ")}, GitHub: ${p.github || "None"}, Demo: ${p.demo || "None"})`).join("\n")}

EXPERIENCE:
${experienceData.map(e => `- SDE/Data Intern at ${e.company} (${e.role}, Location: ${e.location}, Date: ${e.date}):\n${e.points.map(p => `  * ${p}`).join("\n")}`).join("\n")}

EDUCATION:
${educationData.map(ed => `- ${ed.stage} at ${ed.institution} (${ed.year}) - Result: ${ed.result}\n  Description: ${ed.description}`).join("\n")}

CERTIFICATIONS:
${certificatesData.map(c => `- ${c.title} issued by ${c.issuer} (${c.date}) ${c.credId ? `[ID: ${c.credId}]` : ""}`).join("\n")}

ACHIEVEMENTS:
${achievementsData.map(a => `- ${a.title}: ${a.description}`).join("\n")}

RESUME DETAILS:
Resume path: ${resumeData.url}
Resume highlights:
${resumeData.highlights.map(h => `* ${h}`).join("\n")}

CONTACT INFORMATION:
Email: ${contactData.email}
Phone: ${contactData.phone}
Location: ${contactData.location}
Social links:
- GitHub: ${contactData.socials.github}
- LinkedIn: ${contactData.socials.linkedin}
- LeetCode: ${contactData.socials.leetcode}
---
`;

    const langInstruction = currentLang === "hi" 
      ? "You MUST answer and communicate entirely in Hindi (हिंदी). Translate all project details, experience, skills, and bio information accurately into natural, professional Hindi."
      : currentLang === "mr"
      ? "You MUST answer and communicate entirely in Marathi (मराठी). Translate all project details, experience, skills, and bio information accurately into natural, professional Marathi."
      : "You MUST answer and communicate in English.";

    const systemPrompt = `You are Prathamesh Bhagwat's AI portfolio agent. Answer the user's questions about Prathamesh's credentials, portfolio, and work based ONLY on the portfolio data context below. 

${langInstruction}

=== STRICT SECURITY AI FIREWALL ===
You are equipped with a strict AI Firewall. You are ONLY allowed to answer questions that are directly about Prathamesh Bhagwat, his experience, projects, skills, education, contact information, and portfolio.
You are strictly FORBIDDEN from answering any other questions, including:
1. General knowledge, history, geography (e.g. "What is the capital of India?", "Who was the first president of the USA?").
2. General coding, writing code from scratch, debugging unrelated files (unless describing/explaining one of Prathamesh's projects).
3. Math, science, or general information questions.
4. Translating arbitrary text (not related to Prathamesh).
5. General topics, news, or standard conversational assistance.

If the user's query is off-topic, general knowledge, or not directly about Prathamesh Bhagwat, his resume, or his portfolio, you MUST ignore the question and immediately output the exact standard refusal response, with NO other text or explanation. Do not attempt to answer the question first or provide any general info.

Refusal response strings:
- English: "I'm designed to answer questions only about Prathamesh Bhagwat and his portfolio."
- Hindi: "मैं केवल प्रथमेश भागवत और उनके पोर्टफोलियो के बारे में सवालों के जवाब देने के लिए डिज़ाइन किया गया हूँ।"
- Marathi: "मी फक्त प्रथमेश भागवत आणि त्यांच्या पोर्टफोलिओबद्दलच्या प्रश्नांची उत्तरे देण्यासाठी डिझाइन केलेला आहे।"
==================================

Every answer must be based only on the provided data. Do not hallucinate or assume facts. If information is unavailable, politely state that you do not have that specific detail.

Keep responses relatively brief, friendly, and formatted in clean markdown (lists, bold words).

At the end of your response text, you must output relevant action chips inside a special <actions>...</actions> tag. This tag must contain a valid JSON array of objects.
Supported action formats:
- { "label": "Download Resume", "type": "download", "url": "${resumeData.url}" }
- { "label": "Scroll to Projects", "type": "scroll", "target": "#project" }
- { "label": "Scroll to Experience", "type": "scroll", "target": "#experience" }
- { "label": "Scroll to Toolbox", "type": "scroll", "target": "#skills" }
- { "label": "Scroll to Education", "type": "scroll", "target": "#education" }
- { "label": "Scroll to Certifications", "type": "scroll", "target": "#certificates" }
- { "label": "Scroll to Contact", "type": "scroll", "target": "#contact" }
- { "label": "View GitHub", "type": "link", "url": "URL" }

Do not output actions that are irrelevant to the user's request. 

${context}`;

    // Compile message history list
    const messages = [{ role: "system", content: systemPrompt }];
    if (history && Array.isArray(history)) {
      history.forEach(h => {
        messages.push({
          role: h.sender === "user" ? "user" : "assistant",
          content: h.text
        });
      });
    }
    messages.push({ role: "user", content: query });

    // LLM connection setup
    let endpoint = "";
    let apiKey = "";
    let model = "";

    if (process.env.GROQ_API_KEY) {
      endpoint = "https://api.groq.com/openai/v1/chat/completions";
      apiKey = process.env.GROQ_API_KEY;
      model = "llama-3.3-70b-versatile";
    } else if (process.env.GEMINI_API_KEY) {
      endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      apiKey = process.env.GEMINI_API_KEY;
      model = "gemini-1.5-flash";
    }

    const encoder = new TextEncoder();

    // Graceful fallback if no API keys are provided
    if (!apiKey) {
      const fallbackText = `Live LLM connection is pending. Please configure \`GEMINI_API_KEY\` or \`GROQ_API_KEY\` inside \`.env.local\` in the project's root folder.\n\nCurrently operating in mock mode:\n- **Location**: ${aboutData.location}\n- **Skills**: React, Python, Spring Boot, SQL, AWS, Docker.\n- **Status**: ${aboutData.career_goals}`;
      
      const stream = new ReadableStream({
        async start(controller) {
          const words = fallbackText.split(" ");
          for (let i = 0; i < words.length; i++) {
            const chunk = JSON.stringify({ type: "text", content: words[i] + (i === words.length - 1 ? "" : " ") });
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "actions", actions: [{ label: "Download Resume", type: "download", url: resumeData.url }] })}\n\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        }
      });
      return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
    }

    // Call external LLM endpoint
    const response = await fetchWithRetry(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.0,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`LLM provider returned status code ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Look-ahead stream filtering parser for stripping <actions> tags
    const stream = new ReadableStream({
      async start(controller) {
        let isBufferingActions = false;
        let lookAheadBuffer = "";
        let actionsBuffer = "";
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine || cleanLine === "data: [DONE]") continue;

            if (cleanLine.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(cleanLine.slice(6));
                const textChunk = parsed.choices?.[0]?.delta?.content || "";
                if (!textChunk) continue;

                if (isBufferingActions) {
                  actionsBuffer += textChunk;
                  continue;
                }

                lookAheadBuffer += textChunk;
                const tagStart = lookAheadBuffer.indexOf("<actions>");

                if (tagStart !== -1) {
                  const textToSend = lookAheadBuffer.substring(0, tagStart);
                  if (textToSend) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", content: textToSend })}\n\n`));
                  }
                  isBufferingActions = true;
                  actionsBuffer = lookAheadBuffer.substring(tagStart + 9);
                  lookAheadBuffer = "";
                } else {
                  // Buffer safety window so we don't output parts of "<actions>"
                  const tag = "<actions>";
                  let holdIndex = -1;
                  for (let i = 1; i < tag.length; i++) {
                    const prefix = tag.substring(0, i);
                    if (lookAheadBuffer.endsWith(prefix)) {
                      holdIndex = lookAheadBuffer.length - prefix.length;
                      break;
                    }
                  }

                  if (holdIndex !== -1) {
                    const textToSend = lookAheadBuffer.substring(0, holdIndex);
                    if (textToSend) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", content: textToSend })}\n\n`));
                    }
                    lookAheadBuffer = lookAheadBuffer.substring(holdIndex);
                  } else {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", content: lookAheadBuffer })}\n\n`));
                    lookAheadBuffer = "";
                  }
                }
              } catch (e) {
                // Ignore chunk parsing failures
              }
            }
          }
        }

        // Flush any remaining text in the lookahead buffer
        if (lookAheadBuffer && !isBufferingActions) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", content: lookAheadBuffer })}\n\n`));
        }

        // Process buffered actions
        if (actionsBuffer) {
          const cleanActions = actionsBuffer.replace("</actions>", "").trim();
          try {
            const actionsObj = JSON.parse(cleanActions);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "actions", actions: actionsObj })}\n\n`));
          } catch (e) {
            console.error("Actions parsing failure:", cleanActions, e);
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("LLM API Integration Error:", error);
    return new Response(JSON.stringify({ error: "Failed to query the AI portfolio agent. Connection error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
