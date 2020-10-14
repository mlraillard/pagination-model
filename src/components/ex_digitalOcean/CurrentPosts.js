import React from 'react';

import PropTypes from 'prop-types';
import CountryCard from './CountryCard';

class CurrentPosts extends React.Component {
    constructor (props) {
      super(props);
    }

    render () {
        return (
            this.props.currentPosts.map(country => <CountryCard key={country.cca3} country={country} />)
        );
    }    
}

CurrentPosts.propTypes = {
  currentPosts: PropTypes.array
};
  
export default CurrentPosts;