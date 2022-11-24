import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
// import { IDCRA_THEME } from '../Constant/constant';

const CustomPagination = (props) => {
  const {
    currentPage,
    setCurrentPage,
    disableNext
  } = props;

  const nextPage = () => {
    setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    setCurrentPage(currentPage - 1)
  }

  return (
    <nav style={ {
      maxWidth: '95%',
      margin: '0 auto',
      overflowX: 'auto'
    } }>
      <ul style={ {
        listStyleType: 'none',
        display: 'flex',
        flexDirection: 'row',
        gap: '5px',
        justifyContent: 'center'
      } }>
        <li>
          <Button
            disabled={ currentPage <= 1 }
            variant='contained'
            onClick={ prevPage }
          >
            Previous
          </Button>
        </li>
        {/* { pageNumbers.map((pgNumber) => (
          <li style={ {
            display: 'flex',
            alignItems: 'center',
            maxWidth: '64px',
          } } key={ pgNumber }>
            <button
              onClick={ () => setCurrentPage(pgNumber) }
              style={ {
                minWidth: '32px',
                height: '100%',
                padding: '2px',
                backgroundColor: currentPage === pgNumber ? `${IDCRA_THEME.PRIMARY}` : '#FFF',
                color: currentPage === pgNumber ? `${IDCRA_THEME.TEXT}` : '#000',
                border: 'none',
                borderRadius: '4px',
              } }
            >
              { pgNumber }
            </button>
          </li>
        ))
        } */}
        <li>
          <Button
            disabled={ disableNext }
            variant='contained'
            onClick={ nextPage }
          >
            Next
          </Button>
        </li>
      </ul>
    </nav >
  );
}

export default CustomPagination;

CustomPagination.propTypes = {
  nPages: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  disableNext: PropTypes.bool,
}

CustomPagination.defaultProps = {
  nPages: 1,
  currentPage: 1,
  setCurrentPage: () => { },
  disableNext: false,
}
