import React, { useState, useEffect } from "react";
import './App.css'
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";

import NoMatch from "./pages/NoMatch";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import Login from "./pages/login/Login";
import Management from "./pages/management/Management";

function App() {
    const userState = useAppSelector((state) => state.user);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute isLogin={userState.is_login}>
                            <Management />
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
            toast.info("Bạn vụi lòng đăng nhập để sử dụng!", {
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
