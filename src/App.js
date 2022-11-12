// @flow
import React from 'react';
import cookie from 'js-cookie';
import { IDCRA_THEME, ROLES } from './Constant/constant';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Icon,
  Typography,
  Divider,
  Button,
  Avatar
} from '@material-ui/core/';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  Link
} from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import RegisterPage from './Pages/Register/RegisterPage';
import LoginPage from './Pages/Login/LoginPage';
import SchoolPage from './Pages/School/SchoolPage';
import SchoolCostPage from './Pages/School/SchoolCostPage';
import StudentPage from './Pages/Student/StudentPage';
import SurveyPage from './Pages/Survey/SurveyPage';
import ReportsPage from './Pages/Reports/ReportsPage';
import HomePage from './Pages/Home/HomePage';

const NavigationLink = (props: {
  to: string,
  exact?: boolean,
  children: (active: boolean) => React$Node,
}) => (
  <Route path={ props.to } exact={ props.exact }>
    { ({ location, match }) => <Link to={ props.to }>{ props.children(!!match) }</Link> }
  </Route>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    { ...rest }
    render={ props =>
      cookie.get('token') ? (
        <Component { ...props } />
      ) : (
        <Redirect to={ { pathname: '/login', state: { from: props.location } } } />
      )
    }
  />
);

const PrivateRouteMainToLogin = ({ component: Component, ...rest }) => (
  <Route
    { ...rest }
    render={ props =>
      !cookie.get('token') ? (
        <Component { ...props } />
      ) : (
        <Redirect to={ { pathname: '/', state: { from: props.location } } } />
      )
    }
  />
);

const drawerWidth = 280;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    background: '#FFF',
    ...theme.mixins.toolbar,
  },
  appBar: {
    background: IDCRA_THEME.APP_BAR,
    color: IDCRA_THEME.TEXT,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#FFF',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  mainContent: {
    width: '100%',
    height: '100vh',
    left: '0',
    right: '0',
    position: 'absolute',
    margin: '0 auto',
    padding: '0 5px',
    [theme.breakpoints.up('sm')]: {
      width: '85%',
      padding: '0',
    },
  },
  rightNavbarText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    margin: 10,
    backgroundColor: '#FFAC1C',
  },
});

class Dashboard extends React.Component<{}, { openDrawer: boolean }> {
  state = {
    openDrawer: false,
    openrightDrawer: false,
  };

  handleDrawerOpen = () => {
    this.setState({ openDrawer: true });
  };

  handleRightDrawerOpen = () => {
    this.setState({ openRightDrawer: true });
  };

  handleDrawerClose = () => {
    this.setState({ openDrawer: false });
  };

  handleRightDrawerClose = () => {
    this.setState({ openRightDrawer: false });
  };

  handleLogout = () => {
    cookie.remove('email');
    cookie.remove('token');
    cookie.remove('role');
    cookie.remove('studentId');
    cookie.remove('latestStudentId');
    window.location.href = '/login';
  };

  componentDidMount() {
    this.setState({ openDrawer: true });
  }

  mainListItems = () => {
    return (
      <div>
        <span style={ { color: '#B0B0B0', fontWeight: 'bold', padding: '5px', fontSize: '18px' } }>Dashboard</span>
        { cookie.get('role') !== ROLES.PARENT &&
          <NavigationLink to='/schools'>
            { isActive => (
              <ListItem button selected={ isActive } onClick={ () => this.setState({ openDrawer: false }) }>
                <ListItemIcon>
                  <Icon>school</Icon>
                </ListItemIcon>
                <ListItemText primary='Schools' />
              </ListItem>
            ) }
          </NavigationLink>
        }

        <NavigationLink to='/students'>
          { isActive => (
            <ListItem button selected={ isActive } onClick={ () => this.setState({ openDrawer: false }) }>
              <ListItemIcon>
                <Icon>people</Icon>
              </ListItemIcon>

              <ListItemText primary='Students' />
            </ListItem>
          ) }
        </NavigationLink>
        {/* { cookie.get('role') !== ROLES.PARENT &&
      <NavigationLink to='/surveys'>
        { isActive => (
          <ListItem button selected={ isActive }>
            <ListItemIcon>
              <Icon>format_list_numbered</Icon>
            </ListItemIcon>
            <ListItemText primary='Surveys' />
          </ListItem>
        ) }
      </NavigationLink>
    } */}

        { cookie.get('role') === ROLES.PARENT &&
          <NavigationLink
            // temporary hack
            to={
              cookie.get('latestStudentId') ?
                `/reports/${cookie.get('latestStudentId')}` :
                '/reports'
            }>
            { isActive => (
              <ListItem button selected={ isActive } onClick={ () => this.setState({ openDrawer: false }) }>
                <ListItemIcon>
                  <Icon>bar_chart</Icon>
                </ListItemIcon>
                <ListItemText primary='Reports' />
              </ListItem>
            ) }
          </NavigationLink>
        }
      </div >
    )
  };

