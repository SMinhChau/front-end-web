import { axiosFormData } from '../utils/axiosConfig';
import { axiosAuth, axiosNotAuth } from '../utils/axiosConfig';

class AuthService {
  login(data: { username: string; password: string }) {
    return axiosNotAuth({
      url: '/lecturer/auth/login',
      method: 'post',
      data,
    });
  }

  getInfo() {
    return axiosAuth({
      url: '/lecturer/me',
    });
  }

  updateInfo(data: FormData) {
    return axiosFormData({
      url: '/lecturer/me',
      method: 'put',
      data,
    });
  }

  forgotPassword(data: { username: string }) {
    return axiosNotAuth({
      url: '/lecturer/auth/send-mail-forgot-password',
      method: 'post',
      data,
    });
  }

  changePassword(data: { oldPassword: string; newPassword: string }) {
    return axiosAuth({
      url: '/lecturer/me/password',
      method: 'patch',
      data,
    });
  }
}

const authService = new AuthService();
export default authService;
