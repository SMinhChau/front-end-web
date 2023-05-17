import axios, { AxiosRequestHeaders } from 'axios';
import tokenService from '../services/token';
import { ErrorCodeDefine, URL } from '../constant';

const axiosAuth = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

axiosAuth.interceptors.request.use(
  (config) => {
    const access_token = tokenService.getAccessToken();
    (config.headers as AxiosRequestHeaders).Authorization = 'Bearer ' + access_token;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;
    const status = error.response ? error.response.status : null;

    // Access Token was expired
    if (status === 422 && !config._retry) {
      config._retry = true;
      try {
        const refresh_token = tokenService.getRefreshToken();
        if (refresh_token) {
          const res = await axios({
            url: URL + '/lecturer/auth/Refresh-token',
            method: 'post',
            data: { refreshToken: refresh_token },
          });
          if (res.data.accessToken) {
            tokenService.setAccessToken(res.data.accessToken);
            tokenService.setRefreshToken(res.data.refreshToken);
          }
          return axiosAuth(config);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

const axiosNotAuth = axios.create();
axiosNotAuth.interceptors.request.use(
  (config) => {
    config.baseURL = URL;
    return config;
  },
  (error) => Promise.reject(error),
);

const axiosFormData = axios.create({
  baseURL: URL,
  headers: {
    'Content-type': 'multipart/form-data',
  },
});
axiosFormData.interceptors.response = axiosAuth.interceptors.response;

axiosFormData.interceptors.request.use(
  (config) => {
    const access_token = tokenService.getAccessToken();
    (config.headers as AxiosRequestHeaders).Authorization = 'Bearer ' + access_token;
    return config;
  },
  (error) => Promise.reject(error),
);

export { axiosAuth, axiosNotAuth, axiosFormData };
