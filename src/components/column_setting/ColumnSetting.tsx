import React, { useState, useEffect, useRef } from "react";
import { SettingOutlined } from "@ant-design/icons";
import style from "./ColumnSetting.module.scss";
import classNames from "classnames/bind";
import { Modal, Checkbox } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import Crypto from "~/utils/crypto";

const cls = classNames.bind(style);

interface Props {
    setColumnVisible: React.Dispatch<React.SetStateAction<any[]>>;
    columns: Array<any>;
    cacheKey: string;
    style?: React.CSSProperties
}
const ColumnSetting = (props: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkValue, setCheckValue] = useState<Array<CheckboxValueType>>([]);
    const [columnIdx, setColumnIdx] = useState<Array<CheckboxValueType>>([])
    const defaultSelect = useRef<Array<CheckboxValueType>>([])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        const temp = [...checkValue];
        temp.sort();
        const encrypt = Crypto.encrypt(JSON.stringify(temp));
        localStorage.setItem(props.cacheKey, encrypt);
        setColumnIdx(temp)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onCheckChange = (checkedValues: CheckboxValueType[]) => {
        setCheckValue(checkedValues);
    };

    useEffect(() => {
        const encrypted = localStorage.getItem(props.cacheKey);
        const idx = Crypto.decrypt(encrypted + "");
        if (idx) {
            setColumnIdx(idx);
            defaultSelect.current = idx
        } else {
            setColumnIdx(Array.from(Array(props.columns.length).keys()));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const temp = [];
        for (let i = 0; i < props.columns.length; i++) {
            if (columnIdx.includes(i)) {
                temp.push(props.columns[i]);
            }
        }
        props.setColumnVisible(temp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnIdx]);

    return (
        <div className={cls("column_setting")} style={props?.style}>
            <SettingOutlined onClick={showModal} />
            <Modal
                title="Hiển thị cột trong bảng"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Checkbox.Group
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                    onChange={onCheckChange}
                    defaultValue={defaultSelect.current}
                >
                    {props.columns.map((value: any, index: number) => {
                        return (
                            <Checkbox value={index} key={index}>
                                {value.title}
                            </Checkbox>
                        );
                    })}
                </Checkbox.Group>
            </Modal>
        </div>
    );
};

export default ColumnSetting;
