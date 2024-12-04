"use client"

import { Button, Flex, Progress, Table, TableColumnsType, Typography } from "antd";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const { Title } = Typography;

const tableStyle: React.CSSProperties = {
  width: "100%",
}

type TableRow = {
  jobId: string;
  cameras: number;
  duration: string;
  frequency: string;
}

const columns: TableColumnsType<TableRow> = [
  {
    title: "Job ID",
    dataIndex: "jobId",
  },
  {
    title: "Cameras",
    dataIndex: "cameras",
  },
  {
    title: "Duration",
    dataIndex: "duration",
  },
  {
    title: "Frequency",
    dataIndex: "frequency",
  }
]

export default function CollectionInProgress() {
  const searchParams = useSearchParams();
  const [id,] = useState<string>(searchParams.get("jobId") || "");

  const row = {
    key: id,
    jobId: id,
    cameras: 0,
    duration: "TEST",
    frequency: "TEST",
  }

  return (
    <Flex vertical justify="space-between" style={{height: "100%", paddingBottom: "1em"}}>
      <Flex vertical align="flex-start" gap="0.5em">
        <Title level={4}>Job In Progress</Title>

        <Table<TableRow>
          columns={columns}
          dataSource={[row]}
          pagination={false}
          style={tableStyle}
        >
        </Table>

        <Flex justify="center" align="center" style={{ width: "100%", height: "30em" }}>
          <Progress
            type="circle"
            percent={30}
            size={250}>
          </Progress>
        </Flex>
      </Flex>

      <Flex vertical justify="flex-end" style={{height: "100%"}}>
        <Button type="primary" danger>Cancel Job</Button>
      </Flex>
    </Flex>
  )
}