import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./EvaluateManagement.module.scss";
import { Button, Form, Input, Modal, Select } from "antd";
import Term from "~/entities/term";
import termService from "~/services/term";
import { useAppSelector } from "~/redux/hooks";
import Evaluate from "~/entities/evaluate";
import evaluateService from "~/services/evaluate";
import Table, { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";

interface EvaluateTableType extends Evaluate {
    key: number;
}

const cls = classNames.bind(style);

const EvaluateManagement = () => {
    const [term, setTerm] = useState<Array<Term>>([]);
    const { user } = useAppSelector((state) => state.user);
    const [type, setType] = useState<"ADVISOR" | "REVIEWER" | "SESSION_HOST">(
        "ADVISOR"
    );
    const [termSelect, setTermSelect] = useState<number | null>(null);
    const [evaluate, setEvaluate] = useState<Array<EvaluateTableType>>([]);
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    useEffect(() => {
        termService
            .getTerm({ majorsId: user.majors.id })
            .then((response) => {
                setTerm(response.data);
                setTermSelect(response.data[0].id);
            })
            .catch((err) => {
                console.log(err);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (term.length > 0) {
            evaluateService
                .getEvaluate({
                    termId: termSelect ? termSelect : term[0].id,
                    type,
                })
                .then((response) => {
                    const _cp_data = response.data.map((val: Evaluate) => {
                        return { ...val, key: val.id };
                    });
                    setEvaluate(_cp_data);
                });
        }
    }, [termSelect, term, type]);

    const handleTypeChange = (
        value: "ADVISOR" | "REVIEWER" | "SESSION_HOST"
    ) => {
        setType(value);
    };

    const handleTermChange = (value: number) => {
        setTermSelect(value);
    };

    const baseColumns: ColumnsType<any> = [
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Điểm tối đa",
            dataIndex: "gradeMax",
            key: "gradeMax",
        },
    ];

    const onFinish = (value: any) => {
        const data = {
            ...value,
            type,
            termId: termSelect,
        };
        evaluateService.insert(data).then((_response) => {
            window.location.reload();
        });
    };

    return (
        <div className={cls("avaluate")}>
            <div className="filter_func">
                <div>
                    <span>Loại: </span>
                    <Select
                        defaultValue="ADVISOR"
                        style={{ width: 120 }}
                        onChange={handleTypeChange}
                        options={[
                            { value: "ADVISOR", label: "Hướng Dẫn" },
                            { value: "REVIEWER", label: "Phản biện" },
                            { value: "SESSION_HOST", label: "Hội Đồng" },
                        ]}
                    />
                </div>
                <div>
                    <span>Học kì: </span>
                    {term.length > 0 && (
                        <Select
                            defaultValue={term[0].id}
                            style={{ width: 120 }}
                            onChange={handleTermChange}
                            options={term.map((val) => {
                                return {
                                    value: val.id,
                                    label: val.name,
                                };
                            })}
                        />
                    )}
                </div>
            </div>
            <div>
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
                    >
                        <Form.Item
                            label="Tên"
                            rules={[{ required: true }]}
                            name="name"
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
                            label="Điểm"
                            rules={[{ required: true, min: 0, max: 10 }]}
                            name="gradeMax"
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item label=" ">
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Table dataSource={evaluate} columns={baseColumns} />
        </div>
    );
};

export default EvaluateManagement;
