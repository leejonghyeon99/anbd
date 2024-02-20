import React from 'react';
import { IconContext } from 'react-icons';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MyMarker = (props) => {
  return (
    <IconContext.Provider value={{color:props.point, size:'3em'}}>
      <div>
        <FaMapMarkerAlt/>
      </div>
    </IconContext.Provider>
  );
};

export default MyMarker;