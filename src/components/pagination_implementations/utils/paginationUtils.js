import { LEFT_PAGE, RIGHT_PAGE } from '../../../constants/pagination';

export const getButtonAriaLabels = (currentPage, pages) => {
    const statements = {
      0: currentPage === pages[0] ? `Go to Page ${pages[0]}, Current Page` : `Go to Page ${pages[0]}`,
      1: pages[1] === LEFT_PAGE ? `Previous to Page ${pages[2] - 1}` :
         currentPage === pages[1] ? `Go to Page ${pages[1]}, Current Page` : `Go to Page ${pages[1]}`,
      2: currentPage === pages[2] ? `Go to Page ${pages[2]}, Current Page` : `Go to Page ${pages[2]}`,
      3: pages[3] === RIGHT_PAGE ? `Next to Page ${pages[2] + 1}` :
         currentPage === pages[3] ? `Go to Page ${pages[3]}, Current Page` : `Go to Page ${pages[3]}`,
      4: currentPage === pages[4] ? `Go to Page ${pages[4]}, Current Page` : `Go to Page ${pages[4]}`,
    };
    return statements;
}

const range = (from, to) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i++;
  }

  return range;
}

  /**
   * [Let's say we have 10 pages and we set pageNeighbours to 2] obsolete
   * Given that the current page is 6
   * The pagination control will look like the following:
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */
  export const fetchPageNumbers = (f_currentPage, f_totalPosts, f_postsPerPage) => {
    const f_totalPages = Math.ceil(f_totalPosts / f_postsPerPage);

    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = 3;
    const totalBlocks = totalNumbers + 2;

    if (f_totalPages > totalBlocks) {
      const startPage = Math.max(2, f_currentPage);
      const endPage = Math.min(f_totalPages - 1, f_currentPage);
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
  };