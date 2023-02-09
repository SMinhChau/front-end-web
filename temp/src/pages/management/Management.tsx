import React, { useState } from "react";
import classNames from "classnames/bind";
import style from "./Management.module.scss";
import menus from "./menu";
import { useAppSelector } from "../../redux/hooks";
import AppHeader from "../../components/header/Header";

const cls = classNames.bind(style);

const Management = () => {
  const [menuSelected, setMenuSelected] = useState(0);
  const userState = useAppSelector((state) => state.user);
  const role = userState.user.role;
  const menu = menus[role];
  const [menuContainer, setMenuContainer] = useState<JSX.Element>(
    menu[0].container
  );

  return (
    <>
      <AppHeader />
      <div className={cls("management")}>
        <div className={cls("wraper")}>
          <div className={cls("wrapper_top")}>
            {userState.user.role === "admin" ? (
              <div></div>
            ) : (
              <div className={cls("major")}>
                <img src="icons/1.png" alt="" />
                <div>{userState.user.major}</div>
              </div>
            )}
            <select name="" id="">
              <option value="1-2022-2023">Học kì 1 2023-2024</option>
            </select>
          </div>
          <div className={cls("wraper_bottom")}>
            <div className={cls("menu")} id="menu">
              <div className={cls("empty")}></div>
              {menu.map((value, index) => {
                return (
                  <div
                    className={cls("menu_item")}
                    key={index}
                    onClick={() => {
                      setMenuContainer(value.container);
                      setMenuSelected(index);
                    }}
                    style={
                      menuSelected === index
                        ? {
                            color: "#838690",
                            filter: "opacity(50%)",
                          }
                        : {}
                    }
                  >
                    <img src={value.image} alt="" />
                    <p>{value.name}</p>
                  </div>
                );
              })}
            </div>
            <div className={cls("function_container")}>{menuContainer}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Management;
