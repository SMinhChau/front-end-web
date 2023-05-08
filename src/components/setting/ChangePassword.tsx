import classNames from 'classnames/bind';
import style from './ChangePassword.module.scss';
import { Button, Col, Form, Image, Input, Row, Spin, Typography } from 'antd';
import { DoubleRightOutlined, LoadingOutlined } from '@ant-design/icons';

import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { checkString, showMessage, showMessageEror } from 'src/constant';
import authService from 'src/services/auth';
import { useState } from 'react';
const logo = '/assets/Logo_IUH.png';
const slide2 = '/assets/home/sl02.png';

const cls = classNames.bind(style);

const { Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ChangePassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const comparePass = (pass: string, confirm: string) => {
    return pass.toLocaleLowerCase().toString() === confirm.toLocaleLowerCase().toString();
  };

  const onFinish = (values: any) => {
    const check = checkString(values.oldPassword || values.newPassword || values.confirmPassword);
    if (check === true) {
      if (comparePass(values.newPassword, values.confirmPassword) === true) {
        setLoading(true);
        authService
          .changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword })
          .then(() => {
            setLoading(false);
            showMessage('Đã xập nhật mật khẩu', 5000);
          })
          .then(() => navigate('/user-info'))
          .catch(() => {
            setLoading(false);
            showMessageEror('Cập nhật mật khẩu thất bại', 5000);
          });
      } else {
        showMessageEror('Mã xác nhận chưa đúng!', 5000);
      }
    } else {
      showMessageEror('Mã không chứa ký tự đặt biệt', 5000);
    }
  };

  return (
    <div className={cls('container')}>
      <ToastContainer />
      <img src={slide2} alt="" className={cls('bg')} />
      <Row
        justify={'center'}
        style={{
          position: 'relative',
          top: '200px',
        }}
      >
        <Col
          span={7}
          style={{
            backgroundColor: 'white',
            paddingLeft: '20px',
            paddingRight: '20px',
            borderRadius: '10px',
            paddingTop: '20px',
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px',
          }}
        >
          <Spin indicator={antIcon} spinning={loading}>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              layout="horizontal"
              name="normal_login"
              className="login-form"
              size="large"
              onFinish={onFinish}
            >
              <img src={logo} alt="" style={{ width: '100px' }} />
              <Row style={{ marginBottom: '10px' }}>
                <Col>
                  <Text strong className={cls('title')}>
                    Thay đổi mật khẩu
                  </Text>
                </Col>
              </Row>

              <Form.Item label="Mật khẩu cũ" name="oldPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
              >
                <Input.Password />
              </Form.Item>

              <Row justify={'space-between'}>
                <Col>
                  <Link to="/user-info" className={cls('forgot_password')}>
                    <DoubleRightOutlined size={20} />
                    Quay lại
                  </Link>
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      Gửi
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default ChangePassword;
