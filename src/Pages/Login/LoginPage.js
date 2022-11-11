// @flow

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import linkState from 'linkstate';
import axios from 'axios';
import cookie from 'js-cookie';
import { SNACKBAR } from '../../Constant/constant';
import { API_URL } from '../../Constant/constant';
import { withStyles } from '@material-ui/core/styles/';
import {
  Button,
  CssBaseline,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Typography
} from '@material-ui/core/';
import CustomSnackbar from '../../Common/Snackbar';

const styles = theme => ({
  layout: {
    width: '100%',
    height: '100%',
    display: 'block', // Fix IE11 issue.
    position: 'relative',
    margin: '0 auto',
  },
  paper: {
    display: 'flex',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    width: '100%',
    backgroundColor: '#FFF',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
    }
  },
  img: {
    width: '100%',
    maxWidth: '400px',
    objectFit: 'cover',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  registerLink: {
    marginBottom: '10px',
    textDecoration: 'underline',
    color: 'blue',
    padding: '5px',
    textAlign: 'left',
  }
});

class LoginPage extends Component<
  {
    classes: any,
  },
  {
    email: ?string,
    password: ?string,
    loading: boolean,
  }
> {
  state = {
    email: null,
    password: null,
    loading: false,
    inlineMessage: {
      show: false,
      message: '',
    }
  };

  login = async () => {
    this.setState({ loading: true });
    try {
      if (this.state.email && this.state.password) {
        const {
          data
        } = await axios.post(
          `${API_URL}/login`,
          {},
          {
            auth: {
              username: this.state.email,
              password: this.state.password,
            },
          }
        );
        if (data.access_token) {
          // temporal hack to render logged-in user
          cookie.set('email', this.state.email, { expires: 7 });
          cookie.set('token', data.access_token, { expires: 7 });
          if (data.hasOwnProperty('role')) {
            cookie.set('role', data.role, { expires: 7 });
          }
          window.location = '/';
        }
      } else {
        const inlineMessage = {
          show: true,
          message: 'Please fill out all the empty fields!'
        };

        this.setState({
          loading: false,
          inlineMessage,
        });
      }
    } catch (error) {

      const inlineMessage = {
        show: true,
        message: 'Wrong username or password!'
      };

      this.setState({
        loading: false,
        inlineMessage,
      });
    }
  };

  resetSnackbar = () => {
    const inlineMessage = {
      show: false,
      message: ''
    };

    this.setState({ inlineMessage });
  }
  render = () => (
    <React.Fragment>
      <CssBaseline />
      <main className={ this.props.classes.layout }>
        {
          this.state.inlineMessage.message &&
          <CustomSnackbar
            open={ this.state.inlineMessage.show }
            close={ () => this.resetSnackbar() }
            contentStyle={ {
              backgroundColor: SNACKBAR.ERROR,
              width: '100%',
              borderRadius: '4px',
            } }
            message={ this.state.inlineMessage.message }

          />
        }
        <Paper className={ this.props.classes.paper }>
          <img className={ this.props.classes.img } src={ require('../Home/logo-idcra-vol-2.png') } alt={ 'logo' } />
          <br />
          <Typography variant='headline'>LOGIN</Typography>
          <form className={ this.props.classes.form }>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='email'>Email Address</InputLabel>
              <Input
                onChange={ linkState(this, 'email') }
                id='email'
                name='email'
                autoFocus
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <Input
                onChange={ linkState(this, 'password') }
                name='password'
                type='password'
                id='password'
              />
            </FormControl>
            <Button
              type='submit'
              fullWidth
              variant='raised'
              disabled={ this.state.email === '' || this.state.password === '' }
              className={ this.props.classes.submit }
              onClick={ (e: SyntheticEvent<HTMLButtonElement>) => {
                e.preventDefault();
                this.login();
              } }
            >
              { this.state.loading ? 'LOGGING IN...' : 'LOGIN' }
            </Button>
          </form>
          <Link to={ `/register` }>
            <Typography className={ this.props.classes.registerLink } variant='body2'>
              Doesn't have any account? click here to register.
            </Typography>
          </Link>
        </Paper>
      </main>
    </React.Fragment>
  );
}
export default withRouter(withStyles(styles)(LoginPage));
