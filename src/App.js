import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from 'countries-api';

import { SELECTED_MODE } from './constants/modes'
import TraversyPosts from './components/ex_traversy/TraversyPosts';
import StaticSeocsPosts from './components/ex_staticSeocs/StaticSeocsPosts';
import BillingCodesPosts from './components/ex_billingCodes/BillingCodesPosts';
import CurrentPosts from './components/ex_digitalOcean/CurrentPosts';
import PaginationFiveButton from './components/pagination_implementations/PaginationFiveButton';
import { staticSeocData } from './components/ex_staticSeocs/utils/staticSeocs';
import './css/App.css';

const App = () => {
  let indexOfLastPost;
  let indexOfFirstPost;

  const [mode, setMode] = useState( SELECTED_MODE );
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  let [currentPage, setCurrentPage] = useState(1);
  let [offset, setOffset] = useState(0);
  let [currentPosts, setCurrentPosts] = useState([]);
  const [postsPerPage, setPostsPerPage] = useState(9);
  let [totalPages, setTotalPages] = useState(0);

  const traversyFetchPosts = async () => {
    setLoading(true);
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
    setPosts(res.data);
    setLoading(false);
  };

  const billingCodesFetchPosts = async () => {
    setLoading(true);
    const res = await axios.get('http://localhost:8080/v1/lookup/billingcode');
    setPosts(res.data);
    setLoading(false);
  };

  const staticSeocsFetchPosts = () => {
    setLoading(true);
    setPosts(staticSeocData);
    setLoading(false);
  };

  const flagsFetchPosts = () => {
    setLoading(true);
    const { data: posts = [] } = Countries.findAll();
    setPosts(posts);
    setLoading(false);
  };

  const handleModeChange = (mode) => {
    setMode(mode);
    setCurrentPage(1);
  }

  useEffect(() => {
    if (mode === 'TRAVERSY') {
      traversyFetchPosts();
    }
    else if (mode === 'BILLINGCODES') {
      billingCodesFetchPosts();
    }
    else if (mode === 'STATICSEOCS') {
      staticSeocsFetchPosts();
    }
    else if (mode === 'FLAGS') {
      flagsFetchPosts();
    }
  }, [mode]);

  // Get current posts
  indexOfLastPost = currentPage * postsPerPage;
  indexOfFirstPost = indexOfLastPost - postsPerPage;
  currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  totalPages = Math.ceil(posts.length / postsPerPage);

  // Change page
  const paginate = data => {
     const { d_currentPage, d_totalPages, d_postsPerPage } = data;
     setCurrentPage(d_currentPage);
     setTotalPages(d_totalPages);
     setCurrentPage(d_currentPage);
     setOffset((d_currentPage - 1) * d_postsPerPage);
     setCurrentPosts( posts.slice(offset, offset + postsPerPage));
  }

  return (
    <div className='container mt-5'>
      <select className="selectpicker" value={mode} onChange={event => handleModeChange(event.target.value)} >
         <option key="z20" id="0" value="TRAVERSY">TypiCode</option>
         <option key="z21" id="1" value="BILLINGCODES">Billings Codes</option>
         <option key="z22" id="2" value="STATICSEOCS">Static Seocs</option>
         <option key="z23" id="3" value="FLAGS">Flags</option>
      </select>

      <div className='prows pheader '>
        <div className='prow'>
          { currentPage && (
            <div className="psummary">
              <span tabIndex="0"><strong>{posts.length} Items</strong></span>
              <span className="prow">&nbsp;&nbsp;&nbsp;</span>
              <span tabIndex="0">Page { currentPage } of { totalPages }</span>
              <span role="alert" style={{backgoundColor: '#fff', color: '#fff'}}>Page { currentPage } of { totalPages }</span>
            </div>
          ) }
        </div>
        <div className='prow'>
          <PaginationFiveButton
            postsPerPage={9}
            totalPosts={posts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>

      <div className='pagination-table-window'>
      { mode === 'TRAVERSY' ? <TraversyPosts posts={currentPosts} loading={loading} /> :
        mode === 'STATICSEOCS' ? <StaticSeocsPosts posts={currentPosts} loading={loading} /> :
        mode === 'FLAGS' ? <CurrentPosts currentPosts={currentPosts} /> :
        mode === 'BILLINGCODES' ? <BillingCodesPosts posts={currentPosts} /> :
        '' 
      }
      </div>
    </div>
  );
};

export default App;
