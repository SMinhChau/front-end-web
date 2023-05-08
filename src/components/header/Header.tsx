import React from 'react';
import classNames from 'classnames/bind';
import style from './Header.module.scss';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { Badge, Input, Button, Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
const { Search } = Input;
const cls = classNames.bind(style);
const logo = 'assets/Logo_IUH.png';

function AppHeader() {
  const onSearch = (value: string) => console.log(value);
  const userState = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className={cls('header')}>
      <Row justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
        <Col span={12}></Col>
        <Col span={12} offset={18}>
          <div className={cls('menu')}>
            {userState.is_login && (
              <>
                <div className={cls('item')}>
                  <Button onClick={() => navigate('/notification')}>
                    <Badge count={5}>
                      <MdOutlineNotificationsActive />
                    </Badge>
                  </Button>
                </div>
                {/* <Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            /> */}
              </>
            )}
          </div>
        </Col>
        {!userState.is_login && (
          <Col span={12} offset={21}>
            <Link to="/login" style={{ margin: '0 20px' }}>
              <Button size="large" type="primary">
                Đăng nhập
              </Button>
            </Link>
          </Col>
        )}
      </Row>
    </div>
  );
}
export default AppHeader;
