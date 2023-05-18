import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './Header.module.scss';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { Badge, Input, Button, Row, Col, notification, Menu, Dropdown, MenuProps, Space, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { AppstoreOutlined, BellOutlined, CheckOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { log } from 'console';
import { hover } from '@testing-library/user-event/dist/hover';
import authService from 'src/services/auth';
import { setNotyfy } from 'src/redux/slices/user_slice';
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

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isRead, setRead] = useState(false);

  useEffect(() => {
    authService
      .getAllMotify()
      .then((result) => {
        console.log('result getAllMotify', result.data);
        dispatch(setNotyfy(result.data));
      })
      .catch((error) => console.log('errr', error));
  }, []);

  const handleNotify = (e: string) => {
    console.log('Handle ->', e);
  };

  const Item = ({ lable, string }: Props) => {
    return (
      <>
        <>
          <Row justify={'start'} align={'middle'} style={{ width: '100%', borderRadius: '5px' }}>
            <Col span={2}>
              <MdOutlineNotificationsActive size={26} style={{ color: isRead === false ? '#f07167' : '#6d6875', marginRight: '20px' }} />
            </Col>
            <Col span={18}>
              <Row justify={'center'} align={'middle'}>
                <Col span={24}>
                  <div
                    style={{
                      color: isRead === false ? '#44c0d8' : '#8d99ae',
                      fontSize: '1.1rem',
                      fontWeight: '500',
                    }}
                  >
                    {lable}
                  </div>
                </Col>
                <Col span={24}>
                  <div
                    style={{
                      color: isRead === false ? '#264653' : '#adb5bd',
                      fontSize: '1rem',
                      fontWeight: '400',
                    }}
                    className={cls('content_noti')}
                  >
                    {string}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row justify={'end'} align={'middle'} style={{ width: '100%' }}>
            <Col>
              <CheckOutlined style={{ color: isRead === false ? 'green' : '#6d6875', marginRight: '5px' }} />
              <Space wrap style={{ color: isRead === false ? 'green' : '#6d6875' }}>
                {isRead === false ? 'Chưa đọc' : 'Đã đọc'}
              </Space>
            </Col>
          </Row>
        </>
      </>
    );
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Item lable={'Thông báo'} string={'Nội dung thông báo'} />,
      icon: '',
      onClick: () => handleNotify('1'),
      disabled: isRead === true ? false : true,
    },
    {
      key: '2',
      label: <Item lable={'Thông báo'} string={'Nội dung thông báo'} />,
      // icon: <MdOutlineNotificationsActive size={26} style={{ color: 'blue', marginRight: '20px' }} />,
      onClick: () => handleNotify('2'),
    },

    {
      key: '4',
      danger: true,
      label: 'a danger item',
    },
  ];

  return (
    <div className={cls('header')}>
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
                      <Button>
                        <Badge count={5}>
                          <MdOutlineNotificationsActive />
                        </Badge>
                        {userState.notify?.map((i, index) => {
                          const items: MenuProps['items'] = [
                            {
                              key: '1',
                              label: <Item lable={'Thông báo'} string={i.message} />,
                              icon: '',
                              onClick: () => handleNotify('1'),
                              disabled: isRead === true ? false : true,
                            },
                          ];
                          return (
                            <Dropdown
                              menu={{ items }}
                              overlayStyle={{ borderRadius: '5px', width: '500px' }}
                              className={cls('dropdown')}
                            ></Dropdown>
                          );
                        })}
                      </Button>

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
