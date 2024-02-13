import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {StyledMypage} from './Header'
import { MypagebarList} from '../components/MypagebarList'
import './CSS/Mypagebar.css'

const Mypagebar = () => {
    const [mypageSidebar, setMypageSidebar] = useState(false);

    const showSidebar = () => setMypageSidebar(!mypageSidebar)

    return (
        <>
        <div className='navbar'>
            <Link to="#" className='menu-bars'>
                <StyledMypage onClick={showSidebar} />
            </Link>
            <nav className={ mypageSidebar ? 'nav-menu.active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'>
                        <Link to="#" className='menu-bars'>
                            <img src="icon/Xmark.png"></img>
                        </Link>
                    </li>
                    {MypagebarList.map((item, index) => {
                        return (
                            <li key={index} className='item.cName'>
                                <Link to={item.path}>
                                    {/* {item.icon} */}
                                    <sapn>{item.title}</sapn>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

        </div>
        </>
    );
};

export default Mypagebar;