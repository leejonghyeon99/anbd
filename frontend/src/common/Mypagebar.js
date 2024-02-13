import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {StyledMypage} from './Header'

const Mypagebar = () => {
    const [mypageSidebar, setMypageSidebar] = useState(false);

    const showSidebar = () => setMypageSidebar(!mypageSidebar)

    return (
        <>
        <div className='navbar'>
            <Link to="#" className='menu-bars'>
                <StyledMypage onClick={showSidebar} />
            </Link>
            <nav className={ mypageSidebar ? 'nave-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'>
                        <Link to="#" className='menu-bars'>
                            <img src="icon/Xmark.png"></img>
                        </Link>
                    </li>
                </ul>
            </nav>

        </div>
        </>
    );
};

export default Mypagebar;