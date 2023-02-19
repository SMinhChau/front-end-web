import { axiosNotAuth } from "../utils/axiosConfig";

class AuthService {
    login(data: { username: string; password: string }) {
        return axiosNotAuth({
            url: "/auth/login",
            method: "post",
            data,
        });
    }
}

const authService = new AuthService();
export default authService;