  render() {
    // $FlowFixMe
    const { classes } = this.props;
    const username = cookie.get('email') ? cookie.get('email').split('@') : [];
    const firstLetter = username.length ? username[0].substring(0, 1) : '';

    return (
      <BrowserRouter>
        <React.Fragment>
          <div className={ classes.root }>
            <CssBaseline />
            { cookie.get('token') ? (
              <AppBar
                position='fixed'
                className={ classNames(
                  classes.appBar,
                  cookie.get('token') && this.state.openDrawer && classes.appBarShift
                ) }
              >
                <Toolbar disableGutters={ !this.state.openDrawer } className={ classes.toolbar }>
                  <Button
                    color='inherit'
                    aria-label='Open drawer'
                    onClick={ this.handleDrawerOpen }
                    className={ classNames(
                      classes.menuButton,
                      this.state.openDrawer && classes.menuButtonHidden
                    ) }
                  >
                    <Icon>menu</Icon>
                  </Button>
                  <Typography variant='title' color='inherit' noWrap className={ classes.title }>
                    IDCRA
                  </Typography>
                  { cookie.get('token') ? (
                    <div className={ classes.rightNavbarText }>
                      <Avatar alt="Profile Pict" className={ classes.avatar }>{ firstLetter }</Avatar>
                      <Typography variant='title' color='inherit' noWrap className={ classes.title }>
                        Hi, { username[0] }
                      </Typography>
                      <Button
                        onClick={ this.handleLogout }
                        color='inherit'
                        aria-label='Logout'
                        className={ classes.button }
                      >
                        <Icon>logout</Icon>
                      </Button>
                    </div>
                  ) : null }
                </Toolbar>
              </AppBar>) : null }
            { cookie.get('token') ? (
              <Drawer
                anchor={ 'left' }
                variant='persistent'
                classes={ {
                  paper: classNames(
                    classes.drawerPaper,
                    !this.state.openDrawer && classes.drawerPaperClose
                  ),
                } }
                BackdropProps={ { invisible: true } }
                open={ this.state.openDrawer }
                onClose={ () => this.setState({ openDrawer: false }) }
              >
                <div className={ classes.toolbarIcon }>
                  <Button style={ { color: '#000' } } onClick={ this.handleDrawerClose }>
                    <Icon>chevron_left</Icon>
                  </Button>
                </div>
                <Divider />
                <List>{ this.mainListItems() }</List>
              </Drawer>
            ) : null }
            <main
              className={ classNames(
                classes.content,
                cookie.get('token') && this.state.openDrawer && classes.contentShift
              ) }
            >
              {
                cookie.get('token') &&
                <div className={ classes.appBarSpacer } />
              }
              <div
                className={ classNames(
                  classes.mainContent,
                  cookie.get('token') && this.state.openDrawer && classes.mainContentOpen
                ) }
              >
                <Switch>
                  <PrivateRoute path='/' exact component={ HomePage } />
                  <PrivateRoute path='/schools' exact component={ SchoolPage } />
                  <PrivateRoute path='/schools/:schoolID/cost' exact component={ SchoolCostPage } />
                  <PrivateRoute path='/students' exact component={ StudentPage } />
                  <PrivateRoute path='/survey/:studentID' component={ SurveyPage } />
                  <PrivateRoute path='/reports/:studentID' component={ ReportsPage } />
                  <PrivateRouteMainToLogin path='/login' component={ LoginPage } />
                  <PrivateRouteMainToLogin path='/register' component={ RegisterPage } />
                </Switch>
              </div>
            </main>
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(Dashboard);
