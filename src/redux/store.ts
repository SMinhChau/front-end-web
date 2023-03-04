import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/user_slice";
import logger from "redux-logger";

const middlewares = [];

if (process.env.NODE_ENV === `development`) {
    middlewares.push(logger);
}

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([logger]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
