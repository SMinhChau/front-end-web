import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import style from './TeacherManagement.module.scss';
import { Table, Avatar, Button, Upload, message, Row, Col, Modal, Form, Input, Space, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Config from '../../utils/config';
import ColumnSetting from '../column_setting/ColumnSetting';
import Teacher from '../../entities/teacher';
import { useAppSelector } from '../../redux/hooks';
import type { UploadProps, UploadFile, RcFile } from 'antd/es/upload/interface';
import lecturerService from '../../services/lecturer';
import { ErrorCodeDefine, checkDegree, checkGender, removeAccents, showMessage, showMessageEror } from '../../constant';
import { UploadFile as MyUploadFile, UploadProps as MyUploadProps } from 'antd';
import Select from 'react-select';

import { ToastContainer } from 'react-toastify';
import Search from 'antd/es/input/Search';
import { MdOutlinePassword } from 'react-icons/md';
import majorService from 'src/services/major';
const avatarDefault = 'assets/avatars/avatarDefault.png';

const cls = classNames.bind(style);

interface LecturerTable extends Teacher {
  key: number;
  majorId: number;
}

const TeacherManagement = () => {
  const baseColumns: ColumnsType<any> = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (url) => <Avatar src={url ? url : avatarDefault} alt="" size={{ xs: 24, sm: 32, md: 40, lg: 54, xl: 60, xxl: 80 }} />,
    },
    {
      title: 'Mã giảng viên',
      dataIndex: 'username',
      key: 'userame',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Cấp bậc',
      dataIndex: 'degree',
      key: 'degree',
      render: (text) => {
        const _name = checkDegree(text)?.toLocaleUpperCase();
        return (
          <Tag color={_name === 'THẠC SĨ' ? 'green' : 'red'} key={checkDegree(text)}>
            <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
              {_name}
            </div>
          </Tag>
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Chuyên ngành',
      dataIndex: 'majorId',
      key: 'majorId',
      render: (text) => {
        return (
          <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
            {text}
          </div>
        );
      },
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => {
        const _name = checkGender(text)?.toLocaleUpperCase();
        return (
          <Tag color={_name === 'NAM' ? 'green' : 'blue'} key={checkDegree(text)}>
            <div className={cls('text_colum')}>{_name}</div>
          </Tag>
        );
      },
    },
    {
      title: 'Cấp lại mật khẩu',
      dataIndex: 'id',
      width: 150,
      render: (id: any) => (
        <Space wrap>
          <Tooltip title="Mật khẩu mặt định" color={'geekblue'}>
            <Button
              onClick={() => {
                reSetPasss(id);
              }}
            >
              <MdOutlinePassword style={{ color: '#30a3f1' }} />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [lecturer, setLecturer] = useState<Array<LecturerTable>>([]);
  const { user } = useAppSelector((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const termState = useAppSelector((state) => state.term);
  const [gender, SetGender] = useState('');
  const [degree, SetDegree] = useState('');

  const [initData, setInitData] = useState<{
    avatar: string;
    name: string;
    gender: string;
    email: string;
    phoneNumber: string;
    degree: string;
  }>({ avatar: '', name: '', gender: '', email: '', phoneNumber: '', degree: '' });

  interface Filter {
    value: number;
    label: string;
  }
  const [fileListImage, setFileListImage] = useState<MyUploadFile[]>([]);
  const [error, setError] = useState<string>('');
  const [fileImage, setFileImage] = useState<RcFile>();

  const [updateId, setUpdateId] = useState<number | null>(null);
  const [majorId, SetMajorId] = useState<number | null>(null);
  const [status, setStatus] = useState('insert');

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [listMajor, setListMajor] = useState<Array<Filter>>([]);

  const [data, setData] = useState<Array<LecturerTable>>([]);
  useEffect(() => {
    getListLecturer();
    getListMajor();
  }, [termState]);

  const getListMajor = () => {
    if (termState.termIndex.id) {
      majorService
        .getMajor()
        .then((response) => {
          const _data: Filter[] = response.data.reduce(
            (accumulator: { value: number; label: string }[], current: { id: number; name: string }) => {
              const existingItem = accumulator.find((item) => item.value === current.id);
              if (!existingItem) {
                accumulator.push({ value: current.id, label: current.name });
              }
              return accumulator;
            },
            [],
          );

          setListMajor(_data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const [stateLecturer, setStateLecturer] = useState<{
    filteredInfo: null;
    sortedInfo: null;
    data: Array<LecturerTable>;
    filtered: false;
    searchText: string;
  }>({
    filteredInfo: null,
    sortedInfo: null,
    data,
    filtered: false,
    searchText: '',
  });

  const getListLecturer = () => {
    if (termState.termIndex.id) {
      lecturerService.getWithTerm(termState.termIndex.id).then((response) => {
        const _data = response.data.map((value: Teacher, index: number) => {
          return { ...value, key: index, majorId: value.majors.id };
        });
        setLecturer(_data);

        setData(_data);
      });
    }
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('majorsId', user.majors.id + '');
    formData.append('termId', String(termState.termIndex.id));
    formData.append('file', fileList[0] as RcFile);

    setUploading(true);

    lecturerService
      .import(formData)
      .then((result) => {
        setFileList([]);
        showMessage('Tải file thành công', 3000);
        getListLecturer();
      })
      .catch((error) => {
        setFileList([]);
        showMessageEror('Tải file thất bại! Vui lòng kiểm tra lại', 3000);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setStatus('insert');
    setInitData({ avatar: '', name: '', gender: '', email: '', phoneNumber: '', degree: '' });
  };
  const beforeUploadImage = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      setError('Vui lòng upload ảnh có phần mở rộng là jpeg | png');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      setError('Vui lòng chọn ảnh dưới 2MB');
      return false;
    }
    return isJpgOrPng && isLt2M;
  };

  const onChangeImage: MyUploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      if (beforeUploadImage(newFileList[0] as RcFile)) {
        setFileListImage(newFileList);
        setError('');
      }
    } else {
      //remove image
      setFileListImage(newFileList);
    }
  };

  const handleUploadImage: MyUploadProps['action'] = async (file: RcFile) => {
    if (beforeUploadImage(file)) {
      setFileImage(file);
    }

    return '';
  };

  const onFinish = (value: any) => {
    lecturerService
      .addLecturer({
        ...value,
        majorsId: majorId,
        termId: termState.termIndex.id,
        username: value?.username,
        name: value?.name,
        gender: gender,
        email: value?.email,
        phoneNumber: value?.phoneNumber,
        degree: degree,
      })
      .then((result) => {
        setOpen(false);
        getListLecturer();
        showMessage('Đã thêm Giảng Viên', 5000);

        setStatus('insert');
        setInitData({ avatar: '', name: '', gender: '', email: '', phoneNumber: '', degree: '' });
        // window.location.reload();
      })
      .catch((error) => {
        setOpen(false);
        setStatus('insert');
        setInitData({ avatar: '', name: '', gender: '', email: '', phoneNumber: '', degree: '' });
        showMessageEror(ErrorCodeDefine[error.response.data.code].message, 5000);
      });
  };

  const handleChangeSelectedOption = (value: any) => {
    SetGender(value.value);
  };
  const handleChangeSelectedOptionDegree = (value: any) => {
    SetDegree(value.value);
  };
  const handleSelectChangeMajor = (value: any) => {
    SetMajorId(value.value);
  };

  const handleSelectChangeMajorFilter = (value: any) => {
    const _data = lecturer.filter((item) => item.majors.id === value.value);
    setData(_data);
  };

  const showEditModal = (id: number) => {
    setUpdateId(id);
    setOpen(true);
    setStatus('update');
    const m = lecturer.filter((value) => value.id === id)[0];
    setInitData((prev: any) => {
      const data = {
        ...prev,
        avatar: m?.avatar,
        name: m?.name,
        gender: m?.gender,
        email: m?.email,
        phoneNumber: m?.phoneNumber,
        degree: m?.degree,
      };
      return data;
    });
  };

  const onSearch = (value: string) => {
    if (value.toUpperCase() === '') {
      setData(lecturer);
    } else {
      const filteredData = lecturer.filter((row) =>
        Object.values(row).some((fieldValue) => typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(value.toLowerCase())),
      );

      setData(filteredData);
    }
  };

  const renderTableLecturer = useMemo(() => {
    return <Table dataSource={data} columns={baseColumns} pagination={{ pageSize: 7 }} scroll={{ x: 450, y: 530 }} />;
  }, [lecturer, baseColumns, data]);

  const reSetPasss = (id: number) => {
    lecturerService
      .reSetPass(id, { password: '123456' })
      .then((result) => {
        showMessage('Đã cập nhật', 3000);
      })
      .catch((errr) => {
        console.log('errr', error);
        showMessageEror('Lỗi cập nhật', 3000);
      });
  };

  return (
    <div className={cls('teacher_management')}>
      <ToastContainer />
      <div className={cls('function')}>
        <Row justify={'space-around'} align={'middle'} style={{ width: '100%' }}>
          <Col>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              size="large"
              style={{
                margin: '0 10px',
                animation: 'none',
                color: 'rgb(80, 72, 229)',
              }}
              onClick={showModal}
            >
              Tạo
            </Button>
          </Col>
          <Col>
            <div className={cls('content_button_upload')}>
              <Upload {...props}>
                <Button
                  type="dashed"
                  icon={<UploadOutlined />}
                  size="large"
                  style={{
                    animation: 'none',
                    color: 'rgb(80, 72, 229)',
                  }}
                >
                  Tải lên
                </Button>
              </Upload>
              <div className={cls('btn_loading')}>
                <Button
                  type="primary"
                  onClick={handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                  style={{
                    animation: 'none',
                    alignItems: 'center',
                  }}
                >
                  {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
              </div>
            </div>
          </Col>

          <Col span={7}>
            <div className={cls('search')}>
              <Search
                // onChange={onChange}
                className={cls('search_iput')}
                placeholder="Nhập tên giảng viên"
                allowClear
                size="large"
                onSearch={onSearch}
              />
            </div>
          </Col>
          <div className={cls('name')}>Chọn chuyên ngành:</div>
          <div style={{ width: '200px' }}>
            <Select
              onChange={handleSelectChangeMajorFilter}
              options={listMajor.map((val) => {
                return {
                  value: val.value,
                  label: `${val.label} - Mã: ${val.value}`,
                };
              })}
            />
          </div>
          <Button
            type="dashed"
            size="large"
            style={{
              margin: '0 10px',
              animation: 'none',
              color: 'rgb(80, 72, 229)',
            }}
            onClick={() => setData(lecturer)}
          >
            Tất cả
          </Button>
        </Row>

        {/* <ColumnSetting
                    setColumnVisible={setColumnVisible}
                    columns={baseColumns}
                    cacheKey={Config.TEACHER_CACHE_KEY}
                /> */}
      </div>

      {renderTableLecturer}

      <div className={cls('modal')}>
        <Modal
          title="Thêm Giảng Viên"
          open={open}
          confirmLoading={confirmLoading}
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
            size="large"
          >
            <Row justify={'space-between'}>
              <Col span={24}>
                <Row justify={'space-between'}>
                  <Col span={24}>
                    <Form.Item name="username" label="Mã Giảng Viên" rules={[{ required: true, message: 'Vui lòng nhập mã' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Tên Giảng Viên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                      <Input />
                    </Form.Item>

                    <Form.Item label="Giới tính">
                      <Select
                        onChange={handleChangeSelectedOption}
                        options={[
                          { value: 'MALE', label: 'Nam' },
                          { value: 'FEMALE', label: 'Nữ' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item name="phoneNumber" label="Số điện thoại">
                      <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                      <Input />
                    </Form.Item>

                    <Form.Item label="Trình độ">
                      <Select
                        onChange={handleChangeSelectedOptionDegree}
                        options={[
                          { value: 'MASTERS', label: 'Tiến sĩ' },
                          { value: 'DOCTER', label: 'Thạc sĩ' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="Chuyên ngành" rules={[{ required: true, message: 'Vui lòng  chuyên ngành' }]}>
                      <Select
                        onChange={handleSelectChangeMajor}
                        options={listMajor.map((val) => {
                          return {
                            value: val.value,
                            label: val.label,
                          };
                        })}
                      />
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 24 }}>
                      <Row>
                        <Col span={24} offset={19}>
                          <Button type="primary" htmlType="submit">
                            Cập nhật
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default TeacherManagement;
