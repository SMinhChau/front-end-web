import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { ToastContainer } from "react-toastify";
import classNames from "classnames/bind";
import { PlusOutlined } from "@ant-design/icons";
import style from "./MajorManagement.module.scss";
import type { ColumnsType } from "antd/es/table";
import headOfLecturerService from "~/services/headOfLecturer";

const cls = classNames.bind(style);

const MajorManagement = () => {
    const columns: ColumnsType<any> = [
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Chủ nhiệm ngành",
            dataIndex: "headLecturer",
            key: "headLecturer",
        },
    ];

    const [headLecture, setHeadLecture] = useState([]);
    useEffect(() => {
        headOfLecturerService.getAll().then((result) => {
            console.log(result);
        });
    }, []);

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
                >
                    Tạo
                </Button>
            </div>
            <Table dataSource={[]} columns={columns} />
        </div>
    );
};

export default MajorManagement;
