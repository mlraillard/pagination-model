import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { LEFT_PAGE, RIGHT_PAGE, CONTROL_BUTTONS_AS_ICONS, CONTROL_BUTTON_LEFT, CONTROL_BUTTON_RIGHT } from '../../constants/pagination';
import { fetchPageNumbers } from './utils/paginationUtils';

/*
ToDo 10/16
1) [DONE] Take out unused options
1a) [DONE] Page neighbors
2) [DONE] Move all calculations functions to a utility class or contstants
2b) [DONE] range()
2c) [DONE] fetchPageNumbers() ?
3) Implement allymatters suggestions for accessibility
4) Thoroughly test accessibility in [Edge/IE11/Chrome] and [NVDA/JAWS 2019/JAWS 2020] 
4a) Note pass/fail, green/yellow/red results in spreadsheet
4b) Fix any anomalies
5) (Pending result of No. 4), Create classic Redux Store for moving state from local to store
5a) Component should have no local state after that
5b) Retest for accessibility
6) Address all console warnings!!!
*/

class PaginationFiveButton extends Component {
  constructor(props) {
    super(props);
    console.log(`PDO props ${JSON.stringify(this.props)}`);

    this.state = { currentPage: 1 };
  }

  componentDidMount() {
    //this.gotoPage(1);
  }

  gotoPage = page => {
    const f_totalPosts = typeof this.props.totalPosts === 'number' ? this.props.totalPosts : 0;
    const f_totalPages = Math.ceil(f_totalPosts / this.props.postsPerPage);

    const { paginate = f => f } = this.props; // extract a 'paginate' prop from props - clever
    const f_currentPage = Math.max(0, Math.min(page, f_totalPosts));
    const paginationData = {
      d_currentPage: f_currentPage,
      d_totalPages: f_totalPages, //this can come out?
      d_postsPerPage: this.props.postsPerPage, //this can come out?
      d_totalPosts: f_totalPosts //this can come out?
    };

    this.setState({ currentPage: f_currentPage }, () => paginate(paginationData));
  }

  handleClick = page => evt => {
    evt.preventDefault();
    this.gotoPage(page);
  }

  handleMoveLeft = evt => {
    console.log(`handleMoveLeft....`);

    evt.preventDefault();
    this.gotoPage(this.state.currentPage - 1);
  }

  handleMoveRight = evt => {
    console.log(`handleMoveRight....`);

    evt.preventDefault();
    this.gotoPage(this.state.currentPage + 1);
  }

  render() {
    const f_totalPosts = typeof this.props.totalPosts === 'number' ? this.props.totalPosts : 0;
    const f_totalPages = Math.ceil(f_totalPosts / this.props.postsPerPage);

    if (!f_totalPosts || f_totalPages === 1) {
        return null;
    }

    const { currentPage } = this.props.currentPage ===1 && this.state.currentPage !== 1 ? 1 : this.state;

    const pages = fetchPageNumbers(this.props.currentPage, this.props.totalPosts, this.props.postsPerPage);

    return (
      <Fragment>
        <nav aria-label="Pagination">
          <ul className="pagination pagination-sm justify-content-end ppag">
            { pages.map((page, index) => {

              if (page === LEFT_PAGE) return (
                <li id={`page${index}`} key={index} className="page-item">
                  <a className="page-link" href="#" aria-label="Previous" onClick={this.handleMoveLeft}>
                    {/* <span aria-hidden="true">{CONTROL_BUTTONS_AS_ICONS ? `&laquo;` : 'Previous'}</span> */}
                    <span aria-hidden="true">{CONTROL_BUTTONS_AS_ICONS ? String.fromCharCode(171) : CONTROL_BUTTON_LEFT }</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              );

              if (page === RIGHT_PAGE) return (
                <li id={`page${index}`} key={index} className="page-item">
                  <a className="page-link" href="#" aria-label="Next" onClick={this.handleMoveRight}>
                    {/* <span aria-hidden="true">{CONTROL_BUTTONS_AS_ICONS ? &raquo; : 'Next'}</span> */}
                    <span aria-hidden="true">{CONTROL_BUTTONS_AS_ICONS ? String.fromCharCode(187) : CONTROL_BUTTON_RIGHT }</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              );
            //   if (index === 0) {
            //     return (
            //         <li ref={f_liRef} id={`page${index}`} key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
            //         <a className="page-link" href="#" onClick={ this.handleClick(page) }>{ page }</a>
            //         </li>
            //     );
            //   }
            //   else {
                return (
                    <li id={`page${index}`} key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
                    <a className="page-link" href="#" onClick={ this.handleClick(page) }>{ page }</a>
                    </li>
                );
            //   }

            }) }

          </ul>
        </nav>
      </Fragment>
    );
  }
}

PaginationFiveButton.propTypes = {
  totalPosts: PropTypes.number.isRequired,
  postsPerPage: PropTypes.number,
  paginate: PropTypes.func,
  currentPage: PropTypes.number,
};

export default PaginationFiveButton;