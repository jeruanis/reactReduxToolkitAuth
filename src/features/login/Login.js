import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
import axios from '../../api/axios';
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Row, Button, Navbar, Nav} from 'react-bootstrap';
import CompanyIcon from '../../images/companyicon.png';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from "react-google-recaptcha";
import jwt_decode from 'jwt-decode';

import { useGetTokenCookie, useSetTokenCookie } from '../../utilities/cookieAccess.js';

import {
   userLoginGoogleAaction,
   selectCurrentUser,
   signUpIsLoading,
   signupHasError } from '../signups/signupSlice.js'

import { 
   selectCurrentUserLogin,
   loginIsLoading,
   loginHasError,
   clearLoginRequired
} from './loginSlice.js'

import { userLoginAaction } from './loginSlice.js'

const Login = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const location = useLocation()

   // CREATE REFERENCE TO GET THE DOM CURRENT VALUES
   const emailRef = useRef('') //initial value is needed for useEffect parameter
   const passwordRef = useRef('') //initial value is needed for useEffect parameter
   const errRef = useRef('') 
   const recaptchaRef = useRef()

   const [ emailFocus, setEmailFocus ] = useState();
   const [ email, setEmail ] = useState();
   const [ validEmail , setValidEmail ] = useState();

   const [ passwordFocus, setPasswordFocus ] = useState();
   const [ password, setPassword ] = useState();
   const [ validPassword, setValidPassword ] = useState();

   const [errMsg, setErrMsg] = useState('')
   const [recaptchaVerified, setRecaptchaVerified] = useState();

   const loginLoading = useSelector(loginIsLoading);
   const hasErrorLoading = useSelector(loginHasError);

   const isSignUpLoading = useSelector(signUpIsLoading);
   const isSignUpHasError = useSelector(signupHasError)

   const isLoginIsLoading = useSelector(loginIsLoading);
   const isLoginHasError = useSelector(loginHasError);

   const bodyStyleLogin={
      backgroundColor:'linear-gradient(45deg, #20bf6b, #0088cc, #ebf8e1 70%, #f89406, white)',
      backgroundRepeat :'no-repeat',
      backgroundSize : 'cover'
   }
  
   //body background
  useEffect(()=>{
      document.body.style.background = bodyStyleLogin.backgroundColor;
   }, [bodyStyleLogin.backgroundColor])

   // check the presence of cookie in the local machine using getTokenCookie
   const localTokenCookie = useGetTokenCookie('token');

   //check if there is cookie in the signup storage
   const signupUserData = useSelector(selectCurrentUser);

   //Inquire from login State if data are available
   const loginUserData = useSelector(selectCurrentUserLogin)
   console.log('loginUserData:', loginUserData)
   
   //In LOGIN IS WHERE ALL THE SAVING OF cookie is done
   const existingTokenCookie = loginUserData?.token ? loginUserData.token : localTokenCookie ? localTokenCookie : signupUserData?.token ? signupUserData.token: '';

   //set token cooke using token value for 30 days
   useSetTokenCookie({name:'token', value: existingTokenCookie, expirationDays:365 });

   // make useEffect to trigger the redirection which is the advisable
   //changing state outside of the useEffect triggers Too many re-renders error
   useEffect(()=>{

      //if the signup storage is not undefined it means that 
      if (loginUserData) {

         //IF THERe IS loginrequired IN THE LOGIN STORE, REMOVE IT. This is when there is no token present in local machine
         if(loginUserData.hasOwnProperty('loginrequired'))
               dispatch(clearLoginRequired())

         //IF SIGNUPRESULT IS USING GOOGLE REDIRECT TO HOME
         if(loginUserData.hasOwnProperty('google')){
            navigate('/home')
         }

         //go to login page if gologin is present means it just came from signing up
         if(loginUserData.hasOwnProperty('username') && loginUserData.hasOwnProperty('imageUrl')){
            navigate('/home')
         }
      } 

   },[loginUserData, dispatch])


   function onChange(value) {
      console.log("Captcha value:", value);
      setRecaptchaVerified(true);
    }


   useEffect(() => {
      console.log('recaptchaVerified:', recaptchaVerified);
   },[recaptchaVerified])


   //  reset recaptcha verified to avoid a runtime error
    useEffect(() => {
      // Timer to reset recaptchaVerified after 5 seconds
      const timer = setTimeout(() => {
        setRecaptchaVerified(false);
      }, 5000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [recaptchaVerified]);


    //update email
    useEffect(()=>{
      if(emailRef.current.value){
         setEmail(emailRef.current.value)
         setValidEmail(true)
      }else{
         setValidEmail(false)
      }

    },[email, emailRef])

    //update password
    useEffect(()=>{
      if(passwordRef.current.value)
         setValidPassword(true)
      else 
         setValidPassword(false)
    },[password, passwordRef])


   //  LOGIN USING USERNAME FOR USER TO KNOW HIS USERNAME 
   useEffect(()=>{
      console.log('inside 1')
      if(signupUserData){
         
         //check if google signin
         if(signupUserData.hasOwnProperty('google')){ 
            //redirect to the home
            navigate('/home') //=> at home the navbar will fetch the name and imageUrl
         } 

         else if( signupUserData.hasOwnProperty('username')){
            console.log('inside2')
            //update the email
            setEmail(signupUserData.username);  
         }
        
      }  
   }, [signupUserData]) 


   // SEND THE EXISTING COOKIE TO CHECK IF IT IS EXPIRED OR NOT
   const tokenCookie = useGetTokenCookie('token'); 

   //dispatch teh action to verify valid user
   const submitHandler = async (e) => {
      //prevent the page from refreshing or going to default url localhost:3000
      e.preventDefault();
      dispatch(userLoginAaction({email, password, tokenCookie}))
   }

   // GOOGLE OAUTH2.0
   
   function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      const userObject = jwt_decode(response.credential);
      console.log(userObject)

      const uniqID = userObject.sub; 
      const givenName = userObject.given_name;
      const familyName =  userObject.family_name; 
      const imageUrl =  userObject.picture; 
      const email = userObject.email;

      console.log(uniqID, givenName, familyName, imageUrl, email)
      dispatch(userLoginGoogleAaction({uniqID, givenName, familyName, imageUrl, email, tokenCookie}))

   }

   /* global google */
   useEffect(() => {

         if(google && google.accounts && google.accounts.id){ //check first before initialization
            google.accounts.id.initialize({
            client_id: "exampleclientidhere37429347923749237.apps.googleusercontent.com",
            callback: handleCredentialResponse
            });
         } else {
            console.log('google is not defined.')
         }
      //google.accounts.id.prompt();
   }, [google]); //to activate after when logout 
   
   useEffect(() => {
      if(google && google.accounts && google.accounts.id){
         google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
         theme: "outline",
         size: "medium"
         });
      } else {
         console.log('google is not defined.')
      }
   }, [google]);

