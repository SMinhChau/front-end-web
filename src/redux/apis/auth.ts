import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth';
import { log } from 'console';

class AuthAPI {
  login() {
    return createAsyncThunk('user/login', async (data: { username: string; password: string }, thunkAPI) => {
      const result = await authService.login(data);
      if (result.status === 200) return result.data;
      return thunkAPI.rejectWithValue('login fail');
    });
  }
  getInfo() {
    return createAsyncThunk('user/get-info', async (thunkAPI) => {
      try {
        const result = await authService.getInfo();

        if (result.status === 200) {
          console.log('result', result);
          return result.data;
        }
      } catch (error) {
        console.log('er', error);
      }
    });
  }
  updateInfo() {
    return createAsyncThunk('user/update-info', async (data: FormData, thunkAPI) => {
      try {
        const result = await authService.updateInfo(data);

        if (result.status === 200) return result.data;
      } catch (error) {
        console.log('eror', error);
      }
    });
  }
}

const authAPI = new AuthAPI();

export default authAPI;
