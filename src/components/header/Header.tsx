import React from "react";
import classNames from "classnames/bind";
import style from "./Header.module.scss";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { Badge, Input } from "antd";
const { Search } = Input;

const cls = classNames.bind(style);

function AppHeader() {
    const onSearch = (value: string) => console.log(value);
    return (
        <div className={cls("header")}>
            <div className={cls("logo")}></div>
            <div className={cls("menu")}>
                <div className={cls("item")}>
                    <Badge count={5}>
                        <MdOutlineNotificationsActive />
                    </Badge>
                </div>
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                />
            </div>
        </div>
    );
}
export default AppHeader;
