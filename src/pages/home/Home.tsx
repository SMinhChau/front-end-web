import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "~/redux/hooks";
import style from "./Home.module.scss";
import classNames from "classnames/bind";
import AppHeader from "~/components/header/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import slide1 from "~/assets/home/sl01.jpg";
import slide2 from "~/assets/home/sl02.png";
import "./Home.css";

const cls = classNames.bind(style);

const Home = () => {
    const userState = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    useEffect(() => {
        if (userState.is_login && userState.functions.length) {
            navigate(userState.functions[0].url);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userState]);

    return (
        <div className={cls("home_page")}>
            <AppHeader />
            <div className={cls("home_body")}>
                <Slider {...settings}>
                    <div className={cls("slide_item")}>
                        <div>
                            <h2>
                                Hệ Thống Đăng Ký Khóa Luận Tốt Nghiệp Online
                            </h2>
                            <span>
                                Đổi mới, nâng tầm cao mới - Năng động, hội nhập
                                toàn cầu
                            </span>
                        </div>
                        <img src={slide2} alt="" />
                    </div>
                    <div className={cls("slide_item")}>
                        <div>
                            <h2>
                                Hệ Thống Đăng Ký Khóa Luận Tốt Nghiệp Online
                            </h2>
                            <span>
                                Đổi mới, nâng tầm cao mới - Năng động, hội nhập
                                toàn cầu
                            </span>
                        </div>
                        <img src={slide1} alt="" />
                    </div>
                </Slider>
                <div className={cls("content")}>
                    <h1>Giới thiệu</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestiae dolore, perspiciatis quia architecto officia
                        veritatis ea totam eos sunt vitae iste doloribus sint
                        sapiente perferendis? Nulla quo sint aliquam rerum!
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Sint odit quo et inventore, temporibus ad deleniti
                        fuga accusantium corrupti corporis eaque ea maiores aut
                        nobis, tempore dignissimos nostrum laboriosam neque?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
