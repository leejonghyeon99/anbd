import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { icon } from '../../public/icon'

const Header = () => {
    return (
        <>
            <div id='header'>
                    <Link to="/" className='navbar-brand'>AH!NaBaDa</Link>
                    <Link to="/saveForm" className='nav-link'><img src={}/></Link>
            </div>
        </>
    );
};

export default Header;