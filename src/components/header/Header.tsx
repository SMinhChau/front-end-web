import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Header.module.scss";
import { MdOutlineNotificationsActive } from "react-icons/md";
import headerMenu from "./header.menu";
import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { Badge } from "antd";

const cls = classNames.bind(style);

function AppHeader() {
    const [toggleUser, setToggleUser] = useState(false);
    const userState = useAppSelector((state) => state.user).user;

    const menu = headerMenu[userState.role];

    useEffect(() => {
        const close = (e: Event) => {
            const accountElement = document.getElementById(
                "account"
            ) as HTMLElement;
            if (!accountElement.contains(e.target as Node)) {
                setToggleUser(false);
            }
        };
        document.addEventListener("click", close);
        return () => {
            document.removeEventListener("click", close);
        };
    }, []);

    return (
        <div className={cls("header")}>
            <div className={cls("logo")}>
            </div>
            <div className={cls("menu")}>
                <div className={cls("item")}>
                    <Badge count={5}>
                        <MdOutlineNotificationsActive />
                    </Badge>
                </div>
                <div className={cls("account")} id="account">
                    <img src="avatars/2.jpg" alt="" onClick={() => setToggleUser((prev) => !prev)}/>
                    <div
                        className={cls("account_submenu")}
                        style={
                            toggleUser
                                ? { opacity: "1", visibility: "visible" }
                                : {}
                        }
                    >
                        <p className={cls("username")}>{userState.fullName}</p>
                        <p className={cls("role")}>{userState.role}</p>
                        <div className={cls("break_line")}></div>
                        {menu.map((value, index) => {
                            return (
                                <Link
                                    to={value.url}
                                    className={cls("menu_item")}
                                    key={index}
                                    onClick={() => setToggleUser(false)}
                                >
                                    <img src={value.icon} alt="" />
                                    <div>{value.name}</div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AppHeader;
