import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUsernameSignup } from '../features/signups/signupSlice';
import { clearUsernameLogin } from '../features/login/loginSlice';
import Login from '../features/login/Login';

import { useRemoveCookie } from '../utilities/cookieAccess.js';

const Logout = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   // remove the cookie so that it will not automatically login in when intentionally logged out.
   useRemoveCookie('token'); //This keeps the user loggedin

   useEffect(()=>{
      //clear all state username
      dispatch(clearUsernameSignup());
      dispatch(clearUsernameLogin());
      navigate('/login?logout=success')

   },[])

   return(
      <>
         <p>Logout Page</p>
      </>
   )
}
export default Logout;