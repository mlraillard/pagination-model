import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
}

class PaginationDigitalOcean extends Component {
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

    const { paginate = f => f } = this.props; // what does this do???
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
    const f_pageNeighbours = typeof this.props.pageNeighbours === 'number'
    ? Math.max(0, Math.min(this.props.pageNeighbours, 2))
    : 0;

    evt.preventDefault();
    this.gotoPage(this.state.currentPage - (f_pageNeighbours * 2) - 1);
  }

  handleMoveRight = evt => {
    console.log(`handleMoveRight....`);
    const f_pageNeighbours = typeof this.props.pageNeighbours === 'number'
    ? Math.max(0, Math.min(this.props.pageNeighbours, 2))
    : 0;

    evt.preventDefault();
    this.gotoPage(this.state.currentPage + (f_pageNeighbours * 2) + 1);
  }

  /**
   * Let's say we have 10 pages and we set pageNeighbours to 2
   * Given that the current page is 6
   * The pagination control will look like the following:
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */
  fetchPageNumbers = () => {
    const f_totalPosts = typeof this.props.totalPosts === 'number' ? this.props.totalPosts : 0;
    const f_totalPages = Math.ceil(f_totalPosts / this.props.postsPerPage);
    const f_pageNeighbours = typeof this.props.pageNeighbours === 'number' ? Math.max(0, Math.min(this.props.pageNeighbours, 2)) : 0;
    const f_currentPage = this.state.currentPage;

    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = (f_pageNeighbours * 2) + 3;
    const totalBlocks = totalNumbers + 2;

    if (f_totalPages > totalBlocks) {
      const startPage = Math.max(2, f_currentPage - f_pageNeighbours);
      const endPage = Math.min(f_totalPages - 1, f_currentPage + f_pageNeighbours);
      let pages = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = (f_totalPages - endPage) > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case (hasLeftSpill && hasRightSpill):
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, f_totalPages];
    }
    return range(1, f_totalPages);
  }

  render() {
    const f_totalPosts = typeof this.props.totalPosts === 'number' ? this.props.totalPosts : 0;
    const f_totalPages = Math.ceil(f_totalPosts / this.props.postsPerPage);

    if (!f_totalPosts || f_totalPages === 1) {
        return null;
    }

    const { currentPage } = this.state;
    const pages = this.fetchPageNumbers();

    return (
      <Fragment>
        <nav aria-label="Pagination">
          <ul className="pagination">
            { pages.map((page, index) => {

              if (page === LEFT_PAGE) return (
                <li id={`page${index}`} key={index} className="page-item">
                  <a className="page-link" href="#" aria-label="Previous" onClick={this.handleMoveLeft}>
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              );

              if (page === RIGHT_PAGE) return (
                <li id={`page${index}`} key={index} className="page-item">
                  <a className="page-link" href="#" aria-label="Next" onClick={this.handleMoveRight}>
                    <span aria-hidden="true">&raquo;</span>
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

PaginationDigitalOcean.propTypes = {
  totalPosts: PropTypes.number.isRequired,
  postsPerPage: PropTypes.number,
  pageNeighbours: PropTypes.number,
  paginate: PropTypes.func,
};

export default PaginationDigitalOcean;