// GOOGLE OAUTH2.0 END

   // console.log('!validEmail:', !validEmail) 
   // console.log('!validPassword:', !validPassword)
   // console.log('!recaptchaVerified:', !recaptchaVerified)

   useEffect(()=>{
      if(hasErrorLoading) setErrMsg('Error');
   },[])

   //check the occurrence of error
   if(isLoginHasError) return (
      <div className="full-page-container">
         <div className="centered-content">
            <div>Error occurred when logging in, Location: login...</div>
         </div>
      </div>
    )

   //show loading status
   //make the app pending until data arrived then redirected to home
   if(isLoginIsLoading) return (
      <div className="full-page-container">
         <div className="centered-content">
            <div>Loading home page...</div>
         </div>
      </div>
   )

   
   //show when error occurred in google OAuth.
   if(isSignUpHasError) return (
      <div className="full-page-container">
         <div className="centered-content">
            <div>Error occurred in logging in...</div>
         </div>
      </div>
   )

   // // for google signin 
   if(isSignUpLoading) return (
      <div className="full-page-container">
         <div className="centered-content">
            <div>Loading home page...</div>
         </div>
      </div>
   )


   return (
      <div className="full-page-container">
         <div className="centered-content">
         <main>
            <Container className='py-5'>
               <Row className=''>
                  <div className="login_box d-flex justify-content-center align-items-center">
                     <div id="first">
                        {/* set error message at the top of the login form */}
                        <section>
                           <p ref={errRef} className={ errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                        </section>
                        <div className="d-flex justify-content-center mb-3">
                           <Nav.Link as={Link} to={"/home"}><img src={ CompanyIcon } alt="Invoice logo"/></Nav.Link>
                        </div>
         
                        <form action="" method="POST" id="logForm" onSubmit={submitHandler} >
                           <div className="mb-4 d-flex justify-content-start border-0 border-bottom" >
                              <i className='far fa-user d-flex align-self-center'></i>
                              <input className="border-bottom w-100"
                                 type='text'
                                 id='email' 
                                 placeholder='Username or Email' 
                                 value={email}
                                 ref={emailRef} 
                                 autoComplete="off"
                                 spellCheck="false" 
                                 onChange={(e)=>setEmail(e.target.value)} 
                                 aria-invalid={validEmail ? "false" : "true"} 
                                 aria-describedby="logEmail"
                                 onFocus={()=>setEmailFocus(true)} 
                                 onBlur={()=>setEmailFocus(false)} 
                                 />
                           </div>

                           <div className="d-flex justify-content-start border-0 border-bottom">
                                 <i className="fas fa-lock d-flex align-self-center"></i>
                                 <input className="border-bottom w-100"
                                    type="password" 
                                    id="password" 
                                    ref={passwordRef} 
                                    autoComplete="off"
                                    spellCheck="false" 
                                    onChange={(e)=>setPassword(e.target.value)} 
                                    aria-invalid={validPassword ? "false" : "true"} 
                                    aria-describedby="password"
                                    onFocus={()=>setPasswordFocus(true)} 
                                    onBlur={()=>setPasswordFocus(false)} />
                           </div>

                           <div className="mb-5">
                                 <small><a className="mt-2 float-left" href="reset-password?sendemail-linkforpassword">Forgot Password?</a></small>
                           </div>
                  
                           <div className="d-flex justify-content-center mb-3">
                              <ReCAPTCHA
                                 sitekey="YOUR SITE KEY HERE"
                                 onChange={onChange}
                                 ref={recaptchaRef}
                              />                              
                           </div>

                           {/* <Button variant="info" className="btn form-control" type="text" name="login_button">Login</Button> */}

                           <Button type="submit" variant="warning" className="form-control" disabled={!validEmail || !validPassword || !recaptchaVerified ? true : false }>Login</Button>

                           <div id="Signup" style={{border: "none"}} className="mt-3"> 
                              <span>Not yet a member?&nbsp;</span>
                              <Link to={'/signup'} className="signup">Sign up</Link>
                           </div>
                        </form>

                        {/* <!-- or --> */}
                        <div className="or-container">
                        <span className="or-line"></span>
                        <span className="or-text">or</span>
                        <span className="or-line"></span>
                        </div>

                        {/* capcha */}
                        <div className="d-flex justify-content-center">
                           <div id="buttonDiv"></div> 
                        </div>

                     </div> 
                  </div>
               </Row>
            </Container>
         </main>
      </div></div>
   )
} 
export default Login;


