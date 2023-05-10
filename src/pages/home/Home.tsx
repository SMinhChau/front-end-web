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
import contentHome, { LIST_DES, MAIN } from '../../pages/home/content';
import { Carousel, Col, Row } from 'antd';
import { CopyrightOutlined, HeartOutlined } from '@ant-design/icons';

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
        <Carousel autoplay style={{ position: 'relative' }}>
          {contentHome.map((item, key) => {
            return (
              <div className={cls('slide_item')}>
                <div>
                  <h2>{item.title}</h2>
                  <span>{item.slide}</span>
                </div>
                <img className={cls('img')} src={item.image} alt="" />
              </div>
            );
          })}
        </Carousel>
        <div className={cls('content')}>
          <div className={cls('_title')}>
            <Row justify={'center'} align={'middle'}>
              <h1 className={cls('title')}>Giới thiệu</h1>
            </Row>
          </div>
          <div className={cls('main_content')}>
            <h2 className={cls('content_title')}>{MAIN.title}</h2>
            <p style={{ color: '#415a77', fontWeight: '400' }} className={cls('content_title')}>
              {MAIN.main}
            </p>
          </div>
        </div>

        <div className={cls('info')}>
          <h1 className={cls('title')}>Một số chứ năng</h1>
          <Carousel autoplay style={{ position: 'relative' }}>
            {LIST_DES.map((item) => {
              return <h2 className={cls('content_title')}>{item.title}</h2>;
            })}
          </Carousel>
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
