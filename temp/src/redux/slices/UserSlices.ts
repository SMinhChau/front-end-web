import { createSlice } from "@reduxjs/toolkit";
import authAPI from "../apis/auth";
import tokenService from "../../services/token";

interface User {
    username: string;
    avatar: string;
    fullName: string;
    email: string;
    is_staff: boolean;
    is_superuser: boolean;
    role: "admin"|"teacher-v1"|"teacher-v2"
    major:string
}

interface StateType {
    user: User;
    error: boolean;
    is_login: boolean;
}

const initialState = {
    user: {
        username: "",
        avatar: "",
        fullName: "Nguyễn Thị Minh Châu",
        email: "",
        role:"teacher-v1",
        major: "Kỹ thuật phần mềm"
    },
    error: false,
    is_login: true,
} as StateType;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        //
    },
    extraReducers: (builder) => {
        builder.addCase(authAPI.login().fulfilled, (state, action) => {
            tokenService.setAccessToken(action.payload.access_token);
            tokenService.setRefreshToken(action.payload.refresh_token);
            state.error = false;
            state.is_login = true;
        });
        builder.addCase(authAPI.login().rejected, (state) => {
            state.is_login = false;
            state.error = true;
        });
    },
});
