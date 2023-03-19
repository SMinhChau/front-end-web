import React, { useState, useEffect } from "react";
import "./App.css";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";

import NoMatch from "./pages/404/NoMatch";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import Login from "./pages/login/Login";
import Semester from "./pages/semester/Semester";
import Teacher from "./pages/teacher/Teacher";
import Student from "./pages/student/Student";
import Evaludate from "./pages/evaluate/Evaludate";
import Major from "./pages/major/Major";
import tokenService from "./services/token";
import authAPI from "./redux/apis/auth";
import Topic from "./pages/topic/Topic";
import Home from "./pages/home/Home";

function App() {
    const userState = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (tokenService.getRefreshToken() && userState.user.username === "") {
            dispatch(authAPI.getInfo()());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userState]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route
                    path="/term"
                    element={
                        <PrivateRoute isLogin={userState.is_login}>
                            <Semester />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/teacher"
                    element={
                        <PrivateRoute isLogin={userState.is_login}>
                            <Teacher />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/major"
                    element={
                        <PrivateRoute isLogin={userState.is_login}>
                            <Major />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/student"
                    element={
                        <PrivateRoute isLogin={userState.is_login}>
                            <Student />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/evaluate"
                    element={
                        <PrivateRoute isLogin={userState.is_login}>
                            <Evaludate />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/topic"
                    element={
                        <PrivateRoute isLogin={userState.is_login}>
                            <Topic />
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Router>
    );
}

export const PrivateRoute = (props: {
    children: JSX.Element;
    isLogin: boolean;
}) => {
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if (!props.isLogin) {
            toast.info("Bạn vui lòng đăng nhập để sử dụng!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            const timeout = setTimeout(() => {
                setRedirect(true);
            }, 2500);

            return () => clearTimeout(timeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <ToastContainer />
            {props.isLogin
                ? props.children
                : redirect && <Navigate to="/login" />}
        </>
    );
};
export default App;
