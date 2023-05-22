import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import style from './EvaluateManagement.module.scss';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Tooltip, Typography } from 'antd';
import { useAppSelector } from 'src/redux/hooks';
import Evaluate from 'src/entities/evaluate';
import evaluateService from 'src/services/evaluate';
import Table, { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { ToastContainer } from 'react-toastify';
import { ErrorCodeDefine, checkPoint, showMessage, showMessageEror } from '../../constant';
import TextArea from 'antd/es/input/TextArea';

interface EvaluateTableType extends Evaluate {
  key: number;
}

const cls = classNames.bind(style);
const { Text } = Typography;

const EvaluateManagement = () => {
  const [type, setType] = useState<'ADVISOR' | 'REVIEWER' | 'SESSION_HOST'>('ADVISOR');
  const [evaluate, setEvaluate] = useState<Array<EvaluateTableType>>([]);
  const [open, setOpen] = useState(false);
  const termState = useAppSelector((state) => state.term);
  const [status, setStatus] = useState('insert');
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [initData, setInitData] = useState<{
    type: string;
    termId: number;
    name: string;
    gradeMax: number;
    description: string;
  }>({
    type: '',
    termId: NaN,
    name: '',
    gradeMax: NaN,
    description: '',
  });

  const [avgGrader, setAvgGrader] = useState(0);

  const showModal = () => {
    setOpen(true);
    setStatus('insert');
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    getListOfEvaluate();
  }, [termState, type]);

  const getListOfEvaluate = () => {
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
  };

  const handleTypeChange = (value: 'ADVISOR' | 'REVIEWER' | 'SESSION_HOST') => {
    setType(value);
  };

  useEffect(() => {
    let sum = 0;
    evaluate.forEach((i) => {
      sum += i.gradeMax;
      setAvgGrader(sum);
    });
  }, [evaluate]);

  const baseColumns: ColumnsType<any> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '100px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '100px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Điểm tối đa',
      dataIndex: 'gradeMax',
      key: 'gradeMax',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '50px', overflow: 'auto' }}>
          {text}
        </div>
      ),
      width: 200,
    },
    {
      title: 'Xóa',
      dataIndex: 'id',
      render: (id: any) => (
        <Button onClick={() => deleteItem(id)}>
          <DeleteOutlined style={{ color: 'red' }} />
        </Button>
      ),
      width: 100,
    },
    {
      title: 'Sửa',
      dataIndex: 'id',
      render: (id: any) => (
        <Button onClick={() => showEditModal(id)}>
          <EditOutlined style={{ color: '#30a3f1' }} />
        </Button>
      ),
      width: 100,
    },
  ];
  const showEditModal = (id: number) => {
    setUpdateId(id);
    setOpen(true);
    setStatus('update');
    const m = evaluate.filter((value) => value.id === id)[0];

    setInitData((prev: any) => {
      const data = {
        ...prev,
        type: type,
        termId: termState.termIndex.id,
        name: String(m.name),
        gradeMax: Number(m.gradeMax),
        description: m.description,
      };

      return data;
    });
  };

  const deleteItem = (id: number) => {
    evaluateService
      .deleteTerm(id)
      .then(() => {
        showMessage('Xóa thành công', 3000);
        getListOfEvaluate();
      })
      .catch((err) => {
        showMessageEror(ErrorCodeDefine[err.response.data.code].message, 3000);
      });
  };

  const onFinish = (value: any) => {
    const inpuNumber = checkPoint(value.gradeMax);

    if (status === 'insert') {
      if (inpuNumber === true) {
        const data = {
          ...value,
          type,
          termId: termState.termIndex.id,
        };
        evaluateService
          .insert(data)
          .then((_response) => {
            setOpen(false);
            showMessage('Tạo thành công', 3000);
            getListOfEvaluate();
          })
          .catch(() => showMessageEror('Tạo thất bại! Vui lòng kiểm tra lại', 3000));
      } else {
        showMessageEror('Vui lòng nhập điểm đúng định dạng', 2000);
      }
    } else {
      if (inpuNumber === true) {
        evaluateService
          .update(updateId as number, {
            ...value,
            type,
            termId: termState.termIndex.id,
            name: value.name,
            gradeMax: Number(value.gradeMax),
            description: value.description,
          })
          .then((result) => {
            showMessage('Cập nhật thành công', 2000);
            getListOfEvaluate();
            setOpen(false);
          })
          .catch((error) => {
            showMessageEror(ErrorCodeDefine[error.response.data.code].message, 2000);
          });
      } else {
        showMessageEror('Vui lòng nhập điểm đúng định dạng', 2000);
      }
    }
  };

  const handleDownload = () => {
    evaluateService
      .exportFile(termState.termIndex.id, type)
      .then((result) => {
        console.log('result', result);
        const url = window.URL.createObjectURL(new Blob([result.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        const fileName = `${type}.pdf`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((er) => {
        console.log('er ->', er);
      });
  };

  const getPointAvg = useMemo(() => {
    return (
      <Text type="success" className={cls('title_name')}>
        {avgGrader}
      </Text>
    );
  }, [avgGrader]);

  const renderButtonExport = useMemo(() => {
    return (
      <Button
        type="dashed"
        icon={<ExportOutlined />}
        size="large"
        disabled={avgGrader < 10 ? true : false}
        style={{
          animation: 'none',
          color: 'rgb(80, 72, 229)',
          fontWeight: '600',
        }}
        onClick={handleDownload}
      >
        Xuất phiếu chấm
      </Button>
    );
  }, [avgGrader]);

  return (
    <>
      <ToastContainer />
      <div className={cls('function')}>
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
          <Col>
            <div>
              <span>Loại: </span>
              <Select
                defaultValue="ADVISOR"
                style={{ width: 120 }}
                onChange={handleTypeChange}
                options={[
                  { value: 'ADVISOR', label: 'Hướng Dẫn' },
                  { value: 'REVIEWER', label: 'Phản biện' },
                  { value: 'SESSION_HOST', label: 'Hội Đồng' },
                ]}
              />
            </div>
          </Col>
          <Col>
            <div className={cls('content_button_upload')}>{renderButtonExport}</div>
          </Col>
          <Col>
            <div className={cls('content_button_upload')}>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  animation: 'none',
                  color: 'rgb(80, 72, 229)',
                  fontWeight: '600',
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
            initialValues={status === 'insert' ? {} : initData}
            size="middle"
          >
            <Form.Item label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]} name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]} name="description">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item label="Điểm" name="gradeMax" rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}>
              <Input type="number" />
            </Form.Item>

            <Row justify={'end'}>
              <Form.Item label="">
                <Button type="primary" htmlType="submit">
                  {status === 'insert' ? 'Tạo' : 'Cập nhật'}
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Modal>
      </div>

      <Row justify={'center'} style={{ width: '100%' }}>
        <Col span={21}>
          <Table dataSource={evaluate} columns={baseColumns} scroll={{ y: 450 }} pagination={{ pageSize: 7 }} />
        </Col>

        <Col span={3}>
          <div className={cls('left')}>
            <Card
              title={
                <Space wrap>
                  <Tooltip title="Tổng điểm của phiếu chấm hiện tại" color={'geekblue'}>
                    <Text mark strong type="danger" className={cls('title_name')}>
                      Tổng điểm
                    </Text>
                  </Tooltip>
                </Space>
              }
              bordered={false}
            >
              <Row justify={'center'} style={{ width: '100%' }}>
                {getPointAvg}
              </Row>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default EvaluateManagement;
