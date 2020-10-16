import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { LEFT_PAGE, RIGHT_PAGE, CONTROL_BUTTONS_AS_ICONS, CONTROL_BUTTON_LEFT, CONTROL_BUTTON_RIGHT } from '../../constants/pagination';
import { fetchPageNumbers, getButtonAriaLabels} from './utils/paginationUtils';

class PaginationFiveButton extends Component {
  constructor(props) {
    super(props);

    this.state = { currentPage: 1,};
  }

  gotoPage = page => {
    const f_totalPosts = typeof this.props.totalPosts === 'number' ? this.props.totalPosts : 0;
    const f_totalPages = Math.ceil(f_totalPosts / this.props.postsPerPage);

    const { paginate = f => f } = this.props; // extract a 'paginate' prop from props
    const f_currentPage = Math.max(0, Math.min(page, f_totalPosts));
    const paginationData = {
      d_currentPage: f_currentPage,
      d_totalPages: f_totalPages,
      d_postsPerPage: this.props.postsPerPage,
      d_totalPosts: f_totalPosts
    };

    this.setState({ currentPage: f_currentPage }, () => paginate(paginationData));
  }

  handleClick = page => evt => {
    evt.preventDefault();
    this.gotoPage(page);
  }

  handleMoveLeft = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage - 1);
  }

  handleMoveRight = evt => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage + 1);
  }

  render() {
    const f_totalPosts = typeof this.props.totalPosts === 'number' ? this.props.totalPosts : 0;
    const f_totalPages = Math.ceil(f_totalPosts / this.props.postsPerPage);

    if (!f_totalPosts || f_totalPages === 1) {
        return null;
    }

    const { currentPage } = this.props.currentPage === 1 && this.state.currentPage !== 1 ? 1 : this.state;
    const pages = fetchPageNumbers(this.props.currentPage, this.props.totalPosts, this.props.postsPerPage);
    const ariaLabels = getButtonAriaLabels(currentPage, pages);

    return (
      <Fragment>
        <nav aria-label="Pagination">
          <ul className="pagination pagination-sm justify-content-end ppag">
            { pages.map((page, index) => {

              if (page === LEFT_PAGE) return (
                <li id={`page${index}`} key={index} className="page-item">
                  <a className="page-link" href="/#" aria-label={ ariaLabels[1] } onClick={this.handleMoveLeft}>
                    <span aria-hidden="true">{CONTROL_BUTTONS_AS_ICONS ? String.fromCharCode(171) : CONTROL_BUTTON_LEFT }</span>
                  </a>
                </li>
              );

              if (page === RIGHT_PAGE) return (
                <li id={`page${index}`} key={index} className="page-item">
                  <a className="page-link" href="/#" aria-label={ ariaLabels[3] } onClick={this.handleMoveRight}>
                    <span aria-hidden="true">{CONTROL_BUTTONS_AS_ICONS ? String.fromCharCode(187) : CONTROL_BUTTON_RIGHT }</span>
                  </a>
                </li>
              );
                return (
                    <li id={`page${index}`} key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
                    <a className="page-link" href="/#" aria-label={ ariaLabels[index] } onClick={ this.handleClick(page) }>{ page }</a>
                    </li>
                );
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