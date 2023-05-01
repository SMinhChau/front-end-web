import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, Select, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import style from "./SemesterManagement.module.scss";
import termService from "~/services/term";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import Term from "~/entities/term";
import ColumnSetting from "../column_setting/ColumnSetting";
import Config from "~/utils/config";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { setTermSlice } from "~/redux/slices/term_slice";
import { showMessage, showMessageEror } from "~/constant";

const cls = classNames.bind(style);
const { Option } = Select;

const SemesterManagement = () => {
    const baseColumns = [
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Bắt đầu submit đề tài",
            dataIndex: "startDateSubmitTopic",
            key: "startDateSubmitTopic",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Kết thúc submit đề tài",
            dataIndex: "endDateSubmitTopic",
            key: "enendDateSubmitTopicdDate",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Bắt đầu chọn đề tài",
            dataIndex: "startDateChooseTopic",
            key: "startDateChooseTopic",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Kết thúc chọn đề tài",
            dataIndex: "endDateChooseTopic",
            key: "endDateChooseTopic",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Thời gian bắt đầu Phản biện",
            dataIndex: "startDateDiscussion",
            key: "startDateDiscussion",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Thời gian kết thúc Phản biện",
            dataIndex: "endDateDiscussion",
            key: "endDateDiscussion",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },

        {
            title: "Ngày phản biện",
            dataIndex: "dateDiscussion",
            key: "dateDiscussion",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Thời gian bắt đầu Báo cáo",
            dataIndex: "startDateReport",
            key: "startDateReport",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Thời gian kết thúc Báo cáo",
            dataIndex: "endDateReport",
            key: "endDateReport",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },

        {
            title: "Ngày báo cáo",
            dataIndex: "dateReport",
            key: "dateReport",
            render: (t: Date) => moment(t).format("MM/DD/YYYY"),
        },
        {
            title: "Xóa",
            dataIndex: "id",
            render: (id: any) => (
                <Button onClick={() => deleteTerm(id)}>
                    <DeleteOutlined style={{ color: "red" }} />
                </Button>
            ),
        },
        {
            title: "Sửa",
            dataIndex: "id",
            render: (id: any) => (
                <Button onClick={() => showEditModal(id)}>
                    <EditOutlined style={{ color: "#30a3f1" }} />
                </Button>
            ),
        },
    ];
    const [terms, setTerms] = useState<Array<Term>>([]);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("insert");
    const [initData, setInitData] = useState({});
    const [idUpdate, setIdUpdate] = useState(null);
    const [columnVisible, setColumnVisible] = useState<Array<any>>([]);
    const user = useAppSelector((state) => state.user.user)
    const [termNameDefault, setTermNameDefault] = useState('')
    const dispatch = useAppDispatch();

    useEffect(() => {
        termService.getTerm({ majorsId: 1 }).then((result) => {
            dispatch(setTermSlice(result.data))
            setTerms(
                result.data.map((value: any) => {
                    return { ...value, key: value.id };
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
    };

    const onFinish = async (values: any) => {
        let nameDefault = '';
        const startDateDefaul = moment(values.startDate).year();
        const endDateDefaul = moment(values.endDate).year();
        nameDefault = values.name + " " + `${startDateDefaul}` + "-" + `${endDateDefaul}`;
        values = {
            ...values,
            name: nameDefault,
            majorsId: user.majors.id,
            startDate: values.startDate.format("MM/DD/YYYY"),
            endDate: values.endDate.format("MM/DD/YYYY"),
            startDateSubmitTopic:
                values.startDateSubmitTopic.format("MM/DD/YYYY"),
            endDateSubmitTopic: values.endDateSubmitTopic.format("MM/DD/YYYY"),
            startDateChooseTopic:
                values.startDateChooseTopic.format("MM/DD/YYYY"),
            endDateChooseTopic: values.endDateChooseTopic.format("MM/DD/YYYY"),
            startDateDiscussion: values.startDateDiscussion.format("MM/DD/YYYY"),
            endDateDiscussion: values.endDateDiscussion.format("MM/DD/YYYY"),
            dateDiscussion: values.dateDiscussion.format("MM/DD/YYYY"),
            startDateReport: values.startDateReport.format("MM/DD/YYYY"),
            endDateReport: values.endDateReport.format("MM/DD/YYYY"),
            dateReport: values.dateReport.format("MM/DD/YYYY"),
        };

        if (status === "insert") {

            console.log("valuues 1", values);
            // let yearValue = moment(values.startDate).year();
            // const momentValue = moment(values.startDate).month();
            // if (momentValue >= 0 && momentValue <= 5) {
            //     console.log("111111", yearValue);
            //     yearValue = yearValue - 1;
            //     nameDefault = values.name + `${yearDefaul}` + `${yearValue}`
            // } else {

            //     yearValue = yearValue + 1;
            //     console.log("222222", yearValue);
            //     nameDefault = values.name + `${yearDefaul}` + `${yearValue}`
            // }



            termService
                .createTerm({ ...values })
                .then(() => {
                    showMessage("Tạo học kỳ thành công", 3000);
                    window.location.reload();
                })
                .catch((err) => {
                    console.log("err", err);
                    showMessageEror(err.response.data.error, 3000)
                });
        } else {
            termService
                .update(idUpdate, values)
                .then(() => {
                    showMessage("Cập nhật học kỳ thành công", 5000);
                    window.location.reload();
                })
                .catch((err) => {
                    showMessageEror(err.response.data.error, 5000)
                    console.log("err.response.data.error", err.response.data.error);

                });
        }
    };

    const deleteTerm = (id: number) => {
        termService
            .deleteTerm(id)
            .then(() => {
                showMessage("Xóa thành công", 300)
                window.location.reload();
            })
            .catch((err) => {
                showMessageEror(err.response.data.error, 5000)
            });
    };
    const showEditModal = (id: any) => {
        setOpen(true);
        setStatus("update");
        setIdUpdate(id);
        const term = terms.filter((value) => value.id === id)[0];
        setTermNameDefault(String(term?.name))
        setInitData({
            ...term,
            startDate: moment(term.startDate).format("MM/DD/YYYY"),
            endDate: moment(term.endDate).format("MM/DD/YYYY"),
            startDateSubmitTopic: moment(term.startDateSubmitTopic).format("MM/DD/YYYY"),
            endDateSubmitTopic: moment(term.endDateSubmitTopic).format("MM/DD/YYYY"),
            startDateChooseTopic: moment(term.startDateChooseTopic).format("MM/DD/YYYY"),
            endDateChooseTopic: moment(term.endDateChooseTopic).format("MM/DD/YYYY"),
            startDateDiscussion: moment(term.startDateDiscussion).format("MM/DD/YYYY"),
            endDateDiscussion: moment(term.endDateDiscussion).format("MM/DD/YYYY"),
            dateDiscussion: moment(term.dateDiscussion).format("MM/DD/YYYY"),
            startDateReport: moment(term.startDateReport).format("MM/DD/YYYY"),
            endDateReport: moment(term.endDateReport).format("MM/DD/YYYY"),
            dateReport: moment(term.dateReport).format("MM/DD/YYYY"),
        });
    };

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    const data = [
        {
            value: "Học Kỳ 1",
            label: "Học Kỳ 1",
        },
        {
            value: "Học Kỳ 2",
            label: "Học Kỳ 2",
        },
    ]

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
                <ColumnSetting
                    setColumnVisible={setColumnVisible}
                    columns={baseColumns}
                    cacheKey={Config.SEMESTER_CACHE_KEY}
                />
                <Modal
                    destroyOnClose
                    open={open}
                    title="Tạo học kỳ"
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Cancel
                        </Button>
                    ]}
                    style={{ maxWidth: 1000 }}
                >

                    <div className={cls('form_content')}>

                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            layout="horizontal"

                            onFinish={onFinish}

                            initialValues={initData}
                        >
                            {/* <Form.Item
                            label="Tên học kì"
                            rules={[{ required: true }]}
                            name="name"
                        >
                            <Input />
                        </Form.Item> */}


                            <Form.Item
                                label="Tên học kỳ"
                                rules={[{ required: true }]}
                                name="name"
                            >
                                <Select

                                    style={{ width: "50%" }}
                                    placeholder={termNameDefault ? termNameDefault : 'Tên học kỳ'}
                                    onChange={handleChange}
                                    optionLabelProp="label"
                                    options={
                                        data
                                    }
                                />

                            </Form.Item>


                            <Form.Item
                                label="Ngày bắt đầu"
                                rules={[{ required: true }]}
                                name="startDate"

                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>



                            <Form.Item

                                label="Ngày kết thúc"
                                rules={[{ required: true }]}
                                name="endDate"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>





                            <Form.Item
                                label="Bắt đầu submit đề tài"
                                rules={[{ required: true }]}
                                name="startDateSubmitTopic"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>
                            <Form.Item
                                label="Kết thúc submit đề tài"
                                rules={[{ required: true }]}
                                name="endDateSubmitTopic"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>


                            <Form.Item
                                label="Bắt đầu chọn đề tài"
                                rules={[{ required: true }]}
                                name="startDateChooseTopic"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>
                            <Form.Item
                                label="Kết thúc chọn đề tài"
                                rules={[{ required: true }]}
                                name="endDateChooseTopic"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>



                            <Form.Item
                                label="Thời gian bắt đầu phản biện"
                                rules={[{ required: true }]}
                                name="startDateDiscussion"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>
                            <Form.Item
                                label="Thời gian kết thúc phản biện"
                                rules={[{ required: true }]}
                                name="endDateDiscussion"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>
                            <Form.Item
                                label="Ngày phản biện"
                                rules={[{ required: true }]}
                                name="dateDiscussion"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>


                            <Form.Item
                                label="Thời gian bắt đầu báo cáo"
                                rules={[{ required: true }]}
                                name="startDateReport"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>
                            <Form.Item
                                label="Thời gian kết thúc báo cáo"
                                rules={[{ required: true }]}
                                name="endDateReport"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>
                            <Form.Item
                                label="Báo cáo hội đồng"
                                rules={[{ required: true }]}
                                name="dateReport"
                            >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>



                            <Form.Item label=" ">
                                <Button type="primary" htmlType="submit">
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div>
            <Table
                columns={columnVisible}
                dataSource={terms}
                style={{ backgroundColor: "#fff" }}
            />
        </div>
    );
};

export default SemesterManagement;
