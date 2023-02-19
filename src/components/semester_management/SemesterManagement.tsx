import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import style from "./SemesterManagement.module.scss";
import termService from "~/services/term";
import moment from "moment";

const cls = classNames.bind(style);

interface Term{
    id: number,
    createdAt: Date,
    dateDiscussion: Date,
    dateReport: Date,
    endDate: Date,
    endDateChooseTopic: Date,
    endDateSubmitTopic: Date,
    name: Date,
    startDate: Date,
    startDateChooseTopic: Date,
    startDateSubmitTopic: Date,
    updatedAt: Date
}

const SemesterManagement = () => {
    const columns = [
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (t: Date) => moment(t).format("DD/MM/YYYY"),
        },
        {
            title: "Kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (t: Date) => moment(t).format("DD/MM/YYYY"),

        },
        {
            title: "Bắt đầu submit đề tài",
            dataIndex: "startDateSubmitTopic",
            key: "startDateSubmitTopic",
            render: (t: Date) => moment(t).format("DD/MM/YYYY"),

        },
        {
            title: "Kết thúc submit đề tài",
            dataIndex: "endDateSubmitTopic",
            key: "enendDateSubmitTopicdDate",
            render: (t: Date) => moment(t).format("DD/MM/YYYY"),

        },
        {
            title: "Bắt đầu chọn đề tài",
            dataIndex: "startDateChooseTopic",
            key: "startDateChooseTopic",
            render: (t: Date) => moment(t).format("DD/MM/YYYY"),

        },
        {
            title: "Kết thúc chọn đề tài",
            dataIndex: "endDateChooseTopic",
            key: "endDateChooseTopic",
            render: (t: Date) => moment(t).format("DD/MM/YYYY"),

        },
        {
            title: "Ngày phản biện",
            dataIndex: "dateDiscussion",
            key: "dateDiscussion",
            render: (t: Date) => moment(t).format("DD/MM/YYYY"),
        },
        {
            title: "Ngày báo cáo",
            dataIndex: "dateReport",
            key: "dateReport",
            render: (t: Date) => moment(t).format("DD/MM/YYYY"),
        }
    ];
    const [terms, setTerms] = useState<Array<Term>>([])

    useEffect(() => {
        termService.getTerm(1).then(result =>{
            setTerms(result.data)            
        })
    }, [])
    
    return (
        <div className={cls("semester_management")}>
            <div className={cls("semester_func")}>
                <h4 className={cls("semester_title")}>Quản lý học kì</h4>
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
            <Table columns={columns} dataSource={terms} />
        </div>
    );
};

export default SemesterManagement;
