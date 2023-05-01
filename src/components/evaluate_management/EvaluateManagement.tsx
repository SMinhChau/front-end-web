import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./EvaluateManagement.module.scss";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import Term from "~/entities/term";
import termService from "~/services/term";
import { useAppSelector } from "~/redux/hooks";
import Evaluate from "~/entities/evaluate";
import evaluateService from "~/services/evaluate";
import Table, { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import { showMessage, showMessageEror } from "~/constant";

interface EvaluateTableType extends Evaluate {
  key: number;
}

const cls = classNames.bind(style);

const EvaluateManagement = () => {

  const [type, setType] = useState<"ADVISOR" | "REVIEWER" | "SESSION_HOST">(
    "ADVISOR"
  );
  const [evaluate, setEvaluate] = useState<Array<EvaluateTableType>>([]);
  const [open, setOpen] = useState(false);
  const termState = useAppSelector((state) => state.term);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };




  useEffect(() => {
    if (termState.term.length > 0) {
      evaluateService
        .getEvaluate({
          termId: termState.termIndex.id,
          type,
        })
        .then((response) => {
          const _cp_data = response.data.map((val: Evaluate) => {
            return { ...val, key: val.id };
          });
          setEvaluate(_cp_data);
        });
    }
  }, [termState, type]);

  const handleTypeChange = (value: "ADVISOR" | "REVIEWER" | "SESSION_HOST") => {
    setType(value);
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
      termId: termState.termIndex.id,
    };
    evaluateService.insert(data).then((_response) => {
      showMessage("Tạo thành công", 5000)
      window.location.reload();
    }).catch(() => showMessageEror("Tạo thất bại! Vui lòng kiểm tra lại", 3000))
  };

  return (
    <div className={cls("avaluate")}>
      <ToastContainer />
      <div className={cls("function")}>
        <Row justify="space-between" align="middle" style={
          { width: '100%' }
        }>
          <Col >
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
          </Col>
          <Col>
            <div className={cls("content_button_upload")}>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                size="large"
                style={{

                  animation: "none",
                  color: "rgb(80, 72, 229)",
                  fontWeight: "600",
                }}
                onClick={showModal}
              >
                Tạo
              </Button>
            </div>
          </Col>

        </Row>
        <Modal
          destroyOnClose
          open={open}
          title="Tạo tiêu chí chấm điểm"
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
          ]}
        >
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
            onFinish={onFinish}
            size="middle"
          >
            <Form.Item label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]} name="name">
              <Input />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
              name="description"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Điểm"
              rules={[{ required: true, min: 0, max: 10, message: 'Vui lòng nhập điểm' }]}
              name="gradeMax"
            >
              <Input type="number" />
            </Form.Item>

            <Row justify={"end"}>
              <Form.Item label="">
                <Button type="primary" htmlType="submit">
                  Tạo
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Modal>
      </div>
      <Table dataSource={evaluate} columns={baseColumns} />
    </div>
  );
};

export default EvaluateManagement;
