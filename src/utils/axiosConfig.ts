import axios, { AxiosRequestHeaders } from "axios";
import tokenService from "../services/token";
import { URL } from "~/constant";

const axiosAuth = axios.create({
    baseURL: URL,
    headers: {
        "Content-type": "application/json",
    },
});

axiosAuth.interceptors.request.use(
    (config) => {
        const access_token = tokenService.getAccessToken();
        (config.headers as AxiosRequestHeaders).Authorization =
            "Bearer " + access_token;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosAuth.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const config = error.config;
        // Access Token was expired
        if (error.response && error.response.status === 401 && !config._retry) {
            config._retry = true;
            try {
                const refresh_token = tokenService.getRefreshToken();
                if (refresh_token) {
                    const res = await axios({
                        url: URL + "/auth/Refresh-token",
                        method: "post",
                        data: {
                            refreshToken: tokenService.getRefreshToken()
                        },
                    });
                    if (res.data.access_token) {
                        tokenService.setAccessToken(res.data.access_token);
                        tokenService.setRefreshToken(res.data.refresh_token);
                    }
                    return axiosAuth(config);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

const axiosNotAuth = axios.create();
axiosNotAuth.interceptors.request.use(
    (config) => {
        config.baseURL = URL;
        return config;
    },
    (error) => Promise.reject(error)
);

export { axiosAuth, axiosNotAuth };