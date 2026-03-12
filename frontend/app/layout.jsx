import { Manrope, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata = {
  title: "DailyMind",
  description: "Share something new you learned today."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-[var(--font-body)] text-ink`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
