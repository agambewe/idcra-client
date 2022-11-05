import React from 'react';
import PropTypes from 'prop-types';
import {
  Snackbar,
  SnackbarContent
} from '@material-ui/core/';

const CustomSnackbar = (props) => {
  return (
    <Snackbar
      anchorOrigin={ {
        vertical: 'top',
        horizontal: 'center',
      } }
      open={ props.open }
      onClose={ () => props.close() }
      autoHideDuration={ 3000 }
      ContentProps={ {
        'aria-describedby': 'message-id',
      } }
    >
      <SnackbarContent style={ props.contentStyle }
        message={ <span id="message-id">{ props.message }</span> }
      />
    </Snackbar>
  );
}

export default CustomSnackbar;

CustomSnackbar.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  close: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  contentStyle: PropTypes.object,
  message: PropTypes.string,
}
