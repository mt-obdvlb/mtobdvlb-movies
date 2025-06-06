import {createSlice} from '@reduxjs/toolkit';


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')!)
      : null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem('expiration', expirationTime.toString());
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    }
  }
})

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;