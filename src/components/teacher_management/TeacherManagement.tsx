import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./TeacherManagement.module.scss";
import { Table, Avatar, Button, Upload, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import Config from "~/utils/config";
import ColumnSetting from "../column_setting/ColumnSetting";
import Term from "~/entities/term";
import Teacher from "~/entities/teacher";
import { useAppSelector } from "~/redux/hooks";
import type { UploadProps, UploadFile, RcFile } from "antd/es/upload/interface";

import termService from "~/services/term";
import lecturerService from "~/services/lecturer";
import { EnumGender } from "~/enum";

const cls = classNames.bind(style);

interface LecturerTable extends Teacher {
    key: number;
}

const TeacherManagement = () => {
    const [term, setTerm] = useState<Array<Term>>([]);
    const [termSelect, setTermSelect] = useState<number | null>(null);
    const [lecturer, setLecturer] = useState<Array<LecturerTable>>([]);
    const { user } = useAppSelector((state) => state.user);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        termService
            .getTerm({ majorsId: user.majors.id })
            .then((response) => {
                setTerm(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (term.length > 0) {
            lecturerService
                .getWithTerm(termSelect !== null ? termSelect : term[0].id)
                .then((response) => {
                    const _data = response.data.map(
                        (value: Teacher, index: number) => {
                            return { ...value, key: index };
                        }
                    );
                    setLecturer(_data);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [term, termSelect]);

    const baseColumns: ColumnsType<any> = [
        {
            title: "",
            dataIndex: "avatar",
            key: "avatar",
            render: (url) => (
                <Avatar
                    src={url}
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
            key: "degree",
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
                text === EnumGender.FEMALE ? "Nam" : "Nữ",
        },
    ];

    const [columnVisible, setColumnVisible] = useState<Array<any>>([]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleUpload = () => {
        const formData = new FormData();
        formData.append("majorsId", user.majors.id + "");
        formData.append("termId", (termSelect ? termSelect : term[0].id) + "");
        formData.append("file", fileList[0] as RcFile);

        setUploading(true);
        lecturerService
            .import(formData)
            .then(() => {
                setFileList([]);
                message.success("upload successfully.");
            })
            .catch(() => {
                setFileList([]);
                message.error("upload failed.");
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

    return (
        <div className={cls("teacher_management")}>
            <div className={cls("function")}>
                <Select
                    style={{ width: 120 }}
                    onChange={(value) => {
                        setTermSelect(value);
                    }}
                    options={term.map((val) => {
                        return {
                            value: val.id,
                            label: val.name,
                        };
                    })}
                />
                <div>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{
                            margin: "0 10px",
                            animation: "none",
                            color: "rgb(80, 72, 229)",
                        }}
                    >
                        Tạo
                    </Button>
                    <Upload {...props}>
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
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{
                            animation: "none",
                            marginLeft: 10,
                        }}
                    >
                        {uploading ? "Uploading" : "Start Upload"}
                    </Button>
                </div>
                <ColumnSetting
                    setColumnVisible={setColumnVisible}
                    columns={baseColumns}
                    cacheKey={Config.TEACHER_CACHE_KEY}
                />
            </div>
            <Table dataSource={lecturer} columns={columnVisible} />
        </div>
    );
};

export default TeacherManagement;
