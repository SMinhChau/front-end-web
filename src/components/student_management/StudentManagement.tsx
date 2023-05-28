import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import style from './StudentManagement.module.scss';
import {
  Table,
  Avatar,
  Button,
  Upload,
  Modal,
  Form,
  Input,
  message,
  Card,
  Select,
  Row,
  Col,
  Image,
  Descriptions,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import studentService from '../../services/student';
import Student from '../../entities/student';
import { ToastContainer, toast } from 'react-toastify';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppSelector } from '../../redux/hooks';
import { ErrorCodeDefine, checkDegree, checkGender, checkTypeTraining, showMessage, showMessageEror } from '../../constant';
import { UploadFile as MyUploadFile, UploadProps as MyUploadProps } from 'antd';
import Search from 'antd/es/input/Search';
import { MdOutlinePassword } from 'react-icons/md';

const avatarDefault = 'assets/avatars/avatarDefault.png';

const cls = classNames.bind(style);

interface StudentData extends Student {
  key: number;
}

const StudentManagement = () => {
  const baseColumns: ColumnsType<any> = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (url) => <Avatar src={url ? url : avatarDefault} alt="" size={{ xs: 24, sm: 32, md: 40, lg: 54, xl: 60, xxl: 80 }} />,
    },

    {
      title: 'MSSV',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Tên Sinh viên',
      dataIndex: 'name',
      key: 'name',
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
        <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => {
        const _name = checkGender(text)?.toLocaleUpperCase();
        return (
          <Tag color={_name === 'NAM' ? 'green' : 'blue'} key={checkDegree(text)}>
            <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
              {_name}
            </div>
          </Tag>
        );
      },
    },
    {
      title: 'Loại đào tạo',
      dataIndex: 'typeTraining',
      key: 'typeTraining',
      render: (text) => {
        const _name = checkTypeTraining(text)?.toLocaleUpperCase();
        return (
          <Tag color={_name === 'ĐẠI HỌC' ? 'yellow' : 'red'} key={checkTypeTraining(text)}>
            <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
              {_name}
            </div>
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
  const [student, setStudent] = useState<Array<StudentData>>([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const userState = useAppSelector((state) => state.user);
  const [viewType, setviewType] = useState<'table' | 'card'>('table');
  const [columnVisible, setColumnVisible] = useState<Array<any>>([]);

  const [fileListImage, setFileListImage] = useState<MyUploadFile[]>([]);
  const [error, setError] = useState<string>('');
  const [fileImage, setFileImage] = useState<RcFile>();
  const termState = useAppSelector((state) => state.term);

  const [initData, setInitData] = useState<{
    avatar: string;
    name: string;
    gender: string;
    email: string;
    phoneNumber: string;
    typeTraining: string;
  }>({ avatar: '', name: '', gender: '', email: '', phoneNumber: '', typeTraining: '' });

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const [data, setData] = useState<Array<StudentData>>([]);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleUpload = () => {
    const formData = new FormData();
    formData.append('majorsId', userState.user.majors.id + '');
    formData.append('termId', String(termState.termIndex.id));
    formData.append('file', fileList[0] as RcFile);

    setUploading(true);
    studentService
      .importSudent(formData)
      .then(() => {
        setFileList([]);
        showMessage('Tải file thành công', 3000);
        getListOfStudent();
      })
      .catch((error) => {
        setFileList([]);
        console.log('error', error);

        showMessageEror('Tải file thất bại! Vui lòng kiểm tra lại', 3000);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  useEffect(() => {
    getListOfStudent();
  }, []);

  const getListOfStudent = () => {
    studentService
      .getStudent({ termId: termState.termIndex.id })
      .then((result) => {
        setStudent(
          result.data.map((value: any) => {
            return { ...value, key: value.id };
          }),
        );
        setData(
          result.data.map((value: any) => {
            return { ...value, key: value.id };
          }),
        );
      })
      .catch((error) => {
        showMessageEror(ErrorCodeDefine[error.response.data.code].message, 5000);
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
      console.log(file);

      setFileList([...fileList, file]);

      return false;
    },
    fileList,
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
        console.log('File list', newFileList);

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

  const handleChangeSelectedOption = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onFinish = (value: any) => {
    studentService
      .addStudent({
        ...value,
        majorsId: userState.user.majors.id,
        termId: termState.termIndex.id,
        username: value?.username,
        name: value?.name,
        gender: value?.gender,
        email: value?.email,
        phoneNumber: value?.phoneNumber,
        typeTraining: value?.typeTraining,
      })
      .then((result) => {
        setOpen(false);
        showMessage('Đã thêm Sinh Viên', 5000);
        getListOfStudent();
      })
      .catch((er) => {
        setOpen(false);
        showMessageEror(er.response.data.error, 5000);
      });
  };
  const onSearch = (value: string) => {
    console.log('value', value);
    if (value.toUpperCase() === '') {
      setData(student);
    } else {
      const filteredData = student.filter((row) =>
        Object.values(row).some((fieldValue) => typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(value.toLowerCase())),
      );

      setData(filteredData);
    }
  };

  const RenderStudent = useMemo(() => {
    return <Table dataSource={data} columns={baseColumns} pagination={{ pageSize: 7 }} />;
  }, [student, baseColumns, data]);

  const reSetPasss = (id: number) => {
    studentService
      .reSetPass(id, { password: '123456' })
      .then((result) => {
        showMessage('Đã cập nhật', 3000);
      })
      .catch((errr) => {
        showMessageEror('Lỗi cập nhật', 3000);
      });
  };

  return (
    <div className={cls('student')}>
      <ToastContainer />
      <div className={cls('function')}>
        <Row justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
          <Col>
            <label htmlFor="select_view">Hiển thị: </label>
            <Select
              defaultValue="table"
              style={{ width: 120 }}
              onChange={(value: 'table' | 'card') => {
                setviewType(value);
              }}
              options={[
                { value: 'table', label: 'Bảng' },
                { value: 'card', label: 'Thẻ' },
              ]}
              id="select_view"
            />
          </Col>
          <Col>
            <div className={cls('upload_group_btn')}>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  margin: '10px',
                  animation: 'none',
                  color: 'rgb(80, 72, 229)',
                }}
                onClick={showModal}
              >
                Tạo
              </Button>
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
              <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{
                  animation: 'none',
                  marginLeft: 10,
                }}
              >
                {uploading ? 'Uploading' : 'Start Upload'}
              </Button>
            </div>
          </Col>
          <Col span={7}>
            <div className={cls('search')}>
              <Search className={cls('search_iput')} placeholder="Nhập tên giảng viên" allowClear size="large" onSearch={onSearch} />
            </div>
          </Col>
          <Col>
            {/* {viewType === 'table' && (
                            <ColumnSetting
                                setColumnVisible={setColumnVisible}
                                columns={baseColumns}
                                cacheKey={Config.STUDENT_CACHE_KEY}
                                style={{ marginLeftF: 20 }}
                            />
                        )} */}
          </Col>
          <Button
            type="dashed"
            size="large"
            style={{
              margin: '0 10px',
              animation: 'none',
              color: 'rgb(80, 72, 229)',
            }}
            onClick={() => setData(student)}
          >
            Tất cả
          </Button>
        </Row>

        <div className={cls('modal')}>
          <Modal
            title="Thêm Giảng Viên"
            open={open}
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
              initialValues={initData}
              size="large"
            >
              <Row justify={'space-between'}>
                <Col span={24}>
                  {/* <Row justify={'center'} style={{ marginBottom: '20px' }}>
                                        <Col>

                                            <p>Chọn ảnh đại diện</p>
                                        </Col>
                                        <Col offset={1}>
                                            <Upload
                                                accept={'image/png, image/jpeg'}
                                                listType="picture"
                                                fileList={fileListImage}
                                                beforeUpload={beforeUploadImage}
                                                onChange={onChangeImage}
                                                action={handleUploadImage}
                                                maxCount={1}
                                            >
                                                <div className={cls('btn_upload')}>
                                                    <Button icon={<UploadOutlined />} style={{ borderRadius: 16 }}>
                                                        Tải thêm ảnh
                                                    </Button>
                                                    <p>{error ?? ''}</p>
                                                </div>
                                            </Upload>
                                        </Col>
                                    </Row> */}
                  <Row justify={'space-between'}>
                    <Col span={24}>
                      <Form.Item name="username" label="Mã Sinh Viên" rules={[{ required: true, message: 'Vui lòng nhập mã' }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name="name" label="Tên Sinh Viên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="gender" label="Giới tính">
                        <Select
                          style={{ width: 120 }}
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

                      <Form.Item name="typeTraining" label="Loại đào tạo">
                        <Select
                          style={{ width: 120 }}
                          onChange={handleChangeSelectedOption}
                          options={[
                            { value: 'UNIVERSITY', label: 'Đại học' },
                            { value: 'COLLEGE', label: 'Cao đẳng' },
                          ]}
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
      {viewType === 'table' ? (
        <> {RenderStudent}</>
      ) : (
        <div className={cls('card_view')}>
          <Row>
            {student.map((value, index) => {
              const data = [
                {
                  lable: 'Tên',
                  value: value.name,
                },
                {
                  lable: 'Giới tính',
                  value: checkGender(value.gender),
                },
                {
                  lable: 'Năm học',
                  value: value.schoolYear,
                },
                {
                  lable: 'Loại đào tạo',
                  value: checkTypeTraining(String(value.typeTraining)),
                },
              ];
              return (
                <Col key={index} span={8}>
                  <Card className={cls('card_item')} key={value.id}>
                    <div className={cls('card_body')}>
                      <div className={cls('card_top')}>
                        <Image width={150} style={{ resize: 'block' }} src={value.avatar ? value.avatar : avatarDefault} />
                      </div>

                      <div className={cls('content')}>
                        {data.map((i) => (
                          <Descriptions title="">
                            <Descriptions.Item label={i.lable}>
                              <Space>
                                <div className={cls('member')}>{i?.value}</div>
                              </Space>
                            </Descriptions.Item>
                          </Descriptions>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
