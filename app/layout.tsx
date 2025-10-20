import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/react-query-provider";
import TopBar from "@/components/nav/top-bar";
import { Toaster } from "sonner";

const nunitoSans = Nunito({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hiring Platform",
  description: "A platform for hiring talent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} w-full max-w-7xl mx-auto antialiased`}
      >
        <ReactQueryClientProvider>
          <TopBar />
          <div className="mt-[8vh]">{children}</div>
          <Toaster richColors position="bottom-left" />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
