import React from "react";
import classNames from "classnames/bind";
import style from "./StudentManagement.module.scss";
import { Table, Avatar, Button, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import data from "./data";

const cls = classNames.bind(style);


const StudentManagement = () => {
    const columns: ColumnsType<any> = [
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
            dataIndex: "mssv",
            key: "mssv",
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
            title: "Lớp",
            dataIndex: "class",
            key: "class",
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
        },
    ];
    return (
        <div className={cls("student")}>
            <div className={cls("function")}>
                <h4>Quản lý sinh viên</h4>
                <div>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{
                            margin: "0 10px",
                            animation: "none",
                            color: "rgb(80, 72, 229)",
                        }}
                    >
                        Tạo
                    </Button>
                    <Upload>
                        <Button
                            type="dashed"
                            icon={<UploadOutlined />}
                            size="large"
                            style={{
                                marginBottom: "10px",
                                animation: "none",
                                color: "rgb(80, 72, 229)",
                            }}
                        >
                            Tải lên
                        </Button>
                    </Upload>
                </div>
            </div>
            <Table dataSource={data} columns={columns} />
        </div>
    );
};

export default StudentManagement;
