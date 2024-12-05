"use client"

import { GetUserJobs } from "@/lib/api";
import { Button, Flex } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const buttonStyle: React.CSSProperties = {
  width: "100%",
}

export default function DashboardStart() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Flex vertical align="flex-start" gap="1em">
      <Button
        type="primary"
        style={buttonStyle}
        onClick={() => { router.push(`${pathname}/collection`) }}
      >Start Collection Job</Button>
      <Button
        type="primary"
        style={buttonStyle}
        onClick={() => { 
          GetUserJobs().then(res => console.log(res));
         }}
      >Test API</Button>
      {/* <Button
        type="primary"
        style={buttonStyle}
        disabled
        onClick={() => { router.push(`${pathname}/detection`) }}
      >Detect Vehicles</Button> */}
    </Flex>
  );
}
