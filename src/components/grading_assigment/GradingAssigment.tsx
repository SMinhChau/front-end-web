import React from "react";
import classNames from "classnames/bind";
import style from "./GradingAssigment.module.scss";
import { Card } from "antd";
import { Link } from "react-router-dom";

const cls = classNames.bind(style);

const GradingAssigment = () => {
    return (
        <div className={cls("grading_assigment")}>
            <div className={cls("filter_term")}>filter hoc ki</div>
            <Card title="Danh sách nhóm" className={cls("list_group")}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
                    <Card.Grid className={cls("group")} key={v}>
                        <div className={cls("group_name")}>Group {v}</div>
                        <div className={cls("group_member")}>
                            <div className={cls("member")}>
                                SV1: Nguyen Van A
                            </div>
                            <div className={cls("member")}>SV2: Tran Thi B</div>
                        </div>
                        <div className={cls('group_more')}>
                            <Link to="/group">Chi tiết...</Link>
                        </div>
                    </Card.Grid>
                ))}
            </Card>
        </div>
    );
};

export default GradingAssigment;
