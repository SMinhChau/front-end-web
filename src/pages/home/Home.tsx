import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import style from './Home.module.scss';
import classNames from 'classnames/bind';
import AppHeader from '../../components/header/Header';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import './Home.css';
import contentHome from '../../pages/home/content';
import { Col, Row } from 'antd';
import { CopyrightOutlined, HeartOutlined } from '@ant-design/icons';

const slide1 = 'assets/home/sl01.jpg';
const slide2 = 'assets/home/sl02.png';

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
    <div className={cls('home_page')}>
      <AppHeader />
      <div className={cls('home_body')}>
        <Slider {...settings}>
          <div className={cls('slide_item')}>
            <div>
              <h2>{contentHome.title}</h2>
              <span>{contentHome.slide}</span>
            </div>
            <img src={slide2} alt="" />
          </div>
          <div className={cls('slide_item')}>
            <div>
              <h2>{contentHome.title}</h2>
              <span>{contentHome.slide}</span>
            </div>
            <img src={slide1} alt="" />
          </div>
        </Slider>
        <div className={cls('content')}>
          <div className={cls('_title')}>
            <Row justify={'center'} align={'middle'}>
              <h1 className={cls('title')}>Giới thiệu</h1>
            </Row>
          </div>
          <div className={cls('main_content')}>
            <h2 className={cls('content_title')}>{contentHome.title}</h2>
            <p style={{ color: '#415a77', fontWeight: '400' }} className={cls('content_title')}>
              {contentHome.main}
            </p>
          </div>
        </div>
      </div>
      <div className={cls('home_footer')}>
        <Row justify={'center'} align={'middle'}>
          <HeartOutlined style={{ fontSize: '16px', color: 'red', fontWeight: 'bold' }} />
          <Col className={cls('title_footer')} style={{ padding: '10px' }}>
            2023
          </Col>
          <HeartOutlined style={{ fontSize: '16px', color: 'red', fontWeight: 'bold' }} />
        </Row>
      </div>
    </div>
  );
};

export default Home;
