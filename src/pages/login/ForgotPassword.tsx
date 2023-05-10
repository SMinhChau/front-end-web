import classNames from 'classnames/bind';
import style from './ForgotPassword.module.scss';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { DoubleRightOutlined, UserOutlined } from '@ant-design/icons';
import authService from '../../services/auth';
import { checkString, showMessage, showMessageEror } from '../../constant';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
const cls = classNames.bind(style);

const bgImg = 'assets/home/sl02.png';
const logo = 'assets/Logo_IUH.png';
const { Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const check = checkString(values.username);
    if (check === true) {
      authService
        .forgotPassword({ ...values, username: values.username })
        .then((result) => {
          showMessage('Đã gửi yêu cầu lấy lại mật khẩu. Vui lòng kiểm tra email', 5000);
          navigate('/login');
        })
        .catch((error) => {
          showMessageEror(error.response.data.error, 5000);
        });
    } else {
      showMessageEror('Mã không chứa ký tự đặt biệt', 5000);
    }
  };

  return (
    <div className={cls('login_container')}>
      <ToastContainer />
      {/* <img src={bgImg} alt="" id="bg_login" className={cls('bg')} /> */}
      <Form action="" wrapperCol={{ span: 24 }} onFinish={onFinish} size="large">
        <img src={logo} alt="" />
        <div className={cls('form_header')}>Quên mật khẩu</div>
        <Row justify={'start'} style={{ width: '90%' }}>
          <Row style={{ marginBottom: '10px' }}>
            <Col>
              <Text strong type="secondary" className={cls('title')}>
                Mã Giảng Viên
              </Text>
            </Col>
          </Row>

          <Col span={24}>
            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập mã' }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Link to="/login" className={cls('forgot_password')}>
              <DoubleRightOutlined size={20} />
              Quay lại
            </Link>
          </Col>
          <Col span={24}>
            <Row justify={'center'} align={'middle'}>
              <Col span={12}>
                <Button type="primary" htmlType="submit" className="login-form-button" style={{ height: '50px' }}>
                  Gửi
                </Button>
              </Col>
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
};

export default ForgotPassword;
