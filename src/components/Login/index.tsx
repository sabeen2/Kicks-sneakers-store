import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthContext";
import loginImage from "../../../src/assets/loginImage.png";

const LoginForm: React.FC = () => {
  const { loggedIn, login, isLoggingUser } = useAuth();
  const [form] = Form.useForm();
  const adminEmail = "bibek@yopmail.com";
  const adminPassword = "1234";

  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    await login(values.username.trim(), values.password.trim());
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [loggedIn, navigate]);

  const fillAdminCredentials = () => {
    form.setFieldsValue({
      username: adminEmail,
      password: adminPassword,
    });
  };

  return (
    <div className="flex justify-start items-center h-screen  lg:flex-row  flex-col  gap-8 lg:gap-40">
      <img
        className=" h-[100vh] w-[100vh] justify-start"
        src={loginImage}
        alt=""
      />
      <div className=" w-[50vh] h-[50vh] bg-white rounded-lg p-8 flex flex-col justify-between">
        <h1 className="text-3xl text-center mb-6 text-gray-800 font-bold">
          Login
        </h1>
        <Button
          onClick={fillAdminCredentials}
          className="mb-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold px-4 rounded-md focus:outline-none transition-all duration-300"
        >
          Use Admin Credentials
        </Button>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Enter Username"
              className="border-gray-900 rounded-md mb-4 border focus:outline-none focus:border-purple-500 px-3 py-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              className="border-gray-900 rounded-md mb-4 border focus:outline-none focus:border-purple-500 px-3 py-2"
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoggingUser}
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-black to-gray-700 hover:from-gray-900 hover:to-black text-white font-bold  px-4 rounded-md focus:outline-none transition-all duration-300 w-full"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          Forgot Password??{" "}
          <Link to="/forgot-password" className="text-blue-500">
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
