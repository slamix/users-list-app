import { createSlice } from '@reduxjs/toolkit';

interface ModalsSliceState {
  createModalStatus: boolean;
  deleteModalStatus: boolean;
  editModalStatus: boolean;
}

const initialState: ModalsSliceState = {
  createModalStatus: false,
  deleteModalStatus: false,
  editModalStatus: false,
}

const modalsSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCreateModal: (state, { payload }) => {
      state.createModalStatus = payload;
    },
    setDeleteModal: (state, { payload }) => {
      state.deleteModalStatus = payload;
    },
    setEditModal: (state, { payload }) => {
      state.editModalStatus = payload;
    },
  }
});

export const { setCreateModal, setDeleteModal, setEditModal } = modalsSlice.actions;

export default modalsSlice.reducer;
