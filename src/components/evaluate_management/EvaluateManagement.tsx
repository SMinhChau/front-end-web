import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './EvaluateManagement.module.scss';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useAppSelector } from 'src/redux/hooks';
import Evaluate from 'src/entities/evaluate';
import evaluateService from 'src/services/evaluate';
import Table, { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { ToastContainer } from 'react-toastify';
import { checkPoint, showMessage, showMessageEror } from '../../constant';

interface EvaluateTableType extends Evaluate {
  key: number;
}

const cls = classNames.bind(style);

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

  const baseColumns: ColumnsType<any> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Điểm tối đa',
      dataIndex: 'gradeMax',
      key: 'gradeMax',
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
        showMessageEror(err.response.data.error, 3000);
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
            showMessageEror(error.response.data.error, 2000);
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

        // const url = window.URL.createObjectURL(new Blob([result.data]));

        const url = window.URL.createObjectURL(new Blob([result.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        const fileName = `${+new Date()}.pdf`; // whatever your file name .
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove(); // you need to remove that elelment which is created before.
      })
      .catch((er) => {
        console.log('er ->', er);
      });

    // const url = 'https://example.com/myfile.pdf'; // replace with your file URL
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', 'myfile.pdf'); // set the filename for the downloaded file
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className={cls('avaluate')}>
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
            <div className={cls('content_button_upload')}>
              <Button
                type="dashed"
                icon={<ExportOutlined />}
                size="large"
                style={{
                  animation: 'none',
                  color: 'rgb(80, 72, 229)',
                  fontWeight: '600',
                }}
                onClick={handleDownload}
              >
                Xuất phiếu chấm
              </Button>
            </div>
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
              <Input />
            </Form.Item>
            <Form.Item label="Điểm" name="gradeMax" rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}>
              <Input type="number" />
            </Form.Item>

            <Row justify={'end'}>
              <Form.Item label="">
                <Button type="primary" htmlType="submit">
                  Tạo
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Modal>
      </div>
      <Table dataSource={evaluate} columns={baseColumns} scroll={{ y: 450 }} />
    </div>
  );
};

export default EvaluateManagement;
