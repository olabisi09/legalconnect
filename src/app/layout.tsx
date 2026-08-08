import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "300", "400", "700"],
});

export const metadata: Metadata = {
  title: "LegalConnect — Run your firm with confidence.",
  description:
    "LegalConnect is a modern Law Firm Operating System that replaces disconnected tools with one integrated platform for matter management, document management, trust accounting, billing, and more.",
  // icons: {
  //   icon: '/brand/concept-a/legalconnect-favicon.svg',
  // },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", roboto.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
