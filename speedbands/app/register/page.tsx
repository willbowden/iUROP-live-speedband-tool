"use client"

import { Button, Card, Checkbox, Flex, Form, FormProps, Input } from "antd";

type FieldType = {
  username?: string;
  password?: string;
};

export default function Register() {
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Flex align="center" justify="center" style={{ width: "100%", minHeight: "100%" }}>
      <Card title="Create an account" style={{ width: "25%" }}>
        <Form
          layout="horizontal"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ remember: true }}
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input a username' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input a password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-evenly" style={{ width: "100%" }}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}