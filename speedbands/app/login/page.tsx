"use client"

import { Button, Card, Checkbox, Flex, Form, FormProps, Input } from "antd";
import { useRouter } from "next/navigation";

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  return (
    <Flex align="center" justify="center" style={{ width: "100%", minHeight: "100%" }}>
      <Card title="Sign in" style={{width: "25%"}}>
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
            rules={[{ required: true, message: 'Please input your username' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked">
            <Checkbox>Remember me?</Checkbox>
          </Form.Item>

          <Form.Item>
            <Flex justify="space-evenly" style={{width: "100%"}}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
              <Button htmlType="submit" onClick={() => router.push("/register")}>
                Register
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}