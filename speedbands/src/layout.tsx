import NavBar from "@/components/NavBar/NavBar";
import "@/globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Flex } from "antd";
import localFont from "next/font/local";
import ThemeProvider from "./components/ThemeProvider";
import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';

Amplify.configure({ ...awsExports });

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>
          <ThemeProvider>
            <NavBar></NavBar>
            <Flex style={{ height: "90vh" }}>
              {children}
            </Flex>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
