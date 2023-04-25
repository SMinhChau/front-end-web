import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./TopicManagement.module.scss";
import Term from "~/entities/term";
import termService from "~/services/term";
import { useAppSelector } from "~/redux/hooks";
import { Select, Table, Button, Modal, Form, Input } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import topicService from "~/services/topic";
import Topic from "~/entities/topic";
import { default as base_column } from "./column";
import { ToastContainer } from "react-toastify";
import Config from "~/utils/config";
import ColumnSetting from "../column_setting/ColumnSetting";
const { TextArea } = Input;

const cls = classNames.bind(style);

interface TopicData extends Topic {
    key: number;
}

const HEADTopicManagement = () => {
    const userState = useAppSelector((state) => state.user).user;

    const [topic, setTopic] = useState<Array<TopicData>>([]);
    const [open, setOpen] = useState(false);

    const [status, setStatus] = useState<"ACCEPT" | "REFUSE">("ACCEPT");
    const [idUpdate, setIdUpdate] = useState<number | null>(null);
    const [columnVisible, setColumnVisible] = useState<Array<any>>([]);

    const termState = useAppSelector((state) => state.term);

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
                            status === "PEDING" ? "#29CC57" : "#FEC400",
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
            render: (row: any) => {
                console.log("row.status", row.status);

                return row.status === "PEDING" ? (
                    <Button onClick={() => accept(row.id)}>
                        <CheckOutlined style={{ color: "red" }} />
                    </Button>
                ) : (
                    <></>
                );
            },
        },
        {
            title: "",
            render: (row: any) => {
                return row.status === "PEDING" ? (
                    <Button onClick={() => reject(row.id)}>
                        <CloseOutlined style={{ color: "#30a3f1" }} />
                    </Button>
                ) : (
                    <></>
                );
            },
        },
    ];


    useEffect(() => {
        if (termState.termSelected) {
            topicService
                .getTopic({ termId: termState.termSelected })
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
        }
    }, [termState]);


    console.log("topiv", topic);
    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const onFinish = (value: any) => {
        const data = {
            status,
            ...value,
        };
        topicService.updateTopic(idUpdate as number, data).then(() => {
            window.location.reload();
        });
    };


    const accept = (id: number) => {
        setStatus("ACCEPT");
        setIdUpdate(id);
        showModal();
    };
    const reject = (id: number) => {
        setStatus("REFUSE");
        setIdUpdate(id);
        showModal();
    };

    return (
        <div className={cls("topic_management")}>
            <ToastContainer />

            <div className={cls("semester_func")}>
                <div className={cls("selectTerm")}></div>
                <div style={{ display: "flex", alignItems: "center" }}>
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
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                    >
                        <Form.Item name="comment" label="Comment">
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Table columns={columnVisible} dataSource={topic} />
        </div>
    );
};

export default HEADTopicManagement;
