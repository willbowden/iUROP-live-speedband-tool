"use client"

import { GetUserJobs, GetUserJobsResponse, JobEntry } from "@/lib/api";
import { Button, Flex, Table, TableColumnsType } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Column, ColumnGroup } = Table;

const buttonStyle: React.CSSProperties = {
  width: "100%",
}

const tableStyle: React.CSSProperties = {
  width: "100%",
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
}

export default function DashboardStart() {
  const pathname = usePathname();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobEntry[]>([]);

  useEffect(() => {
    GetUserJobs().then(res => {
      setJobs(res.jobs);
    })
  }, [])

  return (
    <Flex vertical align="flex-start" gap="1em">
      {
        (jobs.length > 0) && (
          <Table<JobEntry>
            dataSource={jobs}
            rowKey={(job) => job.jobId}
            pagination={false}
            style={tableStyle}
          >
            <Column title="Job ID" dataIndex="jobId" key="jobId"
              render={(jobId: string) => {
                return `${jobId.slice(0, 2)}..`
              }}
            />
            <Column title="Status" dataIndex="status" key="status"
              render={(status: String, row: JobEntry) =>
                <a href={`${pathname}/collection/in_progress?jobId=${row.jobId}`}>{status}</a>
              } />
            <Column title="Start" dataIndex="startTime" key="startTime"
              render={(startTime: string) => {
                return `${new Date(parseInt(startTime)).toLocaleDateString(undefined, dateFormatOptions)}`;
              }}
            />
            <Column title="End" dataIndex="endTime" key="endTime"
              render={(endTime: string) => {
                return `${new Date(parseInt(endTime)).toLocaleDateString(undefined, dateFormatOptions)}`;
              }}
            />
            <Column title="Freq." dataIndex="frequencyMinutes" key="frequencyMinutes" />
          </Table>
        )
      }
      <Button
        type="primary"
        style={buttonStyle}
        onClick={() => { router.push(`${pathname}/collection`) }}
      >Start Collection Job</Button>
      {/* <Button
        type="primary"
        style={buttonStyle}
        disabled
        onClick={() => { router.push(`${pathname}/detection`) }}
      >Detect Vehicles</Button> */}
    </Flex>
  );
}
