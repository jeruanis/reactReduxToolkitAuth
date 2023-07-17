import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Row, Button, Navbar, Nav} from 'react-bootstrap';
import CompanyIcon from '../../images/companyicon.png';
import ReCAPTCHA from "react-google-recaptcha";
import { faDatabase } from '@fortawesome/free-solid-svg-icons';

import { useSetTokenCookie, useGetTokenCookie } from '../../utilities/cookieAccess.js';

import { selectCurrentUserLogin } from '../login/loginSlice';
import {
   selectCurrentUser, 
   signUpIsLoading, 
   signupHasError,
   userSignupAaction } from './signupSlice.js'



//DEFINE VALIDATION 
const NAMELASTNAME_REGEX = /^[A-Za-z\s]{2,25}$/;
const EMAIL_REGEX =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/; //min 2char@5char
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,30}$/;
const bodyStyle={
   backgroundColor:'linear-gradient(45deg, #20bf6b, #0088cc, #ebf8e1 70%, #f89406, white)',
   backgroundSize: 'cover',
   backgroundRepeat: 'no-repeat',
   height:'100vh'
}


const Signup = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   
   //create reference
   const nameRef = useRef('');
   const lastNameRef = useRef();
   const emailRef = useRef();
   const matchEmailRef = useRef();
   const pwdRef = useRef();
   const matchPwdRef = useRef();
   const errRef = useRef();
   const fnamesp=useRef()
   const lnamesp=useRef()
   const emailsp=useRef('') //default as useEffect parameter needs it
   const email2sp=useRef('') //default as useEffect parameter needs it
   const passwordsp=useRef()
   const password2sp=useRef()
   const recaptchaRef = useRef()

   const [name, setName] = useState();
   const [validName, setValidName] = useState();
   const [nameFocus, setNameFocus] = useState();

   const [lastName, setLastName] = useState();
   const [validLastName, setValidLastName] = useState();
   const [lastNameFocus, setLastNameFocus] = useState();

   const [email, setEmail] = useState();
   const [validEmail, setValidEmail] = useState();
   const [emailFocus, setEmailFocus] = useState();

   const [confirmEmail, setConfirmEmail] = useState();
   const [validConfirmEmail, setValidConfirmEmail] = useState();
   const [confirmEmailFocus, setConfirmEmailFocus] = useState();

   const [pwd, setPwd] = useState();
   const [validPwd, setValidPwd] = useState();
   const [pwdFocus, setPwdFocus] = useState();

   const [matchPwd, setMatchPwd] = useState();
   const [validMatchPwd, setValidMatchPwd] = useState();
   const [matchPwdFocus, setMatchPwdFocus] = useState();

   const [errMsg, setErrMsg] = useState('')
   const [success, setSuccess] = useState();
   const [username, setUsername] = useState()
   const [recaptchaVerified, setRecaptchaVerified] = useState()

   //when the component loads set the focus which will happen only once since it has empty array. The ref object has a .current property that can be used to access the underlying DOM element. In this case setting focus in user input.

   const isSignUpLoading = useSelector(signUpIsLoading);
   const isSignUpHasError = useSelector(signupHasError)

   //Inquire from login State if data are available
   const loginUserData = useSelector(selectCurrentUserLogin)

   useEffect(()=>{

      if (loginUserData) {

         //IF SIGNUPRESULT IS USING GOOGLE REDIRECT TO HOME
         if(loginUserData.hasOwnProperty('google')){
            navigate('/home')
         }

         //go to login page if gologin is present means it just came from signing up
         if(loginUserData.hasOwnProperty('username') && loginUserData.hasOwnProperty('imageUrl')){
            navigate('/home')
         }
         } 

   },[loginUserData])


   //FOCUS ON nameRef()
   useEffect(()=> {
      if(nameRef.curent)
         nameRef.current.focus();
   }, [])


   //name checking
   useEffect(() => {
      //teSt if matching pattern true or false
      const result = NAMELASTNAME_REGEX.test(name);
      console.log(result, name, 'name');
      //save the result to validName
      setValidName(result)
      //showig error if invalid and once it is clicked
      if(fnamesp.current)
         fnamesp.current.textContent = nameFocus && !validName ? 
         'Only letters and space allowed and 2 to 25 characters only' : nameFocus===false && !validName ?  'Only letters and space allowed and 2 to 25 characters only' : '';

   }, [name, validName, nameFocus])

   //lastname checking
   useEffect(() => {
      //test for matching pattern
      const result = NAMELASTNAME_REGEX.test(lastName);
      console.log(result, lastName, 'lastName');
      //save the result to validName
      setValidLastName(result);
      if(lnamesp.current)
         lnamesp.current.textContent = lastNameFocus && !validLastName ? 'Only letters and space allowed and 2 to 25 characters only' : lastNameFocus===false && !validLastName ? 'Only letters and space allowed and 2 to 25 characters only' : '';
  
   }, [lastName, validLastName, lastNameFocus])

   //email checking
   useEffect(()=>{
      const result = EMAIL_REGEX.test(email)
      console.log(result, email, 'email')
      setValidEmail(result)
      if(emailsp.current)
         emailsp.current.textContent = emailFocus && !validEmail ? 'Invalid email format' : emailFocus===false && !validEmail ? 'Invalid email format' : email !== confirmEmail ? 'Email mismatched': '';

   }, [email, validEmail, emailFocus, email2sp.current.textContent])

   //email checking
   useEffect(()=>{
      const result = EMAIL_REGEX.test(confirmEmail)
      console.log(result, confirmEmail, 'confirmEmail')
      setValidConfirmEmail(result)

      // chaining ternary expression using this syntax
      //const value = condition1 ? result1 : (condition2 ? result2 : result3);
      if(email2sp.current)
         email2sp.current.textContent = confirmEmailFocus === false && (email !== confirmEmail) ? 'Email mismatched' : confirmEmailFocus && (email !== confirmEmail) ? 'Email mismatched' : confirmEmailFocus && !validConfirmEmail ? 'Invalid email format' : confirmEmailFocus===false && !validConfirmEmail ? 'Invalid email format' : '';
      
   },[confirmEmail, validConfirmEmail, email, confirmEmailFocus, emailsp.current.textContent])

   //added validation functionality for email
   useEffect(()=>{
      if(email !== confirmEmail)
         setValidConfirmEmail(false);
   },[email, confirmEmail, validConfirmEmail])

   //password checking
   useEffect(()=>{
      const result = PASSWORD_REGEX.test(pwd)
      console.log(result, pwd, 'pwd')
      setValidPwd(result)
      if(passwordsp.current)
         passwordsp.current.textContent = pwdFocus && !validPwd ? 
          'Password should be 5 to 30 characters with at least one letter, one number and one special character' : pwdFocus===false && !validPwd ? 'Password should be 5 to 30 characters with at least one letter, one number and one special character' : '';

   }, [pwd, validPwd, pwdFocus])

   //confirm password checking
   useEffect(()=>{
      const result = PASSWORD_REGEX.test(matchPwd)
      console.log(result, matchPwd, 'matchPwd')
      setValidMatchPwd(result)
      if(password2sp.current)
         password2sp.current.textContent = matchPwdFocus && !validMatchPwd ? 
          'Password should be 5 to 30 characters with at least one letter, one number and one special character' : matchPwdFocus===false && !validMatchPwd ? 'Password should be 5 to 30 characters with at least one letter, one number and one special character' : matchPwdFocus && pwd !== matchPwd ? 'Password mismatched' : matchPwdFocus===false && pwd !== matchPwd ? 'Password mismatched' : '';
   }, [matchPwd, validMatchPwd, pwd, matchPwdFocus])

   //change the color of the background   
   useEffect(() => {
      document.body.style.background = bodyStyle.backgroundColor;
      document.body.style.backgroundRepeat ='no-repean';
      document.body.style.backgroundSize='cover';
      document.body.style.marginBottom='50px';
   },[])


   // CHECKING IF SIGNUP IS SUCCESSFUL ALREADY THEN DO THE NEXT STEP

   //get the state data in signup store
   const signupResult = useSelector(selectCurrentUser);
    //save the token to cookie for either google or regular signup
   //set token cooke using token value for 365 days
   const localTokenCookie = useGetTokenCookie('token');
   const existingTokenCookie = signupResult ? signupResult.token : localTokenCookie ? localTokenCookie : '';
   // useSetTokenCookie({name:'token', value: loginUserData?.token || '', expirationDays:365 });
   useSetTokenCookie({name:'token', value: existingTokenCookie, expirationDays:365 });


   useEffect(()=>{

      if (signupResult) {

         //IF SIGNUPRESULT IS USING GOOGLE REDIRECT TO HOME
         if(signupResult.hasOwnProperty('google')){
            navigate('/home')
         }

         //go to login page if gologin is present means it just came from signing up. if putting username then it will always go to login it must be a flag only
         if(signupResult.hasOwnProperty('gologin')){
            // setUsername(signupResult.username);
            navigate('/login')
         }
         
       } else if (typeof signupResult === 'undefined') {
            //do nothing
            console.log('signupResult is undefined')
       } else {
         //any other reason here
         setErrMsg(signupResult);
         //since focus is only applicable for forms tags like input and textarea make p tag editable
         errRef.current.contentEditable = 'true';
         errRef.current.focus();
       }

   },[signupResult])


   //FILLING OUT FORMS AND SUBMISSION

   //handle the submit button
   const handleSubmit = (e) => {
      //prevent from refreshing the page
      e.preventDefault();
      //must be wrapped with curly braces because the action creators expect only one parameter
      dispatch(userSignupAaction({name, lastName, email, confirmEmail, pwd, matchPwd}))
      errRef.current.scrollIntoView({ behavior: 'smooth' });
   }

   //RECAPTCHA CHECKED
   function onChange(value) {
      console.log("Captcha value:", value);
      setRecaptchaVerified(true);
    }
  
    //this will trigger the re-render
    useEffect(() => {
      console.log('recaptchaVerified:', recaptchaVerified);
    },[recaptchaVerified])


   // CHECK STATE STATUS AND ERRORS 
   //check the error
   if(isSignUpHasError) return ( 
      <div className="full-page-container">
         <div className="centered-content">
            <div>Error occurred...</div>
         </div>
      </div>
      )
     
    //check if loading
     if(isSignUpLoading) return ( 
      <div className="full-page-container">
         <div className="centered-content">
            <div>Loading login page...</div>
         </div>
      </div>
      )
   
   return (
       <main>
         <Container className='fluid py-2'>
            <Row className=''>
               <div className="login_box d-flex justify-content-center align-items-center">   
                  <div id="second">
                     {/* set error message at the top of the login form */}
                     <section>
                        <p ref={errRef} className={(errMsg) ? "errmsg" : "offscreen"} >{errMsg}</p>
                     </section>
                     <div className="d-flex justify-content-center mb-3">
                        <Nav.Link as={Link} to={"/home"}><img src={ CompanyIcon } alt="Invoice logo"/></Nav.Link>
                     </div> 
                     <form onSubmit={handleSubmit} id="regForm">

                        <label htmlFor="name" style={{width:'110px'}}> First Name : </label>
                        <input className="border-bottom w-100"
                           type="text" 
                           id="name" 
                           ref={nameRef} 
                           autoComplete="on"
                           
                           spellCheck="false" 
                           onChange={(e)=>setName(e.target.value)} 
                           aria-invalid={validName ? "false" : "true"} 
                           aria-describedby="fname"
                           onFocus={()=>setNameFocus(true)} 
                           onBlur={()=>setNameFocus(false)} 
                           required />
                           <p className="text-danger" id="fname" ref={fnamesp}></p>
                                    
                        <label htmlFor="lastName" style={{width:'110px'}}>Last Name :</label>  
                        <input className="border-bottom w-100"
                           type="text" 
                           id="lastName"
                           ref={lastNameRef}
                          
                           autoComplete="on"
                           spellCheck="false" 
                           onChange={(e)=>setLastName(e.target.value)} 
                           aria-invalid={validLastName ? "false" : "true"} 
                           aria-describedby="lname" 
                           onFocus={()=>setLastNameFocus(true)} 
                           onBlur={()=>setLastNameFocus(false)}  
                           required />
                           <p className="text-danger" id="lname" ref={lnamesp}></p>
                        
                        <label htmlFor="email" style={{width:'110px'}}>Email :</label>
                        <input className="border-bottom w-100"
                           type="email" 
                           id="email" 
                           ref={emailRef}
                           autoComplete="on"
                          
                           spellCheck="false" 
                           onChange={(e)=>setEmail(e.target.value)} 
                           aria-invalid={validEmail ? "false" : "true"} 
                           aria-describedby="emailsp" 
                           onFocus={()=>setEmailFocus(true)} 
                           onBlur={()=>setEmailFocus(false)}  
                           required />
                           <p className="text-danger" id="emailsp" ref={emailsp}></p>
                        
                        <label htmlFor="email2" style={{width:'110px'}}>Confirm Email :</label>
                        <input className="border-bottom w-100"
                           type="email" 
                           id="email2" 
                           ref={matchEmailRef}
                           autoComplete="on"
                           spellCheck="false" 
                           
                           onChange={(e)=>setConfirmEmail(e.target.value)} 
                           aria-invalid={validConfirmEmail ? "false" : "true"} 
                           aria-describedby="email2sp"
                           onFocus={()=>setConfirmEmailFocus(true)} 
                           onBlur={()=>setConfirmEmailFocus(false)}  
                           required />
                           <p className="text-danger" id="email2sp" ref={email2sp}></p>
                           
                        <label htmlFor="password" style={{width:'110px'}}>Password :</label>
                        <input className="border-bottom w-100"
                           type="password" 
                           id="password" 
                           ref={pwdRef}
                           autoComplete="off"
                         
                           onChange={(e)=>setPwd(e.target.value)} 
                           aria-invalid={validPwd ? "false" : "true"} 
                           aria-describedby="pwd" 
                           onFocus={()=>setPwdFocus(true)} 
                           onBlur={()=>setPwdFocus(false)} 
                           required/>
                           <p className="text-danger" id="pwd" ref={passwordsp}></p>
                           
                        <label htmlFor="password2" style={{width:'100%'}}>Confirm Password :</label>
                        <input className="border-bottom w-100"
                           type="password" 
                           id="password2"
                           autoComplete="off"
      
                           ref={matchPwdRef} 
                           onChange={(e)=>setMatchPwd(e.target.value)} 
                           aria-invalid={validMatchPwd ? "false" : "true"} 
                           aria-describedby="pwd2"
                           onFocus={()=>setMatchPwdFocus(true)} 
                           onBlur={()=>setMatchPwdFocus(false)} 
                           required />
                           <p className="text-danger" id="pwd2" ref={password2sp}></p>

                           <div id="agree" style={{border: "none"}}  className="text-center"> 
                              <span>By registering you agree to the &nbsp;</span><a target="_blank" rel="noreferrer" href="https://jba.homes/termsandconditions.html" id="agree" className="agree" style={{textAlign: "center", position: "relative", border:"none", color:"#3742fa"}}>Terms and Conditions</a> and <a target="_blank" rel="noreferrer" href="https://jba.homes/privacypolicy.html">Privacy Policy</a>
                           </div>
                           <br />

                           <div className="d-flex justify-content-center mb-3">
                              <ReCAPTCHA
                                 sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                 onChange={onChange}
                                 ref={recaptchaRef}
                              />                              
                           </div>

                        {/* disable the button if invalid input type is needed to be able to submit*/}
                        <Button type="submit" variant="warning" className="form-control" disabled={!validName || !validLastName || !validEmail || !validConfirmEmail || !validPwd || !validMatchPwd || !recaptchaVerified ? true : false }>Register</Button>
                        <br /><br />

                        <span className="text-center d-block" id="account">
                           Already have an account?
                           <Link to={"/login"} id="signin" className="px-3 signin">Log in</Link>
                        </span>
                       
                     </form>
                  </div>
               </div>
            </Row>
         </Container>
      </main>
   )
} 
export default Signup;

