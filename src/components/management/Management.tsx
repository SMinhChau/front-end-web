import React, { useRef } from "react";
import classNames from "classnames/bind";
import style from "./Management.module.scss";
import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";
import tokenService from "~/services/token";
import { BiLogOutCircle } from "react-icons/bi";

const cls = classNames.bind(style);

const Management = () => {
    const pathRef = useRef(window.location.pathname);
    const userState = useAppSelector((state) => state.user);

    const logout = () => {
        tokenService.reset();
        window.location.href = "/login";
    };

    return (
        <div className={cls("management")}>
            <div className={cls("menu")} id="menu">
                <div className={cls("empty")}>
                    <img src={userState.user.avatar} alt="" />
                    <div className={cls("username")}>{userState.user.name}</div>
                </div>
                <hr />
                {userState.functions.map(
                    ({ name, image: Image, url }, index) => {
                        return (
                            <Link
                                to={url + ""}
                                className={cls("menu_item")}
                                key={index}
                                style={
                                    pathRef.current === url
                                        ? {
                                              color: "rgb(24, 144, 255)",
                                              background: "#e6f7ff",
                                              borderRight:
                                                  "3px solid rgb(24, 144, 255)",
                                          }
                                        : {}
                                }
                            >
                                <Image
                                    style={{ fontSize: 22, marginRight: 10 }}
                                />
                                <p>{name}</p>
                            </Link>
                        );
                    }
                )}
                <hr style={{ marginTop: 100 }} />
                <div className={cls("menu_item")} onClick={logout}>
                    <BiLogOutCircle style={{ fontSize: 22, marginRight: 10 }} />
                    <p>Đăng xuất</p>
                </div>
            </div>
        </div>
    );
};

export default Management;
