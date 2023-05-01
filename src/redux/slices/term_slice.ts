import { createSlice } from '@reduxjs/toolkit';

import termrAPI from '../apis/term';
import Term from '~/entities/term';
import { RootState } from '../store';

interface StateType {
  term: Term[];
  termIndex: Term;
  error: boolean;
  termSelected: number;
  is_loading: boolean;
}

const initialState = {
  termIndex: {
    id: NaN,
    key: NaN,
    createdAt: new Date(),
    dateDiscussion: new Date(),
    dateReport: new Date(),
    endDate: new Date(),
    endDateChooseTopic: new Date(),
    endDateSubmitTopic: new Date(),
    name: '',
    startDate: new Date(),
    startDateChooseTopic: new Date(),
    startDateSubmitTopic: new Date(),
    updatedAt: new Date(),
    startDateDiscussion: new Date(),
    endDateDiscussion: new Date(),
    startDateReport: new Date(),
    endDateReport: new Date(),
  },
  term: [
    {
      id: NaN,
      key: NaN,
      createdAt: new Date(),
      dateDiscussion: new Date(),
      dateReport: new Date(),
      endDate: new Date(),
      endDateChooseTopic: new Date(),
      endDateSubmitTopic: new Date(),
      name: '',
      startDate: new Date(),
      startDateChooseTopic: new Date(),
      startDateSubmitTopic: new Date(),
      updatedAt: new Date(),
      startDateDiscussion: new Date(),
      endDateDiscussion: new Date(),
      startDateReport: new Date(),
      endDateReport: new Date(),
    },
  ],

  is_loading: false,
  error: false,
  termSelected: NaN,
} as StateType;

export const TermSlices = createSlice({
  name: 'term',
  initialState,
  reducers: {
    setTermSlice: (state, action) => {
      console.log('setTermSlice', action);
      state.term = action.payload;
    },
    setTermIndex: (state, action) => {
      console.log('setTerm Index', action);
      state.termIndex = action.payload;
    },
    setTermSelected: (state, action) => {
      console.log('setTerm selected', action);
      state.termSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(termrAPI.getTermById().pending, (state) => {
      state.is_loading = true;
      state.error = false;
    });
    builder.addCase(termrAPI.getTermById().fulfilled, (state, action) => {
      state.is_loading = false;
      state.termIndex = action.payload;
      state.error = false;
    });
    builder.addCase(termrAPI.getTermById().rejected, (state) => {
      state.is_loading = false;
      state.error = true;
    });
  },
});

export const termListSelector = (state: RootState) => state.term.term;
export const termSelectedSelector = (state: RootState) => state.term.termSelected;

export const { setTermSlice, setTermSelected, setTermIndex } = TermSlices.actions;
