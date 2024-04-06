import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Button,
  Drawer,
  message,
  Popconfirm,
  Form,
  Input,
  Upload,
  Modal,
} from "antd";
import type { TableProps } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;

import CreateMember from "./CreateMember";

import {
  useFetchMember,
  useDeleteMember,
  useFindMemberById,
  useDownloadMemberDetails,
  useUploadMemberDetails,
} from "../../api/members/queries";

interface MemberDataType {
  memberid: string;
  name: string;
  email: string;
  mobileNo: string;
  address: string;
}

const MemberSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberDataType | any>(
    null
  );
  const [findTheMember, setFindTheMember] = useState<MemberDataType | any>(
    null
  );
  const [findByName, setFindByName] = useState<MemberDataType | any>(null);
  const [inputValueIsNumber, setInputValueIsNumber] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [form] = Form.useForm();
  const [inputForm] = Form.useForm();
  const [uploadForm] = Form.useForm();

  const [searchedMemberId, setSearchedMemberId] = useState<
    MemberDataType | any
  >("");
  const [page, setPage] = React.useState(1);

  const columns: TableProps<MemberDataType>["columns"] = [
    {
      title: "SN",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (page - 1) * 7 + index + 1,
      sorter: (a, b) => {
        const numA = parseInt(a.memberid, 10);
        const numB = parseInt(b.memberid, 10);
        return numA - numB;
      },
      sortDirections: ["descend"],
      defaultSortOrder: "ascend",
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditDrawer(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this member?"
            onConfirm={() => handleDelete(record.memberid)}
            okText="Yes"
            okButtonProps={{ danger: true }}
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showEditDrawer = (member: MemberDataType) => {
    form.setFieldsValue(member);
    setSelectedMember(member);
    setOpen(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    refetchMember();
    setSelectedMember(null);
    setSearchedMemberId(searchedMemberId);
  };

  const { mutate: deleteThisMember } = useDeleteMember();

  const handleDelete = (memberID: any) => {
    deleteThisMember(memberID, {
      onSuccess: (data) => {
        message.success(`Deleted member Successfully ${data}`);
        setFindTheMember(null);
        refetchMember();
      },
    });
  };

  const handleDownloadMemberDetails = () => {
    downloadMembers(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "member_details.xlsx";
        link.click();
      },
      onError: (data) => {
        message.error(`Failed to Download: ${data}`);
      },
    });
  };

  const {
    data: memberData,
    isLoading: isLoadingMemberData,
    refetch: refetchMember,
  } = useFetchMember();

  const { mutate: downloadMembers } = useDownloadMemberDetails();

  const { data: findMember, refetch: refetchFindMember } =
    useFindMemberById(searchedMemberId);

  const searchById = (values: any) => {
    setSearchedMemberId(values.memberId.trim());
  };

  const handleNameChange = (event: any) => {
    if (event.target.value === "") {
      setFindTheMember(null);
      setSearchedMemberId("");
      setInputValueIsNumber(false);
    } else if (!isNaN(event.target.value)) {
      setInputValueIsNumber(true);
    }
    setSearchText(event.target.value.trim());
  };

  useEffect(() => {
    const searchedMembers = memberData?.filter((member: MemberDataType) => {
      return Object.values(member).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFindByName(searchedMembers);
  }, [searchText, memberData]);

  useEffect(() => {
    if (searchedMemberId) {
      setFindTheMember(findMember);
    }
  }, [searchedMemberId, refetchFindMember, findMember]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [fileList, setFileList] = useState<any[]>([]);
  const { mutate: uploadMember } = useUploadMemberDetails();

  const props: UploadProps = {
    name: "file",
    fileList: fileList,
    action: "",
    beforeUpload: (file: File) => {
      const isExcel =
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        message.error("You can only upload Excel files!");
        return false;
      }
      setFileList([file]);
      onFinish(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const onFinish = (e: any) => {
    let payload = {
      file: e.file.file,
    };
    uploadMember(payload, {
      onSuccess: () => {
        message.success("Sucessfully uploaded");
        setIsModalOpen(false);
        refetchMember();
      },
      onError: (data) => {
        message.error(`Failed ${data}`);
      },
    });
  };

  return (
    <div className="flex-grow mx-10 mt-5 max-h-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Member Setup</h2>
        <Button
          className="bg-white text-black font-bold py-1 px-4 rounded-full transform hover:scale-105 hover:shadow-md"
          type="default"
          onClick={showDrawer}
        >
          Create
        </Button>
        <Drawer
          className="flex"
          width={800}
          autoFocus
          title={selectedMember ? "Edit Member" : "Create Member"}
          onClose={onClose}
          open={open}
        >
          <div className="flex-auto">
            <CreateMember
              selectedMember={selectedMember}
              form={form}
              onSucess={onClose}
            />
          </div>
        </Drawer>
      </div>
      <div className=" flex flex-wrap items-center">
        <Form
          form={inputForm}
          onFinish={searchById}
          className="flex items-center mb-0"
        >
          <Form.Item name="memberId" className="mr-2 w-50">
            <Input
              placeholder="Search"
              value={
                searchedMemberId
                  ? searchedMemberId
                  : searchText
                  ? searchText
                  : ""
              }
              onChange={handleNameChange}
              className="border-2 border-blue-500 focus:border-blue-700 rounded-md  outline-none font-extrabold"
            />
          </Form.Item>

          {inputValueIsNumber && (
            <Form.Item className="">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2  rounded-lg"
                type="default"
                htmlType="submit"
              >
                Search By Id ??
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
      <Table
        columns={columns}
        dataSource={
          findTheMember ? [findTheMember] : findByName ? findByName : memberData
        }
        loading={isLoadingMemberData}
        rowKey="memberid"
        pagination={{
          pageSize: 7,
          responsive: true,
          onChange(current) {
            setPage(current);
          },
        }}
      />

      <Button
        className=" mb-4  bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        type="default"
        onClick={handleDownloadMemberDetails}
        icon={<DownloadOutlined />}
      >
        Download Member Details
      </Button>

      <Button
        className="ml-4 bg-blue-500  text-white font-bold px-2 rounded"
        icon={<UploadOutlined />}
        onClick={showModal}
      >
        Upload Member Data in Excel
      </Button>

      <Modal
        footer
        title="Upload Member Data"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={uploadForm}
          onFinish={onFinish}
          className="flex flex-col justify-between h-full"
        >
          <Form.Item name="file" className="mb-4">
            <Dragger name="file" {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Please note: Ensure that you only upload Excel files, and ensure
                that your Excel file's columns are properly formatted. Thank
                you.
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2  rounded-lg mt-2 mb-0  absolute left-52"
              type="default"
              htmlType="submit"
            >
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberSetup;
