import React, { useEffect } from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import axios from '../../api/axios';


//create an asynchronous action creators to communicate to the database
export const userLoginAaction = createAsyncThunk(
   'user/userlogin', async ({email, password, tokenCookie})=> {

      //using axios give more debugging hint than using fetch
      const response = await axios.post(`userlogin/login_handlerLogout`,  {email, password, tokenCookie}, {
         headers: {'Content-Type': 'application/json'}
      }); 

      console.log('response:', response) //Output:  data:{status: 200, username: 'joheh2'}
      try{ 
         if (response.status === 200) {
            try{
               const data = await response.data;
               console.log('data:', data)
               return data;
            }catch (error){ // this is if there was an internal error like email existing
               const errorList = ['User does not exist.', 'There was an error: Invalid Type'];
               if(errorList.includes(response.data)){
                  const err = await response.data;
                  console.log('err:', err)
                  return err
               }
            }

         } else {
            console.log('Request failed with status:', response.status);
            throw new Error('Request failed');
         }

      }catch(error){
         console.log('There was an error:', error);
         // throw error; // Throw the error to trigger the rejected case
         throw new Error('There was an error: ', error);
       }
          
   }
)

export const userKeepLoginAaction = createAsyncThunk(
   'user/userloginkeep', async (tokenCookie) => {
      const response = await axios.post(`userlogin/login_handlerLogout/keep`, {tokenCookie}, {
         headers: {'Content-Type': 'application/json'}
      });

      console.log('response keep;', response);
      
      try{
         if(response.status === 200){
            try{
               const data = await response.data;
               console.log('data:', data)
               return data;
            }catch(error){
               const err = await response.data;
               console.log('err:', err)
               return err
            }
         }else{
            console.log('Request failed with status:', response.status);
            throw new Error('Request failed');
         }

      }catch(error){
         console.log('There was an error:', error);
         // throw error; // Throw the error to trigger the rejected case
         throw new Error('There was an error: ', error);
      }
   }
)




export const loginSlice = createSlice({
   name: 'userLogin',
   initialState: {
      userData: undefined,
      isLoading: false,
      hasError: false
   },
   reducers: { 
      setUsernameLogin: (state, action) => {
        state.userData = action.payload;
      },
      clearUsernameLogin: (state) => {
        state.userData = undefined;
      },
      clearLoginRequired: (state) => {
         // Delete the 'loginrequired' property from the 'userData' object
         delete state.userData.loginrequired;
      }
   },
   extraReducers: (builder) => {
      builder
      .addCase(userLoginAaction.pending, (state)=>{
         state.isLoading = true;
         state.hasError = false;
      })
      .addCase(userLoginAaction.fulfilled, (state, action)=> {
         state.userData = action.payload;
         state.isLoading = false;
         state.hasError = false;
      })
      .addCase(userLoginAaction.rejected, (state)=>{
         state.isLoading=false;
         state.hasError=true;
         state.userData=undefined;
      })
      .addCase(userKeepLoginAaction.pending, (state)=>{
         state.isLoading=true;
         state.hasError=false;
      })
      .addCase(userKeepLoginAaction.fulfilled, (state, action)=>{
         state.userData=action.payload; 
         state.isLoading=false;
         state.hasError=false;
      })
      .addCase(userKeepLoginAaction.rejected, (state, action)=>{
         state.isLoading=false;
         state.hasError=action.error.message;
         state.hasError=true;
         state.userData=undefined;
      })
   }

})

//import these 3 in component
export const selectCurrentUserLogin = (state) => state.userLogin.userData;
export const loginIsLoading = (state) => state.userLogin.isLoading;
export const loginHasError = state => state.userLogin.hasError;
// export const loginError = state => state.userLogin.error;

export const { setUsernameLogin, clearUsernameLogin, clearLoginRequired } = loginSlice.actions;

//import this in store
export default loginSlice.reducer;
