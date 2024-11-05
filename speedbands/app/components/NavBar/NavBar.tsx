"use client"

import { Typography } from "antd";
import { Header } from "antd/es/layout/layout";

const navBarStyle: React.CSSProperties = {
  width: "100vw",
  height: "10vh",
  display: "flex",
  alignItems: "center"
}

const { Title } = Typography;

export default function NavBar() {
  return (
    <Header style={navBarStyle}>
      <Title>Speedband Tool</Title>
    </Header>
  )
}