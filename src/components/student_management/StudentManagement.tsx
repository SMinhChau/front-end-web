import React, { useEffect, useState } from 'react';
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
    Dropdown,
    Space,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, PlusOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import studentService from '~/services/student';
import Student from '~/entities/student';
import { ToastContainer, toast } from 'react-toastify';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppSelector } from '~/redux/hooks';
import Config from '~/utils/config';
import ColumnSetting from '../column_setting/ColumnSetting';
import { checkGender, checkTypeTraining, showMessage, showMessageEror } from '~/constant';
import { UploadFile as MyUploadFile, UploadProps as MyUploadProps } from 'antd';

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
            render: (url) => <Avatar src={url} alt="" size={{ xs: 24, sm: 32, md: 40, lg: 54, xl: 60, xxl: 80 }} />,
        },

        {
            title: 'MSSV',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Tên Sinh viên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (text: string) =>
                checkGender(text)
        },
        {
            title: 'Loại đào tạo',
            dataIndex: 'typeTraining',
            key: 'typeTraining',
            render: (text: string) =>
                checkTypeTraining(text)
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

    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const handleUpload = () => {
        const formData = new FormData();
        formData.append('majorsId', userState.user.majors.id + '');
        formData.append("termId", String(termState.termIndex.id));
        formData.append('file', fileList[0] as RcFile);

        setUploading(true);
        studentService
            .importSudent(formData)
            .then(() => {
                setFileList([]);
                showMessage('Tải file thành công', 3000);
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
        studentService
            .getStudent({})
            .then((result) => {
                setStudent(
                    result.data.map((value: any) => {
                        return { ...value, key: value.id };
                    }),
                );
            })
            .catch((error) => {
                showMessageEror(error.response.data.error, 5000);
            });
    }, []);

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

        studentService.addStudent({
            ...value, majorsId: userState.user.majors.id,
            termId: termState.termIndex.id,
            username: value?.username,
            name: value?.name,
            gender: value?.gender,
            email: value?.email,
            phoneNumber: value?.phoneNumber,
            typeTraining: value?.typeTraining,
        }).then((result) => {

            setOpen(false);
            showMessage("Đã thêm Sinh Viên", 5000);
            window.location.reload();
        }).catch((er) => {

            setOpen(false);
            showMessageEror(er.response.data.error, 5000);
        })

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
                    <Col>

                        {viewType === 'table' && (
                            <ColumnSetting
                                setColumnVisible={setColumnVisible}
                                columns={baseColumns}
                                cacheKey={Config.STUDENT_CACHE_KEY}
                                style={{ marginLeft: 20 }}
                            />
                        )}
                    </Col>
                </Row>

                <div className={cls('modal')}>
                    <Modal title="Thêm Giảng Viên" open={open} onCancel={handleCancel}

                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Hủy
                            </Button>,
                        ]}
                        width={'50%'}>
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

                                            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
                                                <Select
                                                    style={{ width: 120 }}
                                                    onChange={handleChangeSelectedOption}
                                                    options={[
                                                        { value: 'MALE', label: 'Nam' },
                                                        { value: 'FEMALE', label: 'Nữ' },
                                                    ]}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="phoneNumber"
                                                label="Số điện thoại"
                                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                                                <Input />
                                            </Form.Item>

                                            <Form.Item name="degree" label="Loại đào tạo" rules={[{ required: true, message: 'Vui lòng chọn loại đào tạo' }]}>
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
                                                    <Col span={24} offset={20}>
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
                <Table dataSource={student} columns={columnVisible} scroll={{ y: 600 }} />
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
                                                <Image width={160} style={{ resize: 'block' }} src={value.avatar} />

                                                {/* <div className={cls('card_func')}>
                                                    <Button>
                                                        <DeleteOutlined style={{ color: 'red' }} />
                                                    </Button>
                                                    <Button>
                                                        <EditOutlined style={{ color: '#30a3f1' }} />
                                                    </Button>
                                                </div> */}
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
