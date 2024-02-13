import './CSS/App.css';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './Home';
import Login from './user/Login';
import SignUp from './user/SignUp';
import Update from './user/Update';
import Header from './common/Header';



const App = () => {

  const navigate = useNavigate();

//   useEffect(() => {
//       navigate('/home');
//   },[]);

  return (

      <div>
          <Container className='mt-3'>
            {/* <Header/> */}
              <Routes>
                  <Route>
                      <Route path='/'></Route> 
                      <Route path='/home' Component={Home}></Route> 
                  </Route>
              </Routes>
          </Container>
      </div>
  );
};

export default App;
