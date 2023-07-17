import React from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import axios from '../../api/axios';


//create asynchronous action creators to communicate to the database

export const userSignupAaction = createAsyncThunk(
   'user/userSignup/:', async ({name, lastName, email, confirmEmail, pwd, matchPwd})=> {
       //construct a request axios can also be used here
      const response = await axios.post(`userlogin/register_handler`, {name, lastName, email, confirmEmail, pwd, matchPwd}, {
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
                  const err = await response.data;
                  console.log('err:', err)
                  return err
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

export const userLoginGoogleAaction = createAsyncThunk(
   'user/userLoginGoogle', async ({uniqID, givenName, familyName, imageUrl, email, tokenCookie}) => {
      const response = await axios.post(`userlogin/register_handler`,  {uniqID, givenName, familyName, imageUrl, email, tokenCookie}, {
      headers: {'Content-Type': 'application/json'}
      }); 

      console.log('response:', response) //Output:  data:{status: 200, username: 'joheh2'}
        // will goto login since it is called in login page
         try{ 
            if (response.status === 200) {
               try{
                  const data = await response.data;
                  console.log('data:', data)
                  return data;
               }catch (error){ // this is if there was an internal error like email existing
                  const err = await response.data;
                  console.log('err:', err)
                  return err
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

export const capchaCheckAaction = createAsyncThunk(
   'user/capchaCheck', async ()=>{
      const getToken  = 'test'
      try{
         try{
            const resultToken = await getToken.json()
            console.log('result Token json:', resultToken)
            return resultToken;
         }catch (error){
            const resultToken  = await getToken.text()
            console.log('resule Token text:', resultToken)
            return resultToken
         }
      } catch (error) {
         console.log('There was an Error:', error)
         throw new Error('There was an error: ', error);
      }    
   }
)

//saving username
export const signupSlice = createSlice({
   name: 'userSignup',
   initialState: {
      userData: undefined,
      isLoading: false,
      hasError: false,
      token:'',
      isLoadingToken:false,
      hasErrorToken:false
   },
   reducers:{
      clearUsernameSignup: (state) => {
         state.userData = undefined;
       }
   },
   extraReducers: (builder) => {
      builder
      .addCase(userSignupAaction.pending, (state)=>{
         state.isLoading = true;
         state.hasError = false;
      })
      .addCase(userSignupAaction.fulfilled, (state, action)=> {
         state.userData = action.payload;
         state.isLoading = false;
         state.hasError = false;
      })
      .addCase(userSignupAaction.rejected, (state)=>{
         state.isLoading=false;
         state.hasError=true;
         state.userData=undefined
      })
      .addCase(capchaCheckAaction.pending, (state) =>{
         state.isLoadingToken = true;
         state.hasErrorToken = false;
      })
      .addCase(capchaCheckAaction.fulfilled, (state, action) => {
         state.token = action.payload; //adding the response to the initial state
         state.isLoadingToken = true;
         state.hasErrorToken = false;
      })
      .addCase(capchaCheckAaction.rejected, (state)=>{
         state.isLoadingToken = false;
         state.hasErrorToken = true;
      })
      .addCase(userLoginGoogleAaction.pending, (state)=>{
         state.isLoadingLoginGoogle = true;
         state.hasErrorLoadingLoginGoogle = false;
      })
      .addCase(userLoginGoogleAaction.fulfilled, (state, action)=>{
         state.userData = action.payload;
         state.isLoadingLoginGoogle = false;
         state.hasErrorLoadingLoginGoogle = false;
      })
      .addCase(userLoginGoogleAaction.rejected, (state)=>{
         state.isLoadingLoginGoogle = false;
         state.hasErrorLoadingLoginGoogle = true;
      })
   }

})

//import these 3 in component
export const selectCurrentUser = (state) => state.userSignup.userData;
export const signUpIsLoading = (state) => state.userSignup.isLoading;
export const signupHasError = state => state.userSignup.hasError;

export const { clearUsernameSignup } = signupSlice.actions;

//import for capchaCheckAaction 
export const selectCapcha = (state) => state.userSignup.token;
export const capchaIsLoading = (state) => state.userSignup.isLoadingToken;
//import these 1 in store
export default signupSlice.reducer;
