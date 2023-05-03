import { useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Register.module.scss";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { EnumRole } from "src/enum";

const cls = classNames.bind(style);

const Register = () => {
    const userState = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        if (![EnumRole.ADMIN, EnumRole.HEAD_LECTURER].includes(userState.user.role)) {
            toast.info("Người dùng không có quyền tạo tài khoản", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cls("register")}>
            <ToastContainer />
            <div></div>
        </div>
    );
};

export default Register;
