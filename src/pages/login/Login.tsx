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
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { showMessage, showMessageEror } from '../../constant';
import { checkString } from '../../constant';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { setLoginIsAdmin } from 'src/redux/slices/user_slice';

const logo = 'assets/Logo_IUH.png';
const bgImg = 'assets/bg.webp';
const cls = classNames.bind(style);

function Login() {
  const userState = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = (values: any) => {
    const check = checkString(values.username);
    console.log('login .admin -> ', userState.admin);
    if (check === false) {
      showMessageEror('Tên không chứa ký tự đặt biệt', 3000);
    } else {
      dispatch(authAPI.login()({ username: values.username, password: values.password }));
    }
  };

  useEffect(() => {
    if (userState.is_login === true) {
      showMessage('Đăng nhập thành công', 3000);
      navigate('/');
    } else {
      if (userState.error === true) {
        showMessageEror('Thông tin đăng nhập không chính xác', 5000);
      }
    }
  }, [userState]);

  const onChange = (e: CheckboxChangeEvent) => {
    console.log('userState.admin -> ', userState.admin);

    console.log(`checked = ${e.target.checked}`);
    dispatch(setLoginIsAdmin(true));
  };

  return (
    <div className={cls('login_container')}>
      <ToastContainer />
      {/* <img src={bgImg} alt="" id="bg_login" className={cls('bg')} /> */}
      <Form action="" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} onFinish={login} size="large">
        <img src={logo} alt="" />
        <div className={cls('form_header')}>Đăng nhập</div>
        <Row justify={'space-between'} style={{ width: '100%' }}>
          <Col span={24}>
            <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu', min: 6 }]}>
              <Input.Password />
            </Form.Item>
            <Row justify={'center'} align={'middle'} style={{ width: '100%' }}>
              <Col span={18}>
                <div className={cls('content_function')}>
                  <Row justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
                    <Col offset={4}>
                      <Checkbox onChange={onChange}> Quản lý</Checkbox>
                    </Col>
                    <Col offset={4}>
                      <Link to="/forgot-password" className={cls('forgot_password')}>
                        Quên mật khẩu?
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <Row justify={'center'}>
              <button type="submit">Đăng nhập</button>
            </Row>
          </Col>
        </Row>
      </Form>

      <ul className={cls('circles')}>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}

export default Login;
