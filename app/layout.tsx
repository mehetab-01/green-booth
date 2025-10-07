import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Booth - Capture Your Green Moments",
  description: "A platform for capturing and sharing greenery, social cleanliness, and green club events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
