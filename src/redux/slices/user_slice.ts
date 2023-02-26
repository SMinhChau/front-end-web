import { createSlice } from "@reduxjs/toolkit";
import authAPI from "../apis/auth";
import tokenService from "../../services/token";
import Teacher from "~/entities/teacher";

interface StateType {
    user: Teacher;
    error: boolean;
    is_login: boolean;
}

const initialState = {
    user: {
        id: "",
        username: "",
        avatar: "",
        phoneNumber: "",
        name: "",
        email: "",
        role: "admin",
        majors: {
            id: 1,
        },
        gender: "",
        degree: "",
    },
    error: false,
    is_login: tokenService.getRefreshToken() !== null,
} as StateType;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        //
    },
    extraReducers: (builder) => {
        builder.addCase(authAPI.login().fulfilled, (state, action) => {
            tokenService.setAccessToken(action.payload.accessToken);
            tokenService.setRefreshToken(action.payload.refreshToken);

            state.user = action.payload.user;
            state.error = false;
            state.is_login = true;
        });
        builder.addCase(authAPI.login().rejected, (state) => {
            state.is_login = false;
            state.error = true;
        });

        builder.addCase(
            authAPI.getInfo().fulfilled,
            (state: StateType, action) => {
                state.user = action.payload;
                state.error = false;
                state.is_login = true;
            }
        );
    },
});
