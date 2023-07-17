import { configureStore } from '@reduxjs/toolkit';

import signupReducer from '../features/signups/signupSlice.js';
import loginReducer from '../features/login/loginSlice.js';
import musicFetchReducer from '../features/music/musicSlice.js'

//create reducer based on the part or item that needs to be displayed
export default configureStore({
   reducer: {
      userSignup: signupReducer,
      userLogin: loginReducer,
      music: musicFetchReducer
   },
})

//To use token for stay logged in until logged out
