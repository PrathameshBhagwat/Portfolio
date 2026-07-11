import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  metadataBase: new URL("https://prathameshbhagwat.vercel.app"),
  title: "Prathamesh Bhagwat | Portfolio",
  description: "AI & Data Science student building smart, scalable, and stunning digital products.",
  icons: {
    icon: "/assets/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Prathamesh Bhagwat | Portfolio",
    description: "AI & Data Science student building smart, scalable, and stunning digital products.",
    url: "https://prathameshbhagwat.vercel.app",
    siteName: "Prathamesh Bhagwat Portfolio",
    images: [
      {
        url: "/assets/Hero_Image.webp",
        width: 800,
        height: 600,
        alt: "Prathamesh Bhagwat Profile Picture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prathamesh Bhagwat | Portfolio",
    description: "AI & Data Science student building smart, scalable, and stunning digital products.",
    images: ["/assets/Hero_Image.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('portfolio-theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme || systemTheme;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
