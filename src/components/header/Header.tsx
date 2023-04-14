import React from "react";
import classNames from "classnames/bind";
import style from "./Header.module.scss";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { Badge, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { useAppSelector } from "~/redux/hooks";

const { Search } = Input;

const cls = classNames.bind(style);

function AppHeader() {
  const onSearch = (value: string) => console.log(value);
  const userState = useAppSelector((state) => state.user);
  return (
    <div className={cls("header")}>
      <div className={cls("logo")}></div>
      <div className={cls("menu")}>
        {userState.is_login && (
          <>
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
          </>
        )}

        {!userState.is_login && (
          <Link to="/login" style={{ margin: "0 20px" }}>
            <Button size="large" type="primary">
              Đăng nhập
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
export default AppHeader;
