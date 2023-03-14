import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { ToastContainer, toast } from "react-toastify";
import classNames from "classnames/bind";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import style from "./MajorManagement.module.scss";
import type { ColumnsType } from "antd/es/table";
import headOfLecturerService from "~/services/headOfLecturer";
import majorService from "~/services/major";

const cls = classNames.bind(style);

interface Major {
    id: number;
    name: String;
    headName?: string;
    headID?: number;
}

interface HeadLecturer {
    value: number;
    label: string;
}

const MajorManagement = () => {
    const columns: ColumnsType<any> = [
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Chủ nhiệm ngành",
            dataIndex: "headName",
            key: "headName",
        },
        {
            title: "",
            dataIndex: "id",
            render: (id: any) => (
                <Button onClick={() => deleteMajor(id)}>
                    <DeleteOutlined style={{color: 'red'}} />
                </Button>
            ),
        },
        {
            title: "",
            dataIndex: "id",
            render: (id: any) => (
                <Button onClick={() => showEditModal(id)}>
                    <EditOutlined style={{color: '#30a3f1'}}/>
                </Button>
            ),
        },
    ];

    const [headLecture, setHeadLecture] = useState<Array<HeadLecturer>>([]);
    const [major, setMajor] = useState<Array<Major>>([]);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("insert");
    const [initData, setInitData] = useState<{
        name: string;
        headLecturerId: number | null;
    }>({ name: "", headLecturerId: null });
    const [updateId, setUpdateId] = useState<number | null>(null);

    useEffect(() => {
        headOfLecturerService.getAll().then((result) => {
            setHeadLecture(
                result.data.map((value: any) => {
                    return {
                        value: value.id,
                        label: value.name,
                    };
                })
            );
        });
    }, []);

    useEffect(() => {
        majorService.getMajor().then((result) => {
            setMajor(
                result.data.map((value: any) => {
                    return {
                        id: value.id,
                        key: value.id,
                        name: value.name,
                        headName: value.headLecturer?.name,
                        headID: value.headLecturer?.id,
                    };
                })
            );
        });
    }, []);

    const showModal = () => {
        setOpen(true);
        setStatus("insert");
    };

    const handleCancel = () => {
        setOpen(false);
        setInitData({
            name: "",
            headLecturerId: null,
        });
    };

    const deleteMajor = (id: number) => {
        majorService
            .deleteMajor(id)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                toast.info(error.response.data.error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };

    const showEditModal = (id: number) => {
        setUpdateId(id);
        setOpen(true);
        setStatus("update");
        const m = major.filter((value) => value.id === id)[0];
        setInitData((prev: any) => {
            return { ...prev, name: m.name, headLecturerId: m.headID };
        });
    };

    const onFinish = (value: { name: string; headLecturerId: number }) => {
        if (status === "insert")
            majorService
                .createMajor(value)
                .then(() => {
                    window.location.reload();
                })
                .catch((error) => {
                    toast.info(error.response.data.error, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                });
        else {
            majorService
                .updateMajor(updateId as number, value)
                .then(() => {
                    window.location.reload();
                })
                .catch((error) => {
                    toast.info(error.response.data.error, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                });
        }
    };

    return (
        <div className={cls("major_management")}>
            <ToastContainer />
            <div className={cls("major_func")}>
                <h4 className={cls("major_title")}>Quản lý chuyên ngành</h4>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{
                        marginBottom: "10px",
                        animation: "none",
                        color: "rgb(80, 72, 229)",
                        fontWeight: "600",
                    }}
                    onClick={showModal}
                >
                    Tạo
                </Button>
                <Modal
                    destroyOnClose
                    open={open}
                    title="Title"
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >
                    <Form
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                        initialValues={status === "insert" ? {} : initData}
                    >
                        <Form.Item
                            label="Tên chuyên ngành"
                            rules={[{ required: true }]}
                            name="name"
                        >
                            <Input />
                        </Form.Item>
                        {status === "update" && (
                            <Form.Item
                                label="Head Lecturer"
                                rules={[{ required: true }]}
                                name="headLecturerId"
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? "").includes(input)
                                    }
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? "")
                                            .toLowerCase()
                                            .localeCompare(
                                                (
                                                    optionB?.label ?? ""
                                                ).toLowerCase()
                                            )
                                    }
                                    options={headLecture}
                                />
                            </Form.Item>
                        )}

                        <Form.Item label=" ">
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Table dataSource={major} columns={columns} />
        </div>
    );
};

export default MajorManagement;
