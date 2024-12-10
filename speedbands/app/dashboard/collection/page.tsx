"use client"

import { Speedband } from "@/lib/speedband";
import { SpeedbandContext, SpeedbandDispatchContext } from "@/lib/SpeedbandContext";
import { Button, Flex, Form, Input, Slider, SliderSingleProps, Table, TableColumnsType, TableProps, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { getCurrentUser, GetCurrentUserOutput } from "aws-amplify/auth";
import { CreateJob, JobCreationInput } from "@/lib/api";
import { Amplify } from "aws-amplify";

const { Title } = Typography;


const titleStyle: React.CSSProperties = {
  marginTop: "0.5em",
  marginBottom: "0.5em",
};

const sliderStyle: React.CSSProperties = {
  width: "100%",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  alignSelf: "flex-end",
}

const menuStyle: React.CSSProperties = {
  height: "100%",
  paddingBottom: "1em",
}

const durationOptions: SliderSingleProps['marks'] = {
  5: '5 mins',
  10: '10 mins',
  15: '15 mins',
  30: '30 mins',
};

const frequencyOptions: SliderSingleProps['marks'] = {
  5: '5 mins',
  10: '10 mins',
  15: '15 mins',
};

const columns: TableColumnsType<Speedband> = [
  {
    title: "Coordinates",
    dataIndex: "prettyCoords",
  },
  {
    title: "Street Name",
    dataIndex: "streetName",
  }
]

export default function StartCollection() {
  const [form] = Form.useForm();

  const [apiKey, setApiKey] = useState<string>("");
  const [duration, setDuration] = useState<number>(15);
  const [frequency, setFrequency] = useState<number>(5);

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  const { speedbands, selectedSpeedbands } = useContext(SpeedbandContext);
  const dispatch = useContext(SpeedbandDispatchContext);

  const rowSelection: TableProps<Speedband>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Speedband[]) => {
      dispatch({
        type: 'SetSelectedSpeedbands',
        speedbands: selectedRows,
      })
    },
    getCheckboxProps: (record: Speedband) => ({
      name: record.streetName,
    }),
    selectedRowKeys: selectedSpeedbands.map(b => `${b.id}`),
  };

  const submitJob = async () => {
    setLoading(true);
    const { userId } = await getCurrentUser();

    const data: JobCreationInput = {
      userId: userId,
      apiKey: apiKey,
      durationMinutes: duration,
      frequencyMinutes: frequency,
      speedbands: selectedSpeedbands.map(b => {
        return {
          cameraId: b.id,
          linkId: b.linkId,
        }
      })
    }

    CreateJob(data).then(res => {
      router.push(`${pathname}/in_progress?jobId=${res.jobId}`);
    }
    );
  }

  return (
    <Flex vertical justify="space-between" style={menuStyle}>
      <Form
        form={form}
        name="collection-input"
        onFinish={submitJob}>
        <Flex vertical align="flex-start" gap="0.5em">
          <Title
            level={4}
            style={titleStyle}
          >Start New Collection Job</Title>

          <Form.Item name="API Key" rules={[{ required: true }]} style={{width: "100%"}}>
            <Input
              type="password"
              placeholder="Your LTA API Key"
              onChange={(e) => setApiKey(e.target.value)}></Input>
          </Form.Item>

          <Title
            level={5}
            style={titleStyle}
          >Job Duration</Title>

          <Slider
            min={1}
            max={30}
            marks={durationOptions}
            step={null}
            defaultValue={15}
            style={sliderStyle}
            onChange={(value) => setDuration(value)}
          ></Slider>

          <Title
            level={5}
            style={titleStyle}
          >Sample Frequency</Title>

          <Slider
            min={5}
            max={15}
            marks={frequencyOptions}
            step={null}
            defaultValue={5}
            style={sliderStyle}
            onChange={(value) => setFrequency(value)}
          ></Slider>

          <Title
            level={5}
            style={titleStyle}
          >Speedband Selection</Title>

          <Table<Speedband>
            rowSelection={{ type: "checkbox", ...rowSelection }}
            columns={columns}
            dataSource={speedbands}
            rowKey={(band) => `${band.id}`}
            sticky
            pagination={false}
            style={tableStyle}
            scroll={{ y: "26em" }}
          />
        </Flex>

        <Button
          type="primary"
          disabled={loading}
          style={buttonStyle}
          htmlType="submit"
        >Start Job</Button>
      </Form>

    </Flex >

  )
}