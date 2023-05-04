import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space } from 'antd';
import { ToastContainer } from 'react-toastify';
import classNames from 'classnames/bind';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import style from './MajorManagement.module.scss';
import type { ColumnsType } from 'antd/es/table';
import headOfLecturerService from '../../services/lecturer';
import majorService from '../../services/major';
import { showMessage, showMessageEror } from '../../constant';
import { useAppSelector } from 'src/redux/hooks';

const cls = classNames.bind(style);
const { Option } = Select;
interface Major {
  id: number;
  name: String;
  headName?: string;
  headID?: number;
}

interface HeadLecturer {
  key: string;
  value: number;
  label: string;
}

const MajorManagement = () => {
  const columns: ColumnsType<any> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chủ nhiệm ngành',
      dataIndex: 'headName',
      key: 'headName',
    },
    {
      title: 'Xóa',
      dataIndex: 'id',
      render: (id: any) => (
        <Button onClick={() => deleteMajor(id)}>
          <DeleteOutlined style={{ color: 'red' }} />
        </Button>
      ),
      width: 200,
    },
    {
      title: 'Sửa tên chuyên ngành',
      dataIndex: 'id',
      render: (id: any) => (
        <Button
          onClick={() => {
            showEditModal(id);
            getListLecturerOfMajor(id);
          }}
        >
          <EditOutlined style={{ color: '#30a3f1' }} />
        </Button>
      ),
      width: 200,
    },
    {
      title: 'Đổi chủ nhiêm ngành',
      dataIndex: 'id',
      render: (id: any) => (
        <Button
          onClick={() => {
            getListLecturerOfMajor(id);
            showEditModalChaneLecturerOfMajor(id);
          }}
        >
          <EditOutlined style={{ color: '#30a3f1' }} />
        </Button>
      ),
    },
  ];

  const [headLecture, setHeadLecture] = useState<Array<HeadLecturer>>([]);
  const [major, setMajor] = useState<Array<Major>>([]);
  const [open, setOpen] = useState(false);
  const [openChangeRole, setOpenChangeRole] = useState(false);
  const [status, setStatus] = useState('insert');
  const [initData, setInitData] = useState<{
    name: string;
  }>({ name: '' });
  const [initDataChangeRole, setInitDataChangeRole] = useState<{
    name: string;
    headLecturerId: number | null;
  }>({ name: '', headLecturerId: null });

  const [updateId, setUpdateId] = useState<number | null>(null);
  const termState = useAppSelector((state) => state.term);

  const getListLecturerOfMajor = (id: number) => {
    headOfLecturerService.getLecturerByMajor(id, termState.termIndex.id).then((result) => {
      setHeadLecture(
        result.data.map((value: any) => {
          return {
            id: value.username,
            value: value.id,
            label: value.name,
          };
        }),
      );
    });
  };

  useEffect(() => {
    getListOfMajor();
  }, []);

  const getListOfMajor = () => {
    majorService.getMajor().then((result) => {
      setMajor(
        result.data.map((value: any) => {
          return {
            id: value.id,
            key: value.id,
            name: value.name,
            headName: value.headLecturer?.name,
            headID: value.headLecturer?.id,
          };
        }),
      );
    });
  };

  const showModal = () => {
    setOpen(true);
    setStatus('insert');
  };

  const handleCancel = () => {
    setOpen(false);
    setInitData({
      name: '',
    });
  };

  const handleCancelChangeRole = () => {
    setOpenChangeRole(false);
    setInitData({
      name: '',
    });
  };

  const deleteMajor = (id: number) => {
    majorService
      .deleteMajor(id)
      .then(() => {
        showMessage('Đã xóa', 3000);
        getListOfMajor();
      })
      .catch((error) => {
        showMessageEror(error.response.data.error, 3000);
      });
  };

  const showEditModal = (id: number) => {
    setUpdateId(id);
    setOpen(true);
    setStatus('update');
    const m = major.filter((value) => value.id === id)[0];
    setInitData((prev: any) => {
      return { ...prev, name: m.name };
    });
  };

  const showEditModalChaneLecturerOfMajor = (id: number) => {
    setOpenChangeRole(true);
    const m = major.filter((value) => value.id === id)[0];
    setInitDataChangeRole((prev: any) => {
      return { ...prev, name: m.name, headLecturerId: m.headID };
    });
  };

  const onFinish = (value: { name: string }) => {
    if (status === 'insert')
      majorService
        .createMajor(value)
        .then(() => {
          setOpen(false);
          showMessage('Thêm thành công', 3000);
          getListOfMajor();
        })
        .catch((error) => {
          showMessageEror(error.response.data.error, 3000);
        });
    else {
      majorService
        .updateMajor(Number(updateId), { name: value.name })
        .then(() => {
          setOpen(false);
          showMessage('Cập nhật thành công', 3000);
          getListOfMajor();
        })
        .catch((error) => {
          showMessageEror(error.response.data.error, 3000);
        });
    }
  };

  const onFinishChangeRole = (value: { id: number }) => {
    majorService
      .updateRoleOfMajor(value.id, { role: 'HEAD_LECTURER' })
      .then(() => {
        setOpenChangeRole(false);
        showMessage('Cập nhật thành công', 3000);
        getListOfMajor();
      })
      .catch((error) => {
        showMessageEror(error.response.data.error, 3000);
      });
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className={cls('major_management')}>
      <ToastContainer />
      <div className={cls('major_func')}>
        <h4 className={cls('major_title')}>Quản lý chuyên ngành</h4>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          size="large"
          style={{
            marginBottom: '10px',
            animation: 'none',
            color: 'rgb(80, 72, 229)',
            fontWeight: '600',
          }}
          onClick={showModal}
        >
          Tạo
        </Button>

        <Modal
          destroyOnClose
          open={open}
          title={status === 'insert' ? 'Tạo chuyên ngành' : 'Cập nhật tên'}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
          ]}
        >
          <Form
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
            initialValues={status === 'insert' ? {} : initData}
          >
            <Form.Item label="Tên chuyên ngành" rules={[{ required: true, message: 'Vui lòng nhập tên' }]} name="name">
              <Input />
            </Form.Item>

            <Form.Item label=" ">
              <Button type="primary" htmlType="submit">
                {status === 'insert' ? 'Tạo ' : 'Cập nhật '}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          destroyOnClose
          open={openChangeRole}
          title="Cập nhật chủ nhiệm ngành"
          onCancel={handleCancelChangeRole}
          footer={[
            <Button key="back" onClick={handleCancelChangeRole}>
              Hủy
            </Button>,
          ]}
        >
          <Form
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinishChangeRole}
            style={{ maxWidth: 600 }}
            initialValues={initDataChangeRole}
          >
            <Form.Item label="Tên chuyên ngành" rules={[{ required: true }]} name="name">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Giảng viên" rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]} name="id">
              <Select style={{ width: '100%' }} placeholder="Giảng viên" onChange={handleChange} optionLabelProp="label">
                {headLecture.map((value, key) => {
                  return (
                    <>
                      <Option key={key} value={value.value} label={value.label}>
                        <Space>
                          <span>
                            {value.label} - Mã GV: {value.key}
                          </span>
                        </Space>
                      </Option>
                    </>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label=" ">
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Table dataSource={major} columns={columns} scroll={{ y: 450, x: 540 }} />
    </div>
  );
};

export default MajorManagement;
