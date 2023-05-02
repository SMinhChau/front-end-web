import React, { useState, useEffect, useMemo } from "react";
import classNames from "classnames/bind";
import style from "./TeacherManagement.module.scss";
import { Table, Avatar, Button, Upload, Select, message, Row, Col, Modal, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import Config from "~/utils/config";
import ColumnSetting from "../column_setting/ColumnSetting";
import Teacher from "~/entities/teacher";
import { useAppSelector } from "~/redux/hooks";
import type { UploadProps, UploadFile, RcFile } from "antd/es/upload/interface";
import lecturerService from "~/services/lecturer";
import { checkDegree, checkGender, showMessage, showMessageEror } from "~/constant";
import { UploadFile as MyUploadFile, UploadProps as MyUploadProps } from 'antd';

import { ToastContainer } from "react-toastify";
import avatarDefault from "~/assets/avatars/avatarDefault.png";

const cls = classNames.bind(style);


interface LecturerTable extends Teacher {
    key: number;
}

const TeacherManagement = () => {
    const baseColumns: ColumnsType<any> = [
        {
            title: "",
            dataIndex: "avatar",
            key: "avatar",
            render: (url) => (

                <Avatar
                    src={url ? url : avatarDefault}
                    alt=""
                    size={{ xs: 24, sm: 32, md: 40, lg: 54, xl: 60, xxl: 80 }}
                />
            ),
        },
        {
            title: "Mã giảng viên",
            dataIndex: "username",
            key: "userame",
        },
        {
            title: "Tên giảng viên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Cấp bậc",
            dataIndex: "degree",
            key: 'degree',
            render: (text: string) =>
                checkDegree(text),
        },
        {
            title: "SĐT",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            render: (text: string) =>
                checkGender(text)
        },
    ];

    const [lecturer, setLecturer] = useState<Array<LecturerTable>>([]);
    const { user } = useAppSelector((state) => state.user);
    const [uploading, setUploading] = useState(false);
    const termState = useAppSelector((state) => state.term);

    const [initData, setInitData] = useState<{
        avatar: string;
        name: string;
        gender: string;
        email: string;
        phoneNumber: string;
        degree: string;
    }>({ avatar: '', name: '', gender: '', email: '', phoneNumber: '', degree: '' });

    const [fileListImage, setFileListImage] = useState<MyUploadFile[]>([]);
    const [error, setError] = useState<string>('');
    const [fileImage, setFileImage] = useState<RcFile>()

    const [updateId, setUpdateId] = useState<number | null>(null);
    const [status, setStatus] = useState("insert");

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);


    useEffect(() => {
        getListLecturer()
    }, [termState]);

    const getListLecturer = () => {
        if (termState.termIndex.id) {
            lecturerService
                .getWithTerm(termState.termIndex.id)
                .then((response) => {
                    console.log("response setLecturer", response);

                    const _data = response.data.map(
                        (value: Teacher, index: number) => {
                            return { ...value, key: index };
                        }
                    );
                    setLecturer(_data);
                    console.log("lecturer _data ->", _data);

                });
        }
    }

    const [columnVisible, setColumnVisible] = useState<Array<any>>([]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleUpload = () => {
        const formData = new FormData();
        formData.append("majorsId", user.majors.id + "");
        formData.append("termId", String(termState.termIndex.id));
        formData.append("file", fileList[0] as RcFile);


        console.log("fileList[0]  == ", fileList[0]);
        console.log("formdata== ", formData);

        setUploading(true);

        lecturerService
            .import(formData)
            .then((result) => {
                setFileList([]);
                showMessage("Tải file thành công", 3000)
                getListLecturer()
            })
            .catch((error) => {
                setFileList([]);
                showMessageEror("Tải file thất bại! Vui lòng kiểm tra lại", 3000)
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
            console.log(file);

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
    };
    const beforeUploadImage = (file: RcFile) => {
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

        return "";
    }

    const onFinish = (value: any) => {
        // var bodyFormData = new FormData();
        // console.log("value 1", value);


        // if (fileImage) {
        //     console.log('file -> ', fileImage)
        //     bodyFormData.append('avatar', fileImage)
        // } else {
        //     bodyFormData.append('avatar', user?.avatar)
        // }

        // bodyFormData.append("name", value?.name);
        // bodyFormData.append("gender", value?.gender);
        // bodyFormData.append("email", value?.email);
        // bodyFormData.append("phoneNumber", value?.phoneNumber);
        // bodyFormData.append("degree", value?.degree);


        lecturerService.addLecturer({
            ...value, majorsId: user.majors.id,
            termId: termState.termIndex.id,
            username: value?.username,
            name: value?.name,
            gender: value?.gender,
            email: value?.email,
            phoneNumber: value?.phoneNumber,
            degree: value?.degree,
        }).then((result) => {

            setOpen(false);
            getListLecturer()
            showMessage("Đã thêm Giảng Viên", 5000);
            console.log("result add ", result);
            // window.location.reload();
        }).catch((er) => {
            setOpen(false);
            showMessageEror(er.response.data.error, 5000);
        })

    };


    const handleChangeSelectedOption = (value: string) => {
        console.log(`selected ${value}`);
    };

    const showEditModal = (id: number) => {
        console.log("update id -> ", id);
        console.log("lecturer -> ", lecturer);

        setUpdateId(id);
        setOpen(true);
        setStatus("update");
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

    const renderTableLecturer = useMemo(() => {
        return (
            <Table dataSource={lecturer} columns={baseColumns} scroll={{ y: 570 }} />
        )
    }, [lecturer, baseColumns])

    return (
        <div className={cls("teacher_management")}>
            <ToastContainer />
            <div className={cls("function")}>

                <Row justify={"space-around"}>
                    <Col>  <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{
                            margin: "0 10px",
                            animation: "none",
                            color: "rgb(80, 72, 229)",
                        }}
                        onClick={showModal}
                    >
                        Tạo
                    </Button></Col>
                    <Col >

                        <div className={cls("content_button_upload")}>
                            <Upload {...props} >
                                <Button
                                    type="dashed"
                                    icon={<UploadOutlined />}
                                    size="large"
                                    style={{
                                        animation: "none",
                                        color: "rgb(80, 72, 229)",
                                    }}
                                >
                                    Tải lên
                                </Button>
                            </Upload>
                            <div className={cls("btn_loading")}>
                                <Button
                                    type="primary"
                                    onClick={handleUpload}
                                    disabled={fileList.length === 0}
                                    loading={uploading}
                                    style={{
                                        animation: "none",
                                        alignItems: 'center'
                                    }}
                                >
                                    {uploading ? "Uploading" : "Start Upload"}
                                </Button>
                            </div>
                        </div>

                    </Col>
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
                                {/* <Row justify={'center'} style={{ marginBottom: '20px' }} >
                                    <Col>  <p>Chọn ảnh đại diện</p></Col>
                                    <Col offset={1}>
                                        <Upload
                                            accept={"image/png, image/jpeg"}
                                            listType="picture"
                                            fileList={fileListImage}
                                            beforeUpload={beforeUploadImage}
                                            onChange={onChangeImage}
                                            action={handleUploadImage}
                                            maxCount={1}
                                        >

                                            <div className={cls('btn_upload')}>
                                                <Button icon={<UploadOutlined />} style={{ borderRadius: 16 }}>Tải thêm ảnh</Button>
                                                <p>{error ?? ''}</p>
                                            </div>
                                        </Upload>
                                    </Col>
                                </Row> */}
                                <Row justify={'space-between'}>
                                    <Col span={24}>
                                        <Form.Item name="username" label="Mã Giảng Viên" rules={[{ required: true, message: 'Vui lòng nhập mã' }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="name" label="Tên Giảng Viên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
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

                                        <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                                            <Input />
                                        </Form.Item>

                                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                                            <Input />
                                        </Form.Item>


                                        <Form.Item name="degree" label="Trình độ" rules={[{ required: true, message: 'Vui lòng chọn giới trình độ' }]}>
                                            <Select
                                                style={{ width: 120 }}
                                                onChange={handleChangeSelectedOption}
                                                options={[
                                                    { value: 'MASTERS', label: 'Tiến sĩ' },
                                                    { value: 'DOCTER', label: 'Thạc sĩ' },
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
    );
};

export default TeacherManagement;
