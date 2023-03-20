import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./TopicManagement.module.scss";
import Term from "~/entities/term";
import termService from "~/services/term";
import { useAppSelector } from "~/redux/hooks";
import { Select, Table, Button, Modal, Form, Input } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import topicService from "~/services/topic";
import Topic from "~/entities/topic";
import { default as base_column } from "./column";
import { toast, ToastContainer } from "react-toastify";
import Config from "~/utils/config";
import ColumnSetting from "../column_setting/ColumnSetting";

const cls = classNames.bind(style);

interface TopicData extends Topic {
    key: number;
}

const TopicManagement = () => {
    const userState = useAppSelector((state) => state.user).user;
    const [term, setTerm] = useState<Array<Term>>([]);
    const [topic, setTopic] = useState<Array<TopicData>>([]);
    const [open, setOpen] = useState(false);
    const [termSelect, setTermSelect] = useState<number | null>(null);
    const [status, setStatus] = useState("insert");
    const [initData, setInitData] = useState({});
    const [idUpdate, setIdUpdate] = useState<number | null>(null);
    const [columnVisible, setColumnVisible] = useState<Array<any>>([]);

    const baseColumns = [
        ...base_column,
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: any) => (
                <span
                    style={{
                        padding: "5px 10px",
                        color: "#fff",
                        backgroundColor:
                        status === "PE" ? "#29CC57" : "#FEC400",
                        fontSize: "11px",
                        borderRadius: "100px",
                        fontWeight: "600",
                    }}
                >
                    {status}
                </span>
            ),
        },
        {
            title: "",
            dataIndex: "id",
            render: (id: any) => (
                <Button onClick={() => deleteTerm(id)}>
                    <DeleteOutlined style={{ color: "red" }} />
                </Button>
            ),
        },
        {
            title: "",
            dataIndex: "id",
            render: (id: any) => (
                <Button onClick={() => showEditModal(id)}>
                    <EditOutlined style={{ color: "#30a3f1" }} />
                </Button>
            ),
        },
    ];

    useEffect(() => {
        termService
            .getTerm({ majorsId: userState.majors.id })
            .then((response) => {
                setTerm(response.data.reverse());
            })
            .then((error) => {
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getTopic = (termId: number) => {
        topicService
            .getTopic({
                termId,
                lecturerId: userState.id,
            })
            .then((response) => {
                setTopic(
                    response.data.map((value: Topic) => {
                        return {
                            ...value,
                            key: value.id,
                        };
                    })
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        if (term.length > 0) getTopic(term[0].id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [term]);

    useEffect(() => {
        if (termSelect) {
            getTopic(termSelect);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [termSelect]);

    const showModal = () => {
        setOpen(true);
        setStatus("insert");
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const onFinish = (value: any) => {
        if (status === "insert")
            topicService
                .createTopic({
                    ...value,
                    termId: termSelect ? termSelect : term[0].id,
                })
                .then((_response) => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });
        else
            topicService
                .updateTopic(idUpdate as number, {
                    ...value,
                    termId: termSelect ? termSelect : term[0].id,
                })
                .then((_response) => {
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
    const handleTermChange = (value: number) => {
        setTermSelect(value);
    };

    const deleteTerm = (id: number) => {
        topicService
            .deleteTopic(id)
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
        setOpen(true);
        setStatus("update");
        setIdUpdate(id);
        const t = topic.filter((value) => value.id === id)[0];
        setInitData(t);
    };

    return (
        <div className={cls("topic_management")}>
            <ToastContainer />

            <div className={cls("semester_func")}>
                <div className={cls("selectTerm")}>
                    <div>Học kì: </div>
                    <Select
                        style={{ width: 120 }}
                        onChange={handleTermChange}
                        options={term.map((val) => {
                            return { value: val.id, label: val.name };
                        })}
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
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
                        cacheKey={Config.TOPIC_CACHE_KEY}
                        style={{ marginLeft: 20 }}
                    />
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
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                        initialValues={initData}
                    >
                        <Form.Item
                            label="Tên"
                            rules={[{ required: true }]}
                            name="name"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Số lượng"
                            rules={[{ required: true }]}
                            name="quantityGroupMax"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            rules={[{ required: true }]}
                            name="description"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Ghi chú"
                            rules={[{ required: true }]}
                            name="note"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Mục tiêu"
                            rules={[{ required: true }]}
                            name="target"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Chuẩn đầu ra"
                            rules={[{ required: true }]}
                            name="standradOutput"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Yêu cầu đầu vào"
                            rules={[{ required: true }]}
                            name="requireInput"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Bình luận "
                            rules={[{ required: true }]}
                            name="comment"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label=" ">
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Table columns={columnVisible} dataSource={topic} />
        </div>
    );
};

export default TopicManagement;
