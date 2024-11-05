"use client"

import { Speedband } from "@/lib/speedband";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Input, MenuProps, Select, Space, Table, TableColumnsType, TableProps, Typography } from "antd";
import React, { useState } from "react";

const { Title } = Typography;

const titleStyle: React.CSSProperties = {
  marginTop: "0.5em",
};

const dropdownStyle: React.CSSProperties = {
  width: "100%",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  alignSelf: "flex-end",
}

const durationOptions = [
  {
    label: "1 minute",
    value: 1,
  },
  {
    label: "5 minutes",
    value: 5,
  },
  {
    label: "10 minutes",
    value: 10,
  },
  {
    label: "15 minutes",
    value: 15,
  },
  {
    label: "30 minutes",
    value: 30,
  }
];

const frequencyOptions = [
  {
    label: "5 minutes",
    value: 5,
  },
  {
    label: "10 minutes",
    value: 10,
  },
  {
    label: "15 minutes",
    value: 15,
  },
];

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

      <Select
        placeholder={"Select Job Duration"}
        style={dropdownStyle}
        options={durationOptions} />

      <Select
        placeholder={"Select Sample Frequency"}
        style={dropdownStyle}
        options={frequencyOptions} />

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