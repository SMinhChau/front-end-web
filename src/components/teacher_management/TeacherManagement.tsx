import React from "react";
import classNames from "classnames/bind";
import style from "./TeacherManagement.module.scss";
import { Table, Avatar, Button, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

const data = require("./data.json");

interface DataType {
    key: string;
    avatar: string;
    name: number;
    role: string;
    birthday: string;
    status: string;
}

const ColumeStatus = ({ text }: { text: string }) => {
    return (
        <span
            style={{
                padding: "5px 10px",
                color: "#fff",
                backgroundColor: text === "Đang Dạy" ? "#29CC57" : "#FEC400",
                fontSize: "11px",
                borderRadius: "100px",
                fontWeight: "600",
            }}
        >
            {text}
        </span>
    );
};

const cls = classNames.bind(style);

const TeacherManagement = () => {
    const columns: ColumnsType<DataType> = [
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
            title: "Tên giảng viên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Cấp bậc",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Ngày sinh",
            dataIndex: "birthday",
            key: "birthday",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text: string) => <ColumeStatus text={text} />,
        },
    ];

    return (
        <div className={cls("teacher_management")}>
            <div className={cls("function")}>
                <h4>Quản lý giảng viên</h4>
                <div>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{ margin: "0 10px", animation: "none", color:'rgb(80, 72, 229)' }}
                    >
                        Tạo
                    </Button>
                    <Upload>
                        <Button
                            type="dashed"
                            icon={<UploadOutlined />}
                            size="large"
                            style={{ marginBottom: "10px", animation: "none", color:'rgb(80, 72, 229)' }}
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

export default TeacherManagement;
