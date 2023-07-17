import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import onlineRadio from '../images/onlineradio.png'
import expenseMonitor from '../images/expensemonitor.png'
import socialMedia from '../images/socialmedia.png'
import shoppingList from '../images/shoppinglist.png'
import wordOfGod from '../images/wordofgod.png'
import textreader from '../images/textreader.png'
import alarmbrowse from '../images/alarmbrowse.png'
import { selectCurrentUserLogin, loginHasError } from '../features/login/loginSlice.js';


const Home = () => {

   const isLoginHasError = useSelector(loginHasError);

   const navigate = useNavigate();

   //Inquire from login State if data are available
   const loginUserData = useSelector(selectCurrentUserLogin)
   console.log('loginUserData:', loginUserData)

   useEffect(()=>{ 
      if (loginUserData) { //check if not undefined to avoiding error
         //IF THERE IS NO TOKEN IN AUTOMATIC LOGIN REFRESH navigate to login
         if(loginUserData.hasOwnProperty('loginrequired'))
            navigate('/login?required')
      }
   },[])

   const cardStyle = {
      margin:'10px', 
      border:'1px solid rgba(0, 0, 0, 0.175)'
   }

   useEffect(() => {
      document.body.style.background = '#ffffff';
   },[])

   //check the occurrence of error
   if(isLoginHasError) return (
      <div className="full-page-container">
         <div className="centered-content">
            <div>Error occurred when logging in, Location:home...</div>
         </div>
      </div>
    )


   return (
      <>
      <Container style={{marginTop:'91px'}}>
         <Row>
            <CardGroup>
               <Card style={cardStyle}>
                  <Link to="/music" className="text-body">
                     <Card.Img variant="top" src={ onlineRadio } alt="Online radio" />
                     <Card.Body>
                        <Card.Title>ONLINE RADIO</Card.Title>
                        <Card.Text>Relax by listening with favorite radio station</Card.Text>
                     </Card.Body>
                  </Link>
               </Card>
               <Card style={cardStyle}>
                  <Link to="/expenditure" className="text-body">
                     <Card.Img variant="top" src={expenseMonitor} alt="Expense monitor"  />
                     <Card.Body>
                        <Card.Title>EXPENSE MONITOR</Card.Title>
                        <Card.Text>Monitor your monthly expenses</Card.Text>
                     </Card.Body>
                  </Link>
               </Card>
               <Card style={cardStyle}>
                     <Link to="/social" className="text-body">
                        <Card.Img variant="top" src={socialMedia} alt="Social media" />
                        <Card.Body>
                           <Card.Title>SOCIAL MEDIA</Card.Title>
                           <Card.Text>Post, Private Chat and Group Chat</Card.Text>
                        </Card.Body>
                     </Link>
                  </Card>
               <Card style={cardStyle}>
                  <Link to="/shopping-list" className="text-body">
                     <Card.Img variant="top" src={ shoppingList } alt="shopping list" />
                     <Card.Body>
                        <Card.Title>SHOPPING LIST</Card.Title>
                        <Card.Text>Create, Update and Delete Inventory</Card.Text>
                     </Card.Body>
                  </Link>
               </Card>
               <Card style={cardStyle}>
                  <Link to="/word-of-wisdom" className="text-body">
                     <Card.Img variant="top" src={wordOfGod} alt="bible reading" />
                     <Card.Body>
                        <Card.Title>WORD OF WISDOM</Card.Title>
                        <Card.Text>Rely on God not with yourself alone</Card.Text>
                     </Card.Body>
                  </Link>
               </Card>
            </CardGroup>
            </Row>

            <Row className="m-2">
               <Card border="info" style={{ width: '18rem' }} className="m-2">
                  <Card.Header>
                     <Card.Img variant="top" style={{height:'40px', width:'40px'}} className="rounded-circle" src={ textreader }  />
                     <span style={{paddingLeft:'10px'}}>Plugin</span></Card.Header>
                     <a target="_blank" href="https://chrome.google.com/webstore/detail/mecius-textreader/lbegcmlpfdmjniobaeghpifgnmhjkhai?hl=en&authuser=0">
                        <Card.Body>
                           <Card.Title>Text Reader</Card.Title>
                           <Card.Text>
                              Take your browsing reading to the next level by using text reader plugin to read the text of web page aloud.
                           </Card.Text>
                        </Card.Body>
                     </a>
               </Card>
               <Card border="info" style={{ width: '18rem' }} className="m-2">
                  <Card.Header>
                     <Card.Img variant="top" style={{height:'40px', width:'40px'}} className="rounded-circle" src={alarmbrowse} />
                     <span style={{paddingLeft:'10px'}}>Plugin</span></Card.Header>
                     <a target="_blank" href="https://chrome.google.com/webstore/detail/alarmbrowse/onpfheoighgkddiobipfcdmgdhoclpaf?hl=en&authuser=0">
                        <Card.Body>
                           <Card.Title>Alarm Browse</Card.Title>
                           <Card.Text>
                              Reduce eyes strain, use alarm browse that sets break interval in browsing.
                           </Card.Text>
                        </Card.Body>
                     </a>
               </Card>
            </Row>
      </Container>
      <footer id="footer" className="mx-auto">
         <section style={{padding:'1rem 0', fontSize:'14px'}}>
            <div className="d-flex flex-column text-center" style={{minWidth:'50%'}}>			
               <p className="mb-0 px-2"><a target="_blank" style={{color:'#6495ed'}} href="https://jba.homes/termsandconditions.html">Terms and Condition</a>, and <a target="_blank" href="https://jba.homes/privacypolicy.html" style={{color:'#6495ed'}}>Privacy Policy</a></p>
               <p className="mb-0 px-2"> &copy 2019 MECIUS </p>
            </div>
         </section>
      </footer>
      </>
    
   )
} 
export default Home;
