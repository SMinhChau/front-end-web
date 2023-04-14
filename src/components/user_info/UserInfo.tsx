import classNames from 'classnames/bind';
import styled from './UserInfo.module.scss';
import { Button, Col, Descriptions, Form, Input, Modal, Row, Select, Upload, UploadFile, UploadProps, message } from 'antd';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { checkDegree, checkGender, checkRole } from '~/constant';
import { useEffect, useState } from 'react';
import Major from '~/entities/major';
import majorService from '~/services/major';

import { RcFile } from 'antd/es/upload';
import authAPI from '~/redux/apis/auth';
import { UploadOutlined } from '@ant-design/icons';

const cls = classNames.bind(styled);

const UserInfo = () => {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState('update');
    const [initData, setInitData] = useState<{
        avatar: string;
        name: string;
        gender: string;
        email: string;
        phoneNumber: string;
        degree: string;
    }>({ avatar: '', name: '', gender: '', email: '', phoneNumber: '', degree: '' });
    const [major, setMajor] = useState<Major>();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        majorService
            .getMajorById(user?.majors?.id)
            .then((result) => {
                console.log('result get MASjpr id', result);

                setMajor(result?.data);
            })
            .catch((errer) => console.log('errr', errer));
    }, []);

    const DataInfo = [
        {
            key: user?.username,
            lable: 'Mã Giảng Viên',
            value: user?.username,
        },

        {
            key: user?.name,
            lable: 'Tên giảng viên',
            value: user?.name,
        },
        {
            key: user?.gender,
            lable: 'Giới tính',
            value: checkGender(user?.gender),
        },
        {
            key: user?.phoneNumber,
            lable: 'Số điện thoại',
            value: user?.phoneNumber,
        },
        {
            key: user?.email,
            lable: 'Email',
            value: user?.email,
        },
        {
            key: user?.name,
            lable: 'Chuyên ngành',
            value: major?.name,
        },
        {
            key: user?.role,
            lable: 'Chức vụ',
            value: checkRole(user?.role),
        },
        {
            key: user?.degree,
            lable: 'Trình độ',
            value: checkDegree(user?.degree),
        },
    ];

    const handleCancel = () => {
        setOpen(false);
    };

    const handleChangeSelectedOption = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onFinish = (value: any) => {
        var bodyFormData = new FormData();
        console.log("fileList?.[0]", fileList?.[0] as UploadFile);


        if (fileList?.[0]?.name !== "") {
            bodyFormData.append('avatar', fileList?.[0] as RcFile)
        } else {
            bodyFormData.append('avatar', user?.avatar)
        }

        bodyFormData.append("name", value?.name);
        bodyFormData.append("gender", value?.gender);
        bodyFormData.append("email", value?.email);
        bodyFormData.append("phoneNumber", value?.phoneNumber);
        bodyFormData.append("degree", value?.degree);


        console.log("bodyFormData", bodyFormData);

        dispatch(authAPI.updateInfo()(bodyFormData));
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            setError('Vui lòng upload ảnh có phần mở rộng là jpeg | png')
            return false;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
            setError('Vui lòng chọn ảnh dưới 2MB');
            return false;
        }
        return isJpgOrPng && isLt2M;
    };

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (newFileList.length > 0) {

            if (beforeUpload(newFileList[0] as RcFile)) {
                console.log("File list", newFileList);

                setFileList(newFileList);
                setError('');
            }
        } else {
            //remove image
            setFileList(newFileList);
        }
    };


    return (
        <div className={cls('user_info')}>
            <Descriptions
                column={1}
                title={
                    <div className={cls('content_title')}>
                        <h2>Thông tin cá nhân </h2>
                    </div>
                }
                style={{ marginTop: '20px' }}
            >
                {DataInfo.map((item, key) => {
                    return (
                        <Descriptions.Item label={<p className={cls('title')}>{item?.lable}</p>}>
                            <p className={cls('item_title')}>{item?.value}</p>
                        </Descriptions.Item>
                    );
                })}
            </Descriptions>

            <Col span={24}>
                <Row justify={'end'}>
                    <Button
                        onClick={() => {
                            setOpen(true);
                            setInitData({
                                avatar: user?.avatar,
                                name: user?.name,
                                gender: user.gender,
                                email: user?.email,
                                phoneNumber: user?.phoneNumber,
                                degree: user?.degree,
                            });
                        }}
                        type="primary"
                        size={'large'}
                    >
                        Cập nhật thông tin
                    </Button>
                </Row>
            </Col>

            <div className={cls('modal')}>
                <Modal
                    destroyOnClose
                    open={open}
                    title={<p style={{ textAlign: 'center' }}>Cập nhật thông tin</p>}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                    ]}
                    width={'50%'}
                >
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        layout="horizontal"
                        onFinish={onFinish}
                        initialValues={status === 'insert' ? {} : initData}
                        style={{ width: '90%' }}
                        size="large"
                    >
                        <Row justify={'space-between'}>
                            <Col span={24}>
                                <Row justify={'center'} style={{ marginBottom: '20px' }} >
                                    <Col>  <p>Chọn ảnh đại diện</p></Col>
                                    <Col offset={1}>
                                        <Upload
                                            accept={"image/png, image/jpeg"}
                                            listType="picture"
                                            fileList={fileList}
                                            beforeUpload={beforeUpload}
                                            onChange={onChange}
                                            maxCount={1}
                                        >

                                            <div className={cls('btn_upload')}>
                                                <Button icon={<UploadOutlined />} style={{ borderRadius: 16 }}>Tải thêm ảnh</Button>
                                                <p>{error ?? ''}</p>
                                            </div>
                                        </Upload>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                        <Row justify={'space-between'}>
                            <Col span={24}>
                                <Form.Item name="name" label="Tên Giảng Viên" rules={[{ required: true, message: 'Please input your name' }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name="gender" label={checkGender(user?.gender)} rules={[{ required: true }]}>
                                    <Select
                                        style={{ width: 120 }}
                                        onChange={handleChangeSelectedOption}
                                        options={[
                                            { value: 'MALE', label: 'Nam' },
                                            { value: 'FEMALE', label: 'Nữ' },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: 'Please input your name' }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your name' }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name="degree" label="Trình độ" rules={[{ required: true }]}>
                                    <Select
                                        style={{ width: 120 }}
                                        onChange={handleChangeSelectedOption}
                                        options={[
                                            { value: 'MASTERS', label: 'Tiến sĩ' },
                                            { value: 'DOCTER', label: 'Thạc sĩ' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Row>
                                <Col span={24} offset={20}>
                                    <Button type="primary" htmlType="submit">
                                        Cập nhật
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default UserInfo;
