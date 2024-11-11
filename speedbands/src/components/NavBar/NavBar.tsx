"use client"

import { Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";

const navBarStyle: React.CSSProperties = {
  width: "100vw",
  height: "10vh",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
}

const { Title } = Typography;

export default function NavBar() {
  const router = useRouter();

  return (
    <Header style={navBarStyle} onClick={() => router.push("/")}>
      <Title>Speedband Tool</Title>
    </Header>
  )
}