import classNames from 'classnames/bind';
import style from './ForgotPassword.module.scss';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { DoubleRightOutlined, UserOutlined } from '@ant-design/icons';
import bgImg from "../../assets/home/sl02.png";
import logo from "../../assets/Logo_IUH.png";
import authService from '~/services/auth';
import { checkString, showMessage, showMessageEror } from '~/constant';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
const cls = classNames.bind(style);

const { Text } = Typography;

const ForgotPassword = () => {
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        const check = checkString(values.username)
        if (check === true) {
            authService.forgotPassword({ ...values, username: values.username }).then((result) => {
                showMessage('Đã gửi yêu cầu lấy lại mật khẩu. Vui lòng kiểm tra email', 5000)
                navigate('/login');
            }).catch((error) => {
                showMessageEror(error.response.data.error, 5000)
            })
        } else {
            showMessageEror('Mã không chứa ký tự đặt biệt', 5000)
        }
    };

    return (
        <div className={cls('container')}>
            <ToastContainer />
            <img src={bgImg} alt="" id="bg_login" className={cls("bg")} />
            <Row
                justify={'center'}
                style={{
                    position: 'relative',
                    top: '300px',
                }}
            >
                <Col span={7} style={{ backgroundColor: 'white', paddingLeft: '20px', paddingRight: '20px', borderRadius: '5px', paddingTop: '20px', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px' }}>
                    <Form name="normal_login" className="login-form" size="large" onFinish={onFinish}>
                        <img src={logo} alt="" style={{ width: '100px' }} />
                        <Row style={{ marginBottom: '10px' }}>
                            <Col> <Text strong type="secondary" className={cls('title')}>Mã Giảng Viên</Text></Col>
                        </Row>

                        <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập mã' }]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>

                        <Row justify={'space-between'}>
                            <Col> <Link to="/login" className={cls("forgot_password")}>
                                <DoubleRightOutlined size={20} />
                                Quay lại
                            </Link></Col>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Gửi
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default ForgotPassword;
