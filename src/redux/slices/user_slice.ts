import { menusAdmin } from './../../constant/menu';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import authAPI from '../apis/auth';
import tokenService from '../../services/token';
import Teacher from '../../entities/teacher';
import { EnumRole, EnumGender, RoleCheck } from '../../enum';
import MenuItemType from '../../entities/menu';
import menus from '../../constant/menu';
import { log } from 'console';
import Notify, { TypeNotify } from 'src/entities/notify';
import { isBooleanObject } from 'util/types';

interface StateType {
  user: Teacher;
  functions: Array<MenuItemType>;
  error: boolean;
  is_login: boolean;
  update: boolean;
  allow: boolean;
  notify: Array<Notify>;
  admin: boolean;
  isRole: string;
  errorCheck: boolean;
}

const initialState = {
  user: {
    id: '',
    username: '',
    avatar: '',
    phoneNumber: '',
    name: '',
    email: '',
    role: EnumRole.LECTURER,
    majors: {
      id: 1,
    },
    isAdmin: false,
    gender: EnumGender.UNKNOW,
    degree: '',
  },
  error: false,
  functions: [] as any,
  is_login: tokenService.getRefreshToken() !== null,
  update: false,
  allow: true,
  notify: [] as Notify[],
  admin: false,
  isRole: EnumRole.LECTURER,
  errorCheck: false,
} as StateType;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAllow: (state, action) => {
      state.allow = action.payload;
    },
    setNotyfy: (state, action: PayloadAction<Array<Notify>>) => {
      state.notify = action.payload;
    },
    setLoginIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.admin = action.payload;
    },
    setChecked: (state, action: PayloadAction<string>) => {
      state.isRole = action.payload;
    },
    setLogin: (state, action: PayloadAction<boolean>) => {
      state.is_login = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authAPI.login().fulfilled, (state, action) => {
      tokenService.setAccessToken(action.payload.accessToken);
      tokenService.setRefreshToken(action.payload.refreshToken);

      state.user = action.payload.user;
      state.error = false;
      state.is_login = true;

      if (state.user.isAdmin === true && state.isRole === 'ADMIN') {
        state.functions = menusAdmin.ADMIN;
        state.errorCheck = true;
      } else {
        switch (state.user.role) {
          case EnumRole.HEAD_LECTURER:
            if (state.isRole === 'HEAD_LECTURER') {
              state.functions = menus.HEAD_LECTURER;
              state.errorCheck = true;
            } else {
              state.errorCheck = false;
            }
            break;

          case EnumRole.SUB_HEAD_LECTURER:
            if (state.isRole === 'SUB_HEAD_LECTURER') {
              state.functions = menus.SUB_HEAD_LECTURER;
              state.errorCheck = true;
            } else {
              state.errorCheck = false;
            }
            break;

          case EnumRole.LECTURER:
            if (state.isRole === 'LECTURER') {
              state.functions = menus.LECTURER;
              state.errorCheck = true;
            } else {
              state.errorCheck = false;
            }
            break;
          default:
        }
      }
    });
    builder.addCase(authAPI.login().rejected, (state) => {
      state.is_login = false;
      state.error = true;
    });

    builder.addCase(authAPI.getInfo().fulfilled, (state: StateType, action) => {
      state.user = action.payload;
      state.error = false;
      state.is_login = true;

      if (state.user.isAdmin === true) {
        state.functions = menusAdmin.ADMIN;
        state.errorCheck = true;
      } else {
        switch (state.user.role) {
          case EnumRole.HEAD_LECTURER:
            if (state.isRole === 'HEAD_LECTURER') {
              state.functions = menus.HEAD_LECTURER;
              state.errorCheck = true;
            } else {
              state.errorCheck = false;
            }
            break;

          case EnumRole.SUB_HEAD_LECTURER:
            if (state.isRole === 'SUB_HEAD_LECTURER') {
              state.functions = menus.SUB_HEAD_LECTURER;
              state.errorCheck = true;
            } else {
              state.errorCheck = false;
            }
            break;

          case EnumRole.LECTURER:
            if (state.isRole === 'LECTURER') {
              state.functions = menus.LECTURER;
              state.errorCheck = true;
            } else {
              state.errorCheck = false;
            }
            break;
          default:
        }
      }

      // if (state.user.isAdmin === false && state.admin === false) {
      //   state.functions = menus[state.user.role];
      // } else {
      //   if (state.admin === true && state.user.isAdmin === true) {
      //     state.functions = menusAdmin.ADMIN;
      //   } else {
      //     state.functions = menus[state.user.role];
      //   }
      // }
    });

    builder.addCase(authAPI.updateInfo().pending, (state) => {
      state.update = false;
      state.error = false;
    });
    builder.addCase(authAPI.updateInfo().fulfilled, (state, action) => {
      console.log(' action update ìno action', state);
      state.user = action.payload;
      state.update = true;
      state.error = false;
    });
    builder.addCase(authAPI.updateInfo().rejected, (state) => {
      state.update = false;
      state.error = true;
    });
  },
});

export const { setAllow, setNotyfy, setLoginIsAdmin, setChecked, setLogin } = userSlice.actions;
