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

const cls = classNames.bind(style);

interface TopicData extends Term {
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

    const column = [
        ...base_column,
        {
            title: "",
            dataIndex: "id",
            render: (id: any) => (
                <Button onClick={() => deleteTerm(id)}>
                    <DeleteOutlined style={{color: 'red'}}/>
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

    useEffect(() => {
        termService
            .getTerm({ majorsId: userState.majors.id })
            .then((response) => {
                setTerm(response.data);
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
                    <div>H???c k??: </div>
                    <Select
                        style={{ width: 120 }}
                        onChange={handleTermChange}
                        options={term.map((val) => {
                            return { value: val.id, label: val.name };
                        })}
                    />
                </div>
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
                    T???o
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
                        initialValues={initData}
                    >
                        <Form.Item
                            label="T??n"
                            rules={[{ required: true }]}
                            name="name"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="S??? l?????ng"
                            rules={[{ required: true }]}
                            name="quantityGroupMax"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="M?? t???"
                            rules={[{ required: true }]}
                            name="description"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Ghi ch??"
                            rules={[{ required: true }]}
                            name="note"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="M???c ti??u"
                            rules={[{ required: true }]}
                            name="target"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Chu???n ?????u ra"
                            rules={[{ required: true }]}
                            name="standradOutput"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Y??u c???u ?????u v??o"
                            rules={[{ required: true }]}
                            name="requireInput"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="B??nh lu???n "
                            rules={[{ required: true }]}
                            name="comment"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label=" ">
                            <Button type="primary" htmlType="submit">
                                L??u
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Table columns={column} dataSource={topic} />
        </div>
    );
};

export default TopicManagement;
