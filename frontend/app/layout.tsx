import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knytt - AI-Powered Product Discovery",
  description: "Discover products you'll love with AI-powered recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
