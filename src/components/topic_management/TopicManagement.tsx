import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./TopicManagement.module.scss";
import moment from "moment";
import Term from "~/entities/term";
import termService from "~/services/term";
import { useAppSelector } from "~/redux/hooks";
import { Select, Table, Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import topicService from "~/services/topic";
import Topic from "~/entities/topic";
import column from "./column";

const cls = classNames.bind(style);

const TopicManagement = () => {
    const userState = useAppSelector((state) => state.user).user;
    const [term, setTerm] = useState<Array<Term>>([]);
    const [topic, setTopic] = useState<Array<Topic>>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        termService
            .getTerm({ majorsId: userState.majors.id })
            .then((response) => {
                setTerm(response.data);
            })
            .then((error) => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        if (term.length > 0)
            topicService
                .getTopic({
                    termId: term[0].id,
                    lecturerId: userState.id,
                })
                .then((response) => {
                    setTopic(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
    }, [term]);

    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const onFinish = (value: any) => {
        topicService
            .createTopic({ ...value, termId: term[0].id })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className={cls("topic_management")}>
            <div className={cls("semester_func")}>
                <Select
                    style={{ width: 120 }}
                    //onChange={handleChange}
                    options={term.map((val) => {
                        return { value: val.id, label: val.name };
                    })}
                />
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
                        </Button>,
                    ]}
                >
                    <Form
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                        //initialValues={initData}
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
            <Table columns={column} dataSource={topic} />
        </div>
    );
};

export default TopicManagement;
