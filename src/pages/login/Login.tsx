import { FormEvent, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import classNames from "classnames/bind";
import style from "./Login.module.scss";
import { Link } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import authAPI from "~/redux/apis/auth";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/Logo_IUH.png'
import bgImg from '../../assets/bg.webp'

const cls = classNames.bind(style);

function Login() {
    const userState = useAppSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    const login = (e: FormEvent) => {
        e.preventDefault();
        console.table({username, password})
        
        dispatch(authAPI.login()({ username, password }));
    };

    useEffect(() => {
        if (userState.is_login) {
            navigate(-1);
        } else {
            if (userState.error) {
                toast.info("Thông tin đăng nhập không chính xác", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userState]);

    return (
        <div className={cls("login_container")}>
            <ToastContainer />
            <img src={bgImg} alt="" id="bg_login" className={cls("bg")} />

            <form action="" onSubmit={login}>
                <img src={logo} alt="" />
                <div className={cls("form_header")}>Đăng nhập</div>
                <div className={cls("form_group")}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Mã giảng viên"
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className={cls("form_group")}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Mật khẩu"
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {showPassword ? (
                        <EyeInvisibleOutlined
                            onClick={() => setShowPassword((prev) => !prev)}
                        />
                    ) : (
                        <EyeOutlined
                            onClick={() => setShowPassword((prev) => !prev)}
                        />
                    )}
                </div>
                <Link to="/forgot-password" className={cls("forgot_password")}>
                    Quên mật khẩu
                </Link>
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
}

export default Login;
