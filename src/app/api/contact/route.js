import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill out all required fields (Name, Email, and Message)." },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Contact form is not fully configured. Please define WEB3FORMS_ACCESS_KEY in your environment variables." 
        },
        { status: 500 }
      );
    }

    // Secure server-side relay to Web3Forms API
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        phone: phone || "Not provided",
        subject: `[Portfolio Message] ${subject || "No Subject"}`,
        message,
        from_name: `${name} (Portfolio Form)`,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return NextResponse.json({ success: true, message: "Your message has been sent successfully!" });
    } else {
      console.error("Web3Forms error response:", data);
      return NextResponse.json(
        { success: false, message: data.message || "Failed to submit message." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact API Server Error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
