"use client"

import { CheckJob, JobEntry } from "@/lib/api";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Result } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CollectionComplete() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [id,] = useState<string>(searchParams.get("jobId") || "");
  const [job, setJob] = useState<JobEntry>();

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    CheckJob(id).then(job => {
      setJob(job);
      if (job.status != "Complete") {
        modal.error({
          title: "Job not complete",
          content: (
            <>This job is not complete!</>
          ),
          maskClosable: false,
          onOk: () => router.push("/dashboard")
        })
      }
    }).catch(err => {
      modal.error({
        title: err.title,
        content: (
          <>{err.message}</>
        ),
        maskClosable: false,
        onOk: () => router.push("/dashboard")
      })
    })
  }, [])

  return (
    <Flex vertical justify="space-between" style={{ height: "100%", paddingBottom: "1em" }}>
      <Flex vertical align="flex-start" gap="0.5em">
        <Result
          status="success"
          title="Job Complete!"
          subTitle={`Job ID: ${id}`}
          style={{ width: "100%" }}
          extra={[
            <a href={job?.url} target="_blank">
              <DownloadOutlined /> Download Results
            </a>,
          ]}
        />
      </Flex>

      <Flex vertical justify="flex-end" style={{ height: "100%" }}>
        <Button type="primary"
          onClick={() => router.push("/dashboard")}
        >Go Home</Button>
      </Flex>
      {contextHolder}
    </Flex>
  )
}