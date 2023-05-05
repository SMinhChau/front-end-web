import { createSlice } from '@reduxjs/toolkit';
import authAPI from '../apis/auth';
import tokenService from '../../services/token';
import Teacher from '../../entities/teacher';
import { EnumRole, EnumGender } from '../../enum';
import MenuItemType from '../../entities/menu';
import menus from '../../constant/menu';
import { log } from 'console';

interface StateType {
  user: Teacher;
  functions: Array<MenuItemType>;
  error: boolean;
  is_login: boolean;
  update: boolean;
  allow: boolean;
}

const initialState = {
  user: {
    id: '',
    username: '',
    avatar: '',
    phoneNumber: '',
    name: '',
    email: '',
    role: EnumRole.ADMIN,
    majors: {
      id: 1,
    },
    gender: EnumGender.UNKNOW,
    degree: '',
  },
  error: false,
  functions: [] as any,
  is_login: tokenService.getRefreshToken() !== null,
  update: false,
  allow: false,
} as StateType;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAllow: (state, action) => {
      console.log('-> setAllow', action);
      state.allow = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authAPI.login().fulfilled, (state, action) => {
      tokenService.setAccessToken(action.payload.accessToken);
      tokenService.setRefreshToken(action.payload.refreshToken);

      state.user = action.payload.user;
      state.error = false;
      state.is_login = true;
      const my_menu = menus[state.user.role];
      if (state.user.isAdmin) {
        for (const i of menus[EnumRole.ADMIN])
          if (!my_menu.map((value) => value.url).includes(i.url)) {
            my_menu.push(i);
          }
      }
      state.functions = my_menu;
    });
    builder.addCase(authAPI.login().rejected, (state) => {
      state.is_login = false;
      state.error = true;
    });

    builder.addCase(authAPI.getInfo().fulfilled, (state: StateType, action) => {
      state.user = action.payload;
      state.error = false;
      state.is_login = true;

      const my_menu = menus[state.user.role];
      if (state.user.isAdmin) {
        for (const i of menus[EnumRole.ADMIN])
          if (!my_menu.map((value: any) => value.url).includes(i.url)) {
            my_menu.push(i);
          }
      }
      state.functions = my_menu;
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

export const { setAllow } = userSlice.actions;
