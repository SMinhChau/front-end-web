import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from "./StudentManagement.module.scss";
import {
    Table,
    Avatar,
    Button,
    Upload,
    Modal,
    Form,
    Input,
    message,
    Card,
    Select,
    Row,
    Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
    EditOutlined,
} from "@ant-design/icons";
import studentService from "~/services/student";
import Student from "~/entities/student";
import { ToastContainer, toast } from "react-toastify";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useAppSelector } from "~/redux/hooks";
import Config from "~/utils/config";
import ColumnSetting from "../column_setting/ColumnSetting";

const cls = classNames.bind(style);

interface StudentData extends Student {
    key: number;
}

const StudentManagement = () => {
    const baseColumns: ColumnsType<any> = [
        {
            title: "",
            dataIndex: "avatar",
            key: "avatar",
            render: (url) => (
                <Avatar
                    src={url}
                    alt=""
                    size={{ xs: 24, sm: 32, md: 40, lg: 54, xl: 60, xxl: 80 }}
                />
            ),
        },

        {
            title: "MSSV",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Tên Sinh viên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Loại đào tạo",
            dataIndex: "typeTraining",
            key: "typeTraining",
        },
    ];
    const [student, setStudent] = useState<Array<StudentData>>([]);
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const userState = useAppSelector((state) => state.user);
    const [viewType, setviewType] = useState<"table" | "card">("table");
    const [columnVisible, setColumnVisible] = useState<Array<any>>([]);

    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const handleUpload = () => {
        const formData = new FormData();
        formData.append("majors_id", userState.user.majors.id + "");
        formData.append("file", fileList[0] as RcFile);

        setUploading(true);
        studentService
            .importSudent(formData)
            .then(() => {
                setFileList([]);
                message.success("upload successfully.");
            })
            .catch(() => {
                setFileList([]);
                message.error("upload failed.");
            })
            .finally(() => {
                setUploading(false);
            });
    };

    useEffect(() => {
        studentService
            .getStudent({})
            .then((result) => {
                setStudent(
                    result.data.map((value: any) => {
                        return { ...value, key: value.id };
                    })
                );
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
    }, []);

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            console.log(file);

            setFileList([...fileList, file]);

            return false;
        },
        fileList,
    };

    return (
        <div className={cls("student")}>
            <ToastContainer />
            <div className={cls("function")}>
                <div>
                    <label htmlFor="select_view">Hiển thị: </label>
                    <Select
                        defaultValue="table"
                        style={{ width: 120 }}
                        onChange={(value: "table" | "card") => {
                            setviewType(value);
                        }}
                        options={[
                            { value: "table", label: "Bảng" },
                            { value: "card", label: "Thẻ" },
                        ]}
                        id="select_view"
                    />
                </div>

                <div className={cls("upload_group_btn")}>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{
                            margin: "10px",
                            animation: "none",
                            color: "rgb(80, 72, 229)",
                        }}
                        onClick={showModal}
                    >
                        Tạo
                    </Button>
                    <Upload {...props}>
                        <Button
                            type="dashed"
                            icon={<UploadOutlined />}
                            size="large"
                            style={{
                                animation: "none",
                                color: "rgb(80, 72, 229)",
                            }}
                        >
                            Tải lên
                        </Button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{
                            animation: "none",
                            marginLeft: 10,
                        }}
                    >
                        {uploading ? "Uploading" : "Start Upload"}
                    </Button>

                    {viewType === "table" && (
                        <ColumnSetting
                            setColumnVisible={setColumnVisible}
                            columns={baseColumns}
                            cacheKey={Config.STUDENT_CACHE_KEY}
                            style={{ marginLeft: 20 }}
                        />
                    )}
                </div>
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
                        // onFinish={onFinish}
                        // initialValues={initData}
                        style={{ maxWidth: 700 }}
                    >
                        <Form.Item
                            label="Tên học kì"
                            rules={[{ required: true }]}
                            name="name"
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            {viewType === "table" ? (
                <Table
                    dataSource={student}
                    columns={columnVisible}
                    scroll={{ y: 600 }}
                />
            ) : (
                <Row className={cls("card_view")}>
                    {student.map((value) => (
                        <Col span={6}>
                            <Card className={cls("card_item")} key={value.id}>
                                <div className={cls("card_body")}>
                                    <div className={cls("card_top")}>
                                        <img src={value.avatar} alt="" />
                                        <div className={cls("card_func")}>
                                            <Button>
                                                <DeleteOutlined
                                                    style={{ color: "red" }}
                                                />
                                            </Button>
                                            <Button>
                                                <EditOutlined
                                                    style={{ color: "#30a3f1" }}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className={cls("content")}>
                                        <p>{value.name}</p>
                                        <p>{value.gender}</p>
                                        <p>{value.schoolYear}</p>
                                        <p>{value.typeTraining}</p>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default StudentManagement;
