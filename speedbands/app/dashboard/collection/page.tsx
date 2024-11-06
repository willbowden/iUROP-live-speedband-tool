"use client"

import { Speedband } from "@/lib/speedband";
import { Button, Flex, Input, Slider, SliderSingleProps, Table, TableColumnsType, TableProps, Typography } from "antd";
import React, { useState } from "react";

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

const durationOptions: SliderSingleProps['marks'] = {
  1: '1 min',
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
    dataIndex: "prettyCoords"
  },
  {
    title: "Street Name",
    dataIndex: "streetName"
  }
]

const rowSelection: TableProps<Speedband>['rowSelection'] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: Speedband[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: Speedband) => ({
    name: record.streetName,
  }),
};

export default function StartJob() {
  const [apiKey, setApiKey] = useState<string>();

  return (
    <Flex vertical align="flex-start" gap="1em">
      <Title
        level={4}
        style={titleStyle}
      >Start New Collection Job</Title>

      <Input
        placeholder="Your LTA API Key"
        onChange={(e) => setApiKey(e.target.value)}
        type="password"></Input>

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
      ></Slider>

      <Title
        level={5}
        style={titleStyle}
      >Speedband Selection</Title>

      <Table<Speedband>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={[]}
        sticky
        style={tableStyle}
      />

      <Button
        type="primary"
        style={buttonStyle}
      >Start Job</Button>
    </Flex>
  )
}