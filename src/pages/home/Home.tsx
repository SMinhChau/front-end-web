import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import style from './Home.module.scss';
import classNames from 'classnames/bind';
import AppHeader from '../../components/header/Header';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './Home.css';
import contentHome, { LIST_DES, MAIN } from '../../pages/home/content';
import { Carousel, Col, Row, Typography } from 'antd';
import { CopyrightOutlined, HeartOutlined } from '@ant-design/icons';
import { AiFillReconciliation, AiOutlineMail, AiOutlineRead, AiOutlineUser } from 'react-icons/ai';

const cls = classNames.bind(style);
const { Text } = Typography;

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

  const _StudentData = [
    {
      name: 'Nguyễn Thị Minh Châu',
      email: 'chaunguyen.141201@gmail.com',
    },
    {
      name: 'Nguyễn Thanh Sơn',
      email: 'nguyenthanhson162001@gmail.com',
    },
  ];
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
        <Row justify={'center'} align={'middle'} style={{ width: '100%', marginTop: '20px' }}>
          <div className={cls('content')}>
            <div className={cls('_title')}>
              <h1 className={cls('title')}>Giới thiệu</h1>
              <Row justify={'center'} align={'middle'} style={{ width: '50%' }}></Row>
            </div>
            <div className={cls('main_content')}>
              <h2 className={cls('content_title')}>{MAIN.title}</h2>
              <p style={{ color: '#415a77', fontWeight: '400', fontSize: '1.2rem' }} className={cls('content_title')}>
                {MAIN.main}
              </p>
            </div>
          </div>
        </Row>

        <div className={cls('info')}>
          <Row justify={'center'} align={'middle'} style={{ width: '100%' }}>
            <Col span={12}>
              <h1 className={cls('name_school')}>Trường đại học công nghiệp thành phố hồ chí minh</h1>
            </Col>

            <Col span={12} style={{ width: '100%', height: '10%' }}>
              <h1 className={cls('title')}>Một số chứ năng</h1>
              <Carousel autoplay style={{ position: 'relative' }}>
                {LIST_DES.map((item) => {
                  return (
                    <div className={cls('conttent')}>
                      <h2 className={cls('content_title')}>{item.title}</h2>
                    </div>
                  );
                })}
              </Carousel>
            </Col>
          </Row>
        </div>
      </div>

      <div className={cls('home_footer')}>
        <Row>
          <Col xs={{ span: 5 }} lg={{ span: 6, offset: 1 }}>
            <h1 className={cls('title')}>Liên hệ</h1>
            {_StudentData.map((item) => (
              <>
                <Row justify={'start'} align={'top'} style={{ paddingLeft: '30px', paddingBottom: '10px' }}>
                  <Text strong className={cls('title_name')}>
                    <AiOutlineUser style={{ fontSize: '1.2rem', fontWeight: '700' }} /> {item.name}
                  </Text>
                  <Text strong className={cls('title_emai')}>
                    <AiOutlineMail style={{ fontSize: '1.2rem', fontWeight: '700' }} /> {item.email}
                  </Text>
                </Row>
              </>
            ))}
          </Col>
          <Col xs={{ span: 5 }} lg={{ span: 6, offset: 2 }}>
            <div className={cls('footer_center')}>
              <AiOutlineRead
                className={cls('icon')}
                style={{
                  fontSize: '26px',
                  color: '#344e41',
                }}
              />
              <Text className={cls('title_footer')}>@ 2023</Text>
              <HeartOutlined
                className={cls('icon')}
                style={{
                  fontSize: '26px',
                  color: '#344e41',
                  fontWeight: 'bold',
                }}
              />
            </div>
          </Col>
          <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
            <h1 className={cls('title')}>Thống kê</h1>
            <Row justify={'center'} align={'middle'} style={{ paddingLeft: '30px', paddingBottom: '10px' }}>
              <Text strong className={cls('title_name')}>
                ! Chưa có thông tin
              </Text>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
