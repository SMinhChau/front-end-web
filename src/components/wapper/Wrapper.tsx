import React from "react";
import AppHeader from "../header/Header";
import Management from "../management/Management";
import classNames from "classnames/bind";
import style from "./Wrapper.module.scss";

const cls = classNames.bind(style);

const Wrapper = ({ children }: { children: React.ReactElement }) => {
    return (
        <div className={cls("wrapper")}>
            <div className={cls("menu_left")}>
                <Management />
            </div>
            <div className={cls("menu_right")}>
                <AppHeader />
                {children}
            </div>
        </div>
    );
};

export default Wrapper;
