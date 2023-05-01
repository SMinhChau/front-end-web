import { createAsyncThunk } from '@reduxjs/toolkit';
import termService from '../../services/term';
import { log } from 'console';

class TermrAPI {
  getTerms() {
    return createAsyncThunk('term/get-term', async (majorsId: number, thunkAPI) => {
      try {
        const result = await termService.getTerm(majorsId);
        if (result.status === 200) return result.data;
      } catch (error) {
        console.log('createAsyncThunk Error!', error);
      }
    });
  }
  getTermById() {
    return createAsyncThunk('term/get-term-by-id', async (id: number, thunkAPI) => {
      try {
        const result = await termService.getTermById(id);
        if (result.status === 200) return result.data;
      } catch (error) {
        console.log('createAsyncThunk Error!', error);
      }
    });
  }
}

const termrAPI = new TermrAPI();

export default termrAPI;
