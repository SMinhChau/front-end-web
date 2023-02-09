class TokenService {
    getAccessToken() {
        return localStorage.getItem("access_token");
    }
    setAccessToken(token: string) {
        localStorage.setItem("access_token", token);
    }

    getRefreshToken() {
        return localStorage.getItem("refresh_token");
    }

    setRefreshToken(token: string) {
        return localStorage.setItem("refresh_token", token);
    }

    reset() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
}

const tokenService = new TokenService();
export default tokenService;
