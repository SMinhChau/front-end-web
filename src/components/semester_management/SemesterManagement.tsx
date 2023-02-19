import React from "react";
import { Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import style from "./SemesterManagement.module.scss";

const cls = classNames.bind(style);

const data = [
    {
        key: 1,
        name: "Học kì 1",
        time: new Date(),
    },
];

const SemesterManagement = () => {
    const columns = [
        {
            title: "Tên học kỳ",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Thời gian",
            dataIndex: "time",
            key: "time",
            render: (t: Date) => <div>{t.toISOString()}</div>,
        },
    ];

    return (
        <div className={cls("semester_management")}>
            <div className={cls("semester_func")}>
                <h4 className={cls('semester_title')}>Quản lý học kì</h4>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{ marginBottom: "10px", animation: "none", color:'rgb(80, 72, 229)', fontWeight: "600" }}
                >
                    Tạo
                </Button>
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default SemesterManagement;
