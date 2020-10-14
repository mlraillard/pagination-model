import React from 'react';

import PropTypes from 'prop-types';
import CountryCard from './CountryCard';

class CurrentCountries extends React.Component {
    constructor (props) {
      super(props);
    }

    render () {
        return (
            this.props.currentCountries.map(country => <CountryCard key={country.cca3} country={country} />)
        );
    }    
}

CurrentCountries.propTypes = {
  currentCountries: PropTypes.array
};
  
export default CurrentCountries;