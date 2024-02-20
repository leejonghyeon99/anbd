import { createSlice, configureStore } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    // 다른 공통 상태 필드들도 추가 가능
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // 다른 액션 처리 로직 추가 가능
  },
});

export const { setUser } = userSlice.actions;

const userReducer = userSlice.reducer;

const userStore = configureStore({
  reducer: {
    user: userReducer,
    // 다른 리듀서 추가 가능
  },
});

export default userStore;
