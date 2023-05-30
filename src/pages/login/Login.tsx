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
import { Checkbox, Col, Form, Input, Radio, RadioChangeEvent, Row } from 'antd';
import { showMessage, showMessageEror } from '../../constant';
import { checkString } from '../../constant';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { setChecked, setLogin, setLoginIsAdmin } from 'src/redux/slices/user_slice';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { EnumRole } from 'src/enum';
import { MdPersonOutline } from 'react-icons/md';
import { UserOutlined } from '@ant-design/icons';
import tokenService from 'src/services/token';

const logo = 'assets/Logo_IUH.png';
const bgImg = 'assets/bg.webp';
const cls = classNames.bind(style);

function Login() {
  const userState = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [value, setValue] = useState(EnumRole.LECTURER);

  const onChangeCheckbox = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    localStorage.setItem('role', e.target.value);
    dispatch(setChecked(e.target.value));
  };

  const login = (values: any) => {
    const check = checkString(values.username);
    localStorage.setItem('role', value);
    dispatch(setChecked(value));
    if (check === false) {
      showMessageEror('Tên không chứa ký tự đặt biệt', 3000);
    } else {
      dispatch(authAPI.login()({ username: values.username, password: values.password }));
    }
  };

  useEffect(() => {
    if (userState.is_login === true) {
      if (userState.errorCheck === true) {
        showMessage('Đăng nhập thành công', 3000);
        navigate('/');
      } else {
        showMessageEror('Bạn không thuộc quyền này vui lòng đăng nhập lại', 5000);
        dispatch(setLogin(false));
        tokenService.reset();
      }
    } else {
      if (userState.error === true) {
        showMessageEror('Thông tin đăng nhập không chính xác', 5000);
      }
    }
  }, [userState.is_login, userState.errorCheck, userState.error, userState.isRole]);

  return (
    <div className={cls('login_container')}>
      <ToastContainer />
      {/* <img src={bgImg} alt="" id="bg_login" className={cls('bg')} /> */}
      <Form action="" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} onFinish={login} size="large">
        <div className={cls('form_content')}>
          <img src={logo} alt="" />
          <div className={cls('form_header')}>Đăng nhập</div>
          <Row justify={'space-between'} style={{ width: '100%' }} align={'middle'}>
            <Col span={24}>
              <Form.Item
                label={<div className={cls('lable')}>Tên đăng nhập</div>}
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input style={{ fontSize: '1.1rem' }} />
              </Form.Item>

              <Form.Item
                label={<div className={cls('lable')}>Mật khẩu</div>}
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu', min: 6 }]}
              >
                <Input.Password style={{ fontSize: '1.1rem' }} />
              </Form.Item>

              <Row justify={'start'} align={'middle'} style={{ width: '100%', padding: '10px' }}>
                <Col span={8}>
                  <div className={cls('lable_radio')}>
                    Đăng nhập với quyền <UserOutlined sizes="30" />
                  </div>
                </Col>

                <Col span={16}>
                  <Radio.Group size="large" onChange={onChangeCheckbox} value={value}>
                    <Row justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
                      <Col>
                        <Radio value={'ADMIN'} style={{ marginRight: '40px' }}>
                          <div className={cls('_lable')}>Người quản lý</div>
                        </Radio>
                        <Radio value={EnumRole.HEAD_LECTURER}>
                          <div className={cls('_lable')}>Trưởng bộ môn</div>
                        </Radio>
                      </Col>

                      <Col offset={8}>
                        <Radio value={EnumRole.LECTURER}>
                          <div className={cls('_lable')}>Giảng viên</div>
                        </Radio>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Col>
              </Row>
              <Row justify={'center'} align={'middle'} style={{ width: '100%' }}>
                <Col span={18}>
                  <div className={cls('content_function')}>
                    <Row justify={'end'} align={'middle'} style={{ width: '100%' }}>
                      {/* <Col offset={4}>
                      <Checkbox onChange={onChange}> Quản lý</Checkbox>
                    </Col> */}
                      <Col offset={4}>
                        <Link to="/forgot-password" className={cls('forgot_password')}>
                          <div className={cls('lable')}> Quên mật khẩu?</div>
                        </Link>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>

              <Row justify={'center'}>
                <button type="submit">
                  <div className={cls('btn')}>Đăng nhập</div>
                </button>
              </Row>
            </Col>
          </Row>
        </div>
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
