import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReactQuery from "@/components/ReactQuery";
import NextAuthProvider from "@/components/NextAuthProvider";
import { ReactNode } from "react";
import LoadingSession from "@/components/LoadingSession";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "SUGGESTION SYSTEM",
  description: "Ungkapkan lah ide, gagasan serta kreasi anda yang kiranya bermanfaat, baik bagi diri anda, kelompok maupun lingkungan tempat anda bekerja. Percayalah bahwa dengan ide yang baik pasti akan mendapatkan hasil kerja yang lebih baik.",
};

interface NextAuthProps {
  children: ReactNode;
  session: never;
}

export default function RootLayout({ children, session }: NextAuthProps) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <NextAuthProvider session={session}>
          <ReactQuery>
            <Toaster />
            <LoadingSession>
              {children}
            </LoadingSession>
          </ReactQuery>
        </NextAuthProvider>
      </body>
    </html>
  );
}
