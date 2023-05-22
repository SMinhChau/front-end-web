import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './FooterEnd.module.scss';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { Badge, Input, Button, Row, Col, notification, Menu, Dropdown, MenuProps, Space, Tooltip, Divider, Avatar, Popover } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  AppstoreOutlined,
  BellOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { log } from 'console';
import { hover } from '@testing-library/user-event/dist/hover';
import authService from 'src/services/auth';
import { setNotyfy } from 'src/redux/slices/user_slice';
import authAPI from 'src/redux/apis/auth';

import { TypeNotificationPath, showMessage } from 'src/constant';
import Notify from 'src/entities/notify';
import { ToastContainer } from 'react-toastify';
import { EnumRole } from 'src/enum';
import { RoleCheck } from 'src/enum';
const { Search } = Input;
const cls = classNames.bind(style);
const logo = 'assets/Logo_IUH.png';

interface Props {
  lable: string;
  string: string;
}

function FooterEnd() {
  const onSearch = (value: string) => console.log(value);
  const userState = useAppSelector((state) => state.user);
  const [notify, setNotify] = useState<Array<Notify>>([]);
  const [newNotify, SetNewNotify] = useState(0);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isRead, setRead] = useState(false);

  const getEvalutionName = () => {
    if (userState.admin === true) {
      return 'Người quản lý';
    } else {
      switch (userState.isRole) {
        case RoleCheck.ADMIN:
          return 'Người quản lý';
        case RoleCheck.HEAD_LECTURER:
          return 'Trưởng bộ môn';
        case RoleCheck.SUB_HEAD_LECTURER:
          return 'Phó trưởng bộ môn';
        case RoleCheck.LECTURER:
          return 'Giảng viên';
      }
    }
  };

  const content = <p style={{ fontSize: '1.2rem', color: 'green' }}>{getEvalutionName()}</p>;

  return (
    <div className={cls('header')}>
      <ToastContainer />
      <div className={cls('content')}>
        <Space wrap>
          <Popover content={content} trigger="hover" placement="left">
            <Badge>
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }}
                style={{ backgroundColor: '#87d068' }}
                icon={<UserOutlined />}
              />
            </Badge>
          </Popover>
        </Space>
      </div>

      {!userState.is_login && (
        <Col span={24} offset={22}></Col>
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
    </div>
  );
}
export default FooterEnd;
