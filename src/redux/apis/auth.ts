import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth";

class AuthAPI {
    login() {
        return createAsyncThunk(
            "user/login",
            async (data: { username: string; password: string }, thunkAPI) => {
                const result = await authService.login(data);
                if (result.status === 200) return result.data;
                return thunkAPI.rejectWithValue("login fail");
            }
        );
    }
}

const authAPI = new AuthAPI();

export default authAPI;
