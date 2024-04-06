import React, { useEffect } from "react";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Space,
  message,
  Select,
  InputNumber,
} from "antd";

import {
  useAddTransaction,
  useupdateTransaction,
} from "../../api/transaction/queries";
import { useFetchMember } from "../../api/members/queries";
import { useFetchBook } from "../../api/book/queries";
import dayjs from "dayjs";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface TransactionDataType {
  id: number;
  bookName: string;
  bookId: number;
  fromDate: any;
  toDate: any;
  rentType: string;
  memberName: string;
  Fk_member_id: number;
}

interface CreateTransactionProps {
  setSelectedTransaction?: TransactionDataType | null | undefined;
  selectedTransaction?: TransactionDataType | null | undefined;
  form: FormInstance<any>;
  onSucess: () => void;
}

const CreateTransaction: React.FC<CreateTransactionProps> = ({
  selectedTransaction,
  form,
  onSucess,
}) => {
  const { mutate: addTransaction, isLoading: isAddingTransaction } =
    useAddTransaction();
  const { mutate: editTransaction } = useupdateTransaction();

  const onFinish = (values: any) => {
    let payload: any = {
      bookId: values.bookId,
      fromDate: values.fromDate,
      toDate: values.toDate,
      rentType: "RENT",
      Fk_member_id: values.Fk_member_id,
    };
    if (selectedTransaction) {
      payload = {
        ...payload,
        id: selectedTransaction.id,
        bookName: selectedTransaction.bookId,
        memberName: selectedTransaction.Fk_member_id,
        rentType: undefined,
        fromDate: undefined,
      };
    }
    selectedTransaction
      ? editTransaction(payload, {
          onSuccess: (data) => {
            message.success(`Edited transaction Sucessfully:  ${data}`);
            onSucess();
          },
        })
      : addTransaction(payload, {
          onSuccess: (data) => {
            message.success(`Added transaction Sucessfully:  ${data}`);
            onSucess();
          },
          onError: (errorMessage: any) => {
            message.error(`Failed : ${errorMessage}`);
          },
        });
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (selectedTransaction) {
      form.setFieldsValue({
        id: selectedTransaction.id,
        bookName: selectedTransaction.bookName,
        toDate: dayjs(selectedTransaction.toDate).format("YYYY-MM-DD"),
        rentType: selectedTransaction.rentType,
        memberName: selectedTransaction.memberName,
      });
    }
  }, [selectedTransaction, form]);

  const { data: bookData } = useFetchBook();

  const { data: memberData } = useFetchMember();

  const calculateToDate = (value: any) => {
    if (value === null) {
      form.setFieldsValue({ toDate: null });
    }
    const fromDate = new Date();
    form.setFieldsValue({ fromDate: fromDate.toISOString().split("T")[0] });
    if (fromDate && value) {
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + value);
      form.setFieldsValue({ toDate: toDate.toISOString().split("T")[0] });
    }
  };

  return (
    <div className="bg-white p-6 rounded">
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Book"
          name="bookId"
          rules={[
            {
              required: selectedTransaction ? false : true,
              message: "Please select a book",
            },
          ]}
        >
          <Select
            className="w-full"
            placeholder="Select Book"
            options={bookData?.map((book: { id: any; name: any }) => ({
              value: parseInt(book.id),
              label: book.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Number of Days"
          name="numberOfDays"
          rules={[
            {
              required: selectedTransaction ? false : true,
              message: "Please enter the number of days",
            },
          ]}
        >
          <InputNumber className="w-full" min={0} onChange={calculateToDate} />
        </Form.Item>

        <Form.Item
          label="From Date"
          name="fromDate"
          rules={[
            {
              required: selectedTransaction ? false : true,
              message: "Please select from date",
            },
          ]}
          style={{ display: "none" }}
        >
          <Input
            type="date"
            className="w-full py-2 px-4 border border-gray-900 rounded"
          />
        </Form.Item>

        <Form.Item
          label="Return Date"
          name="toDate"
          rules={[
            {
              required: selectedTransaction ? false : true,
              message: "Please select valid Number of days above",
            },
          ]}
        >
          <Input
            disabled={true}
            className="w-full py-2 px-4 border border-gray-900 rounded"
          />
        </Form.Item>

        <Form.Item
          label="Member"
          name="Fk_member_id"
          rules={[
            {
              required: selectedTransaction ? false : true,
              message: "Please select a member",
            },
          ]}
        >
          <Select
            className="w-full"
            placeholder="Select Member"
            options={memberData?.map(
              (member: { memberid: any; name: any }) => ({
                value: parseInt(member.memberid),
                label: member.name,
              })
            )}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              className="bg-blue-400 text-white font-bold px-4 rounded-full"
              type="default"
              htmlType="submit"
              loading={isAddingTransaction}
            >
              Submit
            </Button>

            <Button
              className="border border-gray-900 py-1 px-5 rounded-full"
              htmlType="button"
              onClick={onReset}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTransaction;
