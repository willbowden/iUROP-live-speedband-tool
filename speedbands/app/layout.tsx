import "@/globals.css";
import StoreProvider from "@/lib/StoreProvider";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </body>
      </html>
    </StoreProvider>
  );
}
