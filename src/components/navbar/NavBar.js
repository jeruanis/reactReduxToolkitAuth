import React, { useEffect, useState } from 'react';
import cicon from '../../images/newlogonobg2.png'
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, Container, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { selectCurrentUser } from '../../features/signups/signupSlice.js'

import { selectCurrentUserLogin } from '../../features/login/loginSlice.js';
import { useGetTokenCookie } from '../../utilities/cookieAccess.js';
import { userKeepLoginAaction } from '../../features/login/loginSlice.js';

// NOTE: Each component depends on its own import 

const NavComponent = () => {

  const [username, setUsername] = useState();
  const [imageUrl, setImageUrl] = useState();

  // make a regex for all instances of /login or signup 
  const pathRegex = /\/(login|signup)/gi;

  // Get the current location
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSignupPage = location.pathname === '/signup';
  const isHomePage = location.pathname === '/home';
  const isHomePageDefault = location.pathname === '/';
  console.log('isSignupPage:', isSignupPage, 'not isSignupPage:', !isSignupPage)

  const tokenCookie = useGetTokenCookie('token');
  console.log('tokenCookie:', tokenCookie)

  //inquire from signup if there is google, username and imageUrl
  const signupUserData = useSelector(selectCurrentUser);
  console.log('signupUserData:', signupUserData)
  //Inquire from login State if data are available
  const loginUserData = useSelector(selectCurrentUserLogin)
  console.log('loginUserData:', loginUserData)
  
  useEffect(()=>{

    //if the signup storage is not undefined it means that 
    if(signupUserData){
      if(signupUserData.hasOwnProperty('username') && signupUserData.hasOwnProperty('imageUrl')) {
          setUsername(signupUserData.username);  
          setImageUrl(signupUserData.imageUrl);
      }
    }
    if (loginUserData) {

        if(loginUserData.hasOwnProperty('username') && loginUserData.hasOwnProperty('imageUrl')){
            console.log('has username and has imageUrl')
            // Retrieving the username
            setUsername(loginUserData.username);  
            setImageUrl(loginUserData.imageUrl);
            console.log('username:', username, 'imageUrl:', imageUrl)
        }else{
          //execute when all the condition are met 
          if(!isSignupPage && !isHomePageDefault && !isHomePage) //if signup page stay 
            navigate('/login')
        }
    } 



    //check if token cookie is existing
    if(tokenCookie) //if signup page stay
      dispatch(userKeepLoginAaction(tokenCookie))


  },[loginUserData, navigate, isSignupPage, isHomePage, isHomePageDefault]) 

  const isMatch = pathRegex.test(location.pathname);
  if (isMatch) return null; // Return null to hide the navbar
  


   console.log('this is username;', username, 'thisis imageUrl:', imageUrl)
   return (
      <header className="shadow px-3 bg-light rounded fixed-top">
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand><img src={cicon} alt="logo" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              // style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link as={Link} to={"/home"}>Home</Nav.Link>
              <NavDropdown title="More" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to={"/todo"}>Todo</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to={"/friendrequest"}>Contact Us</Nav.Link>
            </Nav>

          {username ? ( 
            <>
            <div className="d-inline-block">
              <Link to={"/profile"} className="lead text-body align-self-center">
                <img src={imageUrl}  style={{height:'40px', width:'40px', marginRight:'8px'}} className="rounded-circle" alt='profile id'/>
                <span className="d-inline-block">{username.charAt(0).toUpperCase() + username.slice(1)}</span> 
              </Link>
              <span className='d-inline-block align-self-center px-3'>|</span> 
              <Link to={ "/logout" } className="lead text-body align-self-center">Logout</Link>
            </div>
           </>
          ) : ( 
            <div className="d-inline-block">
              <Link to={ "/signup" } className="lead text-body align-self-center">Signup</Link><span className='d-inline-block align-self-center px-3'> | </span> <Link to={ "/login" } className="lead text-body align-self-center">Login</Link>
            </div>
          )}
          </Navbar.Collapse>
        </Container>
        </Navbar>
      </header>
   )
}
export default NavComponent;



