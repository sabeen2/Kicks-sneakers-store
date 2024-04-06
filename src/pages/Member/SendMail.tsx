import React, { useState } from "react";
import { Button, message, Select, Input, Form } from "antd";
import axios from "axios";
import { useFetchMember } from "../../api/members/queries";

const SendMail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | undefined>(
    undefined
  );
  const { data: memberData } = useFetchMember();
  const token = localStorage.getItem("bookRental");

  const onFinish = (values: any) => {
    const { subject, body } = values;
    if (!selectedMember) {
      message.error("Please select a member");
      return;
    }

    setLoading(true);

    const queryParams = `to=${encodeURIComponent(
      selectedMember
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    axios
      .post(
        `https://bookrental-7yd6.onrender.com/lib/members/send-mail?${queryParams}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setSuccess(true);
        message.success("Mail sent successfully");
      })
      .catch((error) => {
        message.error(`Failed: ${error}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Send Mail to Individual Users
      </h2>
      <Form name="sendEmailForm" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="member"
          rules={[{ required: true, message: "Please select a member!" }]}
        >
          <Select
            placeholder="Select Member"
            options={memberData?.map((member: any) => ({
              value: member.email,
              label: member.name,
            }))}
            onChange={(value) => setSelectedMember(value)}
            style={{ marginBottom: "1rem" }}
          />
        </Form.Item>
        <Form.Item
          name="subject"
          rules={[{ required: true, message: "Please enter email subject!" }]}
        >
          <Input placeholder="Subject" />
        </Form.Item>
        <Form.Item
          name="body"
          rules={[{ required: true, message: "Please enter email body!" }]}
        >
          <Input.TextArea placeholder="Body" rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Send Email
          </Button>
        </Form.Item>
      </Form>
      {success && (
        <div className="text-green-600 text-center">
          Email sent successfully!
        </div>
      )}
    </div>
  );
};

export default SendMail;
