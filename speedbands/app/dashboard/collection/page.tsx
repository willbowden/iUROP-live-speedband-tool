"use client"

import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Flex, Input, MenuProps, Select, Space, Typography } from "antd";
import React, { useState } from "react";

const { Title } = Typography;

const titleStyle: React.CSSProperties = {
  marginTop: "0.5em",
};

const dropdownStyle: React.CSSProperties = {
  width: "100%",
};

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
    </Flex>
  )
}