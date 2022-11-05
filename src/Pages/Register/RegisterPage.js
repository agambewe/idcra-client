// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Typography,
} from '@material-ui/core/';
import CustomSnackbar from '../../Common/Snackbar';
import { SNACKBAR } from '../../Constant/constant';
import { withStyles } from '@material-ui/core/styles/';
import linkState from 'linkstate';
import RegisterMutation from './RegisterMutation';


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
});

class RegisterPage extends Component<
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

  resetSnackbar = () => {
    const inlineMessage = {
      show: false,
      message: ''
    };

    this.setState({ inlineMessage });
  }

  render = () => (
    <RegisterMutation mutation={ RegisterMutation.mutation }>
      { (register, { data, loading }) => (
        <React.Fragment>
          <CssBaseline />
          <main className={ this.props.classes.layout }>
            <Paper className={ this.props.classes.paper }>
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
              <img className={ this.props.classes.img } src={ require('../Home/logo-idcra-vol-2.png') } alt={ 'logo' } />
              <br />
              <Typography variant='headline'>REGISTER</Typography>
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
                    if (this.state.email && this.state.password) {
                      register({
                        variables: {
                          email: this.state.email,
                          password: this.state.password,
                        },
                      }).then(() => {
                        // $FlowFixMe
                        this.props.history.push('/login');
                      }).catch((err) => {
                        if (err.message.includes('1062')) {
                          const inlineMessage = {
                            show: true,
                            message: 'Username already exist!'
                          };

                          this.setState({ inlineMessage });
                        }
                      });
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
                  } }
                >
                  { this.state.loading ? 'REGISTERING...' : 'REGISTER' }
                </Button>
              </form>
            </Paper>
          </main>
        </React.Fragment>
      ) }
    </RegisterMutation>
  );
}
export default withRouter(withStyles(styles)(RegisterPage));
