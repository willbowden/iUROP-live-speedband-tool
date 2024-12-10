"use client"

import { CheckJob, JobEntry } from "@/lib/api";
import { JobNotFoundError } from "@/lib/errors";
import { Button, Flex, Modal, Progress, Table, TableColumnsType, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const { Title } = Typography;

const tableStyle: React.CSSProperties = {
  width: "100%",
}

type TableRow = {
  jobId: string;
  duration: string;
  frequency: string;
}

const columns: TableColumnsType<TableRow> = [
  {
    title: "Job ID",
    dataIndex: "jobId",
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

const calculateProgress = (startTime: number, endTime: number): number => {
  const duration = endTime - startTime;

  const progress = Date.now() - startTime;

  return Math.floor((progress / duration) * 100);
}

const calculateDuration = (startTime: number, endTime: number): string => {
  let mins = Math.floor((endTime - startTime) / 1000 / 60);

  return `${mins} minutes`;
}

export default function CollectionInProgress() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [id,] = useState<string>(searchParams.get("jobId") || "");
  const [job, setJob] = useState<JobEntry>();
  const [percent, setPercent] = useState<number>(0);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    if (id) {
      CheckJob(id).then(job => setJob(job)).catch(err => {
        if (err.name == JobNotFoundError.name) {
          modal.error({
            title: err.title,
            content: (
              <>{err.message}</>
            ),
            maskClosable: false,
            onOk: () => router.push("/dashboard")
          })
        }
      }
      )
    }
  }, [])

  useEffect(() => {
    if (!job) return;

    updateProgress();
    setTimeout(recheckJob, 30000);
  }, [job])

  const recheckJob = () => {
    CheckJob(id).then(job => {
      setJob(job)
      if (job.status == "Failed") {
        if (updateTimeout) clearTimeout(updateTimeout);
        modal.error({
          title: "Job Failed",
          content: (
            <>{job.reason}</>
          ),
          maskClosable: false,
          onOk: () => router.push("/dashboard")
        })
      }
    }
    )
  }

  let updateTimeout: NodeJS.Timeout;

  const updateProgress = () => {
    if (!job) return;
    const newPercent = calculateProgress(job.startTime, job.endTime);
    if (newPercent >= 100) {
      setPercent(100);
      router.push(`complete?jobId=${id}`);
    } else {
      setPercent(newPercent);
      if (updateTimeout) clearTimeout(updateTimeout);
      updateTimeout = setTimeout(updateProgress, 1000);
    }
  }

  const row = job && {
    key: job.jobId,
    jobId: job.jobId,
    duration: calculateDuration(job.startTime, job.endTime),
    frequency: `${job.frequencyMinutes} mins`,
  }

  return (
    <Flex vertical justify="space-between" style={{ height: "100%", paddingBottom: "1em" }}>
      <Flex vertical align="flex-start" gap="0.5em">
        <Title level={4}>Job In Progress</Title>

        {row && (
          <Table<TableRow>
            columns={columns}
            dataSource={row ? [row] : []}
            pagination={false}
            style={tableStyle}
          >
          </Table>
        )}

        <Flex justify="center" align="center" style={{ width: "100%", height: "30em" }}>
          <Progress
            type="circle"
            percent={percent}
            size={250}>
          </Progress>
        </Flex>
      </Flex>
      {contextHolder}
    </Flex>
  )
}