"use client"

import { Button, Flex, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";
import { fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { useEffect, useState } from "react";

const navBarStyle: React.CSSProperties = {
  width: "100vw",
  height: "10vh",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
}

const { Title } = Typography;

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string>("Not signed in");
  const router = useRouter();

  useEffect(() => {
    fetchUserAttributes().then(attrs => setUserEmail(attrs.email || ""))
  }, []);

  return (
    <Header style={navBarStyle} onClick={() => router.push("/dashboard")}>
      <Title>Speedband Tool</Title>
      <Flex gap={"1em"} align="center">
        <Title level={3}>{`${userEmail?.split("@")[0]}`}</Title>
        <Button
        onClick={() => {
          signOut().then(() => router.replace("/dashboard"));
        }}>Sign Out</Button>
      </Flex>
    </Header>
  )
}