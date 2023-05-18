import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './Header.module.scss';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { Badge, Input, Button, Row, Col, notification, Menu, Dropdown, MenuProps, Space, Tooltip, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { AppstoreOutlined, BellOutlined, CheckOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { log } from 'console';
import { hover } from '@testing-library/user-event/dist/hover';
import authService from 'src/services/auth';
import { setNotyfy } from 'src/redux/slices/user_slice';
import authAPI from 'src/redux/apis/auth';

import { TypeNotificationPath, showMessage } from 'src/constant';
import Notify from 'src/entities/notify';
import { ToastContainer } from 'react-toastify';
const { Search } = Input;
const cls = classNames.bind(style);
const logo = 'assets/Logo_IUH.png';

interface Props {
  lable: string;
  string: string;
}

function AppHeader() {
  const onSearch = (value: string) => console.log(value);
  const userState = useAppSelector((state) => state.user);
  const [notify, setNotify] = useState<Array<Notify>>([]);
  const [newNotify, SetNewNotify] = useState(0);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isRead, setRead] = useState(false);

  useEffect(() => {
    getNotifyApi();
  }, []);

  const getNotifyApi = () => {
    authService
      .getAllMotify()
      .then((result) => {
        setNotify(result.data);
        console.log('result.data', result.data);

        let sum = 0;
        console.log('sum 1', sum);
        for (const item of result.data) {
          if (item.read === 0) {
            sum += item.id;
          }
        }
        console.log('sum', sum);

        SetNewNotify(sum);
      })
      .catch((error) => console.log('errr', error));
  };

  const handleNotify = (e: string) => {
    console.log('Handle ->', e);
  };

  const handleClickItem = (id: number) => {
    const m = notify.filter((item) => id === item.id)[0];
    const path = TypeNotificationPath[m.type];
    console.log('path->', path);

    authService
      .readNotify(id)
      .then((result) => {
        console.log('handleClickItem', result.data);
        showMessage(`Đã đọc thông báo:  ${result.data.message}`, 2000);
        navigate(path);
        getNotifyApi();
      })
      .catch((error) => console.log('errr', error));
  };

  const handleReadAllNotify = () => {
    console.log('read all ->');
    authService
      .readAllNotify()
      .then((result) => {
        console.log('result', result.data);
        showMessage('Đánh dấu tất cả là đã đọc', 2000);
        getNotifyApi();
      })
      .catch((error) => console.log('errr', error));
  };

  const menu = () => {
    return (
      <Menu>
        <div
          style={{
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: '10px',
            boxShadow: 'rgba(50, 50, 93, 0.25)',
            borderRadius: '5px',
            borderBottomWidth: '5px',
            marginBottom: '3px',
          }}
        >
          <Row justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
            <Col>
              <div
                style={{
                  color: '#f07167',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                Thông báo
              </div>
            </Col>
            <Col>
              <Button
                block={false}
                disabled={notify.length > 0 ? false : true}
                style={{ borderColor: '#fff' }}
                onClick={handleReadAllNotify}
              >
                <CheckOutlined style={{ color: '#6d6875', marginRight: '10px' }} />
                <Space wrap style={{ color: '#006400', fontSize: '1rem', textTransform: 'uppercase' }}>
                  Đánh dấu tất cả là đã đọc
                </Space>
              </Button>
            </Col>
          </Row>
          <Row justify={'end'} align={'middle'} style={{ width: '100%' }}>
            <div
              style={{
                color: '#6d6875',
                fontSize: '1rem',
                fontWeight: '7500',
                textTransform: 'uppercase',
                padding: '5px',
              }}
            >
              Tất cả: {newNotify} thông báo mới
            </div>
          </Row>
          <Divider dashed style={{ margin: '0px', color: '#f07167' }} />
        </div>
        {notify.map((item, index) => {
          return (
            <>
              <Menu.Item key={index} onClick={() => handleClickItem(item.id)}>
                <Row justify={'start'} align={'middle'} style={{ width: '100%', borderRadius: '5px' }}>
                  <Col span={2}>
                    <MdOutlineNotificationsActive
                      size={26}
                      style={{ color: item.read === 0 ? '#f07167' : '#6d6875', marginRight: '20px' }}
                    />
                  </Col>
                  <Col span={18}>
                    <Row justify={'center'} align={'middle'}>
                      <Col span={24}>
                        <div
                          style={{
                            color: item.read === 0 ? '#44c0d8' : '#8d99ae',
                            fontSize: '1.1rem',
                            fontWeight: '500',
                          }}
                        >
                          Thông báo
                        </div>
                      </Col>
                      <Col span={24}>
                        <div
                          style={{
                            color: item.read === 0 ? '#264653' : '#adb5bd',
                            fontSize: '1rem',
                            fontWeight: '400',
                          }}
                          className={cls('content_noti')}
                        >
                          {item.message}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row justify={'end'} align={'middle'} style={{ width: '100%' }}>
                  <Col>
                    <CheckOutlined style={{ color: item.read === 0 ? 'green' : '#6d6875', marginRight: '5px' }} />
                    <Space wrap style={{ color: item.read === 0 ? 'green' : '#6d6875' }}>
                      {item.read === 0 ? 'Chưa đọc' : 'Đã đọc'}
                    </Space>
                  </Col>
                </Row>
              </Menu.Item>
              <Divider dashed style={{ margin: '0px' }} />
            </>
          );
        })}
      </Menu>
    );
  };
  return (
    <div className={cls('header')}>
      <ToastContainer />
      <Row gutter={[8, 24]} justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
        <Col span={24} offset={18}>
          <Row>
            <Col>
              <div className={cls('menu')}>
                {userState.is_login && (
                  <>
                    <div className={cls('item')}>
                      {/* <Button onClick={() => navigate('/notification')}>
                    <Badge count={5}>
                      <MdOutlineNotificationsActive />
                    </Badge>
                  </Button> */}

                      <Dropdown
                        overlay={menu}
                        overlayStyle={{ borderRadius: '5px', width: '500px', height: '600px', overflowY: 'auto' }}
                        className={cls('dropdown')}
                      >
                        <Button>
                          <Badge count={newNotify}>
                            <MdOutlineNotificationsActive />
                          </Badge>
                        </Button>
                      </Dropdown>
                      {/* <Dropdown menu={{ items }} overlayStyle={{ borderRadius: '5px', width: '500px' }} className={cls('dropdown')}>
                        <Button>
                          <Badge count={5}>
                            <MdOutlineNotificationsActive />
                          </Badge>
                        </Button>
                      </Dropdown> */}
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Col>

        {!userState.is_login && (
          <Col span={24} offset={22}>
            <div className={cls('login')}>
              <Link to="/login">
                <Button size="large" type="primary">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </Col>
          // <Col span={24} offset={9}>
          //   <Row justify={'center'} align={'stretch'}>
          //     <Col>
          //       <Link to="/login" style={{ margin: '0 20px' }}>
          //         <Button size="large" type="primary">
          //           Đăng nhập
          //         </Button>
          //       </Link>
          //     </Col>
          //   </Row>
          // </Col>
        )}
      </Row>
    </div>
  );
}
export default AppHeader;
