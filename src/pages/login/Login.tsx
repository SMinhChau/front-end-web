import { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames/bind';
import style from './Login.module.scss';
import { Link } from 'react-router-dom';

import { useAppDispatch } from '../../redux/hooks';
import authAPI from '../../redux/apis/auth';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Input, Row } from 'antd';
import { showMessage, showMessageEror } from '../../constant';
import { checkString } from '../../constant';

const logo = 'assets/Logo_IUH.png';
const bgImg = 'assets/bg.webp';
const cls = classNames.bind(style);

function Login() {
  const userState = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = (values: any) => {
    const check = checkString(values.username);

    if (check === false) {
      showMessageEror('Tên không chứa ký tự đặt biệt', 3000);
    } else dispatch(authAPI.login()({ username: values.username, password: values.password }));
  };

  useEffect(() => {
    if (userState.is_login) {
      showMessage('Đăng nhập thành công', 3000);
      navigate('/');
    } else {
      if (userState.error) {
        showMessageEror('Thông tin đăng nhập không chính xác', 5000);
      }
    }
  }, [userState]);

  return (
    <div className={cls('login_container')}>
      <ToastContainer />
      <img src={bgImg} alt="" id="bg_login" className={cls('bg')} />
      <Form action="" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} onFinish={login} size="large">
        <img src={logo} alt="" />
        <div className={cls('form_header')}>Đăng nhập</div>
        <Row justify={'space-between'} style={{ width: '100%' }}>
          <Col span={24}>
            <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu', max: 6 }]}>
              <Input.Password />
            </Form.Item>

            <Link to="/forgot-password" className={cls('forgot_password')}>
              Quên mật khẩu?
            </Link>
            <Row justify={'center'}>
              <button type="submit">Đăng nhập</button>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Login;
