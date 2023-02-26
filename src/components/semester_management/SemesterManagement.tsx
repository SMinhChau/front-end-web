import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import style from "./SemesterManagement.module.scss";
import termService from "~/services/term";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

const cls = classNames.bind(style);

interface Term {
    id: number;
    key: number;
    createdAt: Date;
    dateDiscussion: Date;
    dateReport: Date;
    endDate: Date;
    endDateChooseTopic: Date;
    endDateSubmitTopic: Date;
    name: Date;
    startDate: Date;
    startDateChooseTopic: Date;
    startDateSubmitTopic: Date;
    updatedAt: Date;
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
        },
        {
            title: "",
            dataIndex: "id",
            render: (id:any) => <Button onClick={()=>deleteTerm(id)}><DeleteOutlined /></Button>,
        },
        {
            title: "",
            dataIndex: "id",
            render: (id:any) => <Button onClick={()=>showEditModal(id)}><EditOutlined /></Button>,
        },
    ];
    const [terms, setTerms] = useState<Array<Term>>([]);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("insert")
    const [initData, setInitData] = useState({})
    const [idUpdate, setIdUpdate] = useState(null)

    useEffect(() => {
        termService.getTerm({majorsId: 1}).then((result) => {
            setTerms(
                result.data.map((value: any) => {
                    return { ...value, key: value.id };
                })
            );
        });
    }, []);

    const showModal = () => {
        setOpen(true);
        setStatus('insert')
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const onFinish = async (values: any) => {
        values = {
            ...values,
            majorsId:1,
            startDate: values.startDate.format('MM/DD/YYYY'),
            endDate: values.endDate.format('MM/DD/YYYY'),
            startDateSubmitTopic: values.startDateSubmitTopic.format('MM/DD/YYYY'),
            endDateSubmitTopic: values.endDateSubmitTopic.format('MM/DD/YYYY'),
            startDateChooseTopic: values.startDateChooseTopic.format('MM/DD/YYYY'),
            endDateChooseTopic: values.endDateChooseTopic.format('MM/DD/YYYY'),
            dateDiscussion: values.dateDiscussion.format('MM/DD/YYYY'),
            dateReport: values.dateReport.format('MM/DD/YYYY'),
        }
        if(status==='insert'){
            termService.createTerm(values).then(()=>{
                window.location.reload()
            }).catch(err=>{
                toast.info(err.response.data.error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }else{
            termService.update(idUpdate, values).then(()=>{
                window.location.reload()
            }).catch(err=>{
                toast.info(err.response.data.error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }
        

    };

    const deleteTerm = (id:number)=>{
        termService.deleteTerm(id).then(()=>{
            window.location.reload()
        }).catch((err)=>{
            toast.error(err.response.data.error, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }
    const showEditModal = (id:any) =>{
        setOpen(true)
        setStatus('update')
        setIdUpdate(id)
        const term = terms.filter(value=>value.id===id)[0]
        setInitData({
            ...term,
            startDate: moment(term.startDate),
            endDate: moment(term.endDate),
            startDateSubmitTopic: moment(term.startDateSubmitTopic),
            endDateSubmitTopic: moment(term.endDateSubmitTopic),
            startDateChooseTopic: moment(term.startDateChooseTopic),
            endDateChooseTopic: moment(term.endDateChooseTopic),
            dateDiscussion: moment(term.dateDiscussion),
            dateReport: moment(term.dateReport),
        })
    }

    return (
        <div className={cls("semester_management")}>
            <ToastContainer />
            <div className={cls("semester_func")}>
                {/* <h4 className={cls("semester_title")}>Quản lý học kì</h4> */}
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
                        </Button>
                    ]}
                >
                    <Form
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                        initialValues={initData}
                    >
                        <Form.Item
                            label="Tên học kì"
                            rules={[{ required: true }]}
                            name="name"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Ngày bắt đầu"
                            rules={[{ required: true }]}
                            name="startDate"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item
                            label="Ngày kết thúc"
                            rules={[{ required: true }]}
                            name="endDate"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item
                            label="Bắt đầu submit đề tài"
                            rules={[{ required: true }]}
                            name="startDateSubmitTopic"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item
                            label="Kết thúc submit đề tài"
                            rules={[{ required: true }]}
                            name="endDateSubmitTopic"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item
                            label="Bắt đầu chọn đề tài"
                            rules={[{ required: true }]}
                            name="startDateChooseTopic"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item
                            label="Kết thúc chọn đề tài"
                            rules={[{ required: true }]}
                            name="endDateChooseTopic"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>

                        <Form.Item
                            label="Ngày phản biện"
                            rules={[{ required: true }]}
                            name="dateDiscussion"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item
                            label="Báo cáo hội đồng"
                            rules={[{ required: true }]}
                            name="dateReport"
                        >
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item label=" ">
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Table columns={columns} dataSource={terms} />
        </div>
    );
};

export default SemesterManagement;
