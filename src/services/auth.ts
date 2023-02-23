import { axiosAuth, axiosNotAuth } from "../utils/axiosConfig";

class AuthService {
    login(data: { username: string; password: string }) {
        return axiosNotAuth({
            url: "/lecturer/auth/login",
            method: "post",
            data,
        });
    }

    getInfo(){
        return axiosAuth({
            url: '/lecturer/me'
        })
    }
}

const authService = new AuthService();
export default authService;
