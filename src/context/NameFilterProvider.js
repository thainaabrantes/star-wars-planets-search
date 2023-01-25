import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NameFilterContext from './NameFilterContext';

export default function NameFilterProvider({ children }) {
  const [searchName, setSearchName] = useState('');

  const handleChange = (e) => {
    setSearchName(e.target.value);
  };

  return (
    <NameFilterContext.Provider
      value={ { searchName, handleChange } }
    >
      { children }
    </NameFilterContext.Provider>
  );
}

NameFilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
