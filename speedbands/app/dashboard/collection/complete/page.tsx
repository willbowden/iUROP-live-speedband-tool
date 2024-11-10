"use client"

import { DownloadOutlined } from "@ant-design/icons";
import { Button, Flex, Result } from "antd";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CollectionComplete() {
  const searchParams = useSearchParams();
  const [id,] = useState<string>(searchParams.get("jobId") || "");

  return (
    <Flex vertical justify="space-between" style={{ height: "100%", paddingBottom: "1em" }}>
      <Flex vertical align="flex-start" gap="0.5em">
        <Result
          status="success"
          title="Job Complete!"
          subTitle={`Job ID: ${id}`}
          style={{width: "100%"}}
          extra={[
            <Button type="primary" key="download" ghost>
              <DownloadOutlined />
              Download Results
            </Button>,
          ]}
        />
      </Flex>

      <Flex vertical justify="flex-end" style={{ height: "100%" }}>
        <Button type="primary">Go Home</Button>
      </Flex>
    </Flex>
  )
}