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
  IconButton,
  Tooltip
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
import StudentQuery from './Queries/StudentQuery';

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

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  // toolbar: {
  //   paddingRight: 24, // keep right padding when drawer closed
  // },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    background: IDCRA_THEME.APP_BAR,
    ...theme.mixins.toolbar,
  },
  appBar: {
    left: '0',
    width: '98vw',
    margin: '5px auto',
    borderRadius: '50px',
    background: IDCRA_THEME.APP_BAR,
    color: IDCRA_THEME.TEXT,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
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
  drawerPaper: {
    overflowX: 'hidden',
    position: 'absolute',
    top: '10vh',
    left: '2vw',
    height: 'auto',
    maxHeight: '50vh',
    width: drawerWidth,
    whiteSpace: 'nowrap',
    borderRadius: '8px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  rightDrawerPaper: {
    overflowX: 'hidden',
    position: 'absolute',
    top: '10vh',
    right: '2vw',
    height: 'auto',
    maxHeight: '50vh',
    width: drawerWidth,
    whiteSpace: 'nowrap',
    borderRadius: '8px',
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
  rightDrawerPaperClose: {
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
    height: '100%',
  },
  mainContent: {
    width: '96vw',
    height: '90vh',
    padding: theme.spacing.unit,
    margin: '10px auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  listText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
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
    window.location.href = '/login';
  };

  componentDidMount() {
    this.setState({ openDrawer: true });
  }

  mainListItems = () => {
    return (
      <div>
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
              cookie.get('studentId') ?
                `/reports/${cookie.get('studentId')}` :
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

  rightListItem = (studentData) => {
    const { classes } = this.props;
    const userEmail = cookie.get('email');
    const userName = userEmail.split('@');
    const childName = (
      studentData &&
        studentData.student &&
        studentData.student.hasOwnProperty('name') ? studentData.student.name : ''
    );

    return (
      <div>
        <ListItem>
          <ListItemIcon>
            <Icon>person</Icon>
          </ListItemIcon>
          <Tooltip title={ userName[0].toUpperCase() }>

            <ListItemText className={ classes.listText } primary={ userName[0].toUpperCase() } />
          </Tooltip>
        </ListItem>
        { cookie.get('role') === ROLES.PARENT && childName &&
          <ListItem>
            <ListItemIcon>
              <Icon>people-alt</Icon>
            </ListItemIcon>
            <Tooltip title={ childName }>
              <ListItemText className={ classes.listText } primary={ childName } />
            </Tooltip>
          </ListItem>
        }
        <ListItem button onClick={ this.handleLogout }>
          <ListItemIcon>
            <Icon>logout</Icon>
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </div>
    )
  }

  render() {
    // $FlowFixMe
    const { classes } = this.props;

    return (
      <BrowserRouter>
        <StudentQuery
          query={ StudentQuery.query }
          // $FlowFixMe
          variables={ { id: cookie.get('studentId') } }
        >
          { ({ data: studentData, loading: studentLoading }) => (
            <React.Fragment>
              <CssBaseline />
              <div className={ classes.root }>
                { cookie.get('token') ? (
                  <AppBar
                    position='absolute'
                    className={ classNames(
                      classes.appBar,
                      cookie.get('token') && this.state.openDrawer && classes.appBarShift
                    ) }
                  >
                    <Toolbar disableGutters={ !this.state.openDrawer } className={ classes.toolbar }>
                      <IconButton
                        color='inherit'
                        aria-label='Open drawer'
                        onClick={ this.handleDrawerOpen }
                        className={ classNames(
                          classes.menuButton,
                          this.state.openDrawer && classes.menuButtonHidden
                        ) }
                      >
                        <Icon>menu</Icon>
                      </IconButton>
                      <Typography variant='title' color='inherit' noWrap className={ classes.title }>
                        IDCRA
                      </Typography>
                      <IconButton
                        color='inherit'
                        aria-label='Open right drawer'
                        onClick={ this.handleRightDrawerOpen }
                        className={ classNames(
                          classes.menuButton,
                          this.state.openRightDrawer && classes.menuButtonHidden
                        ) }
                      >
                        <Icon>more_vert</Icon>
                      </IconButton>
                    </Toolbar>
                  </AppBar>) : null }
                { cookie.get('token') ? (
                  <Drawer
                    anchor={ 'left' }
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
                      <IconButton style={ { color: IDCRA_THEME.TEXT } } onClick={ this.handleDrawerClose }>
                        <Icon>close</Icon>
                      </IconButton>
                    </div>
                    <Divider />
                    <List>{ this.mainListItems() }</List>
                  </Drawer>
                ) : null }
                { cookie.get('token') ? (
                  <Drawer
                    anchor={ 'right' }
                    classes={ {
                      paper: classNames(
                        classes.rightDrawerPaper,
                        !this.state.openRightDrawer && classes.rightDrawerPaperClose
                      ),
                    } }
                    BackdropProps={ { invisible: true } }
                    open={ this.state.openRightDrawer }
                    onClose={ () => this.setState({ openRightDrawer: false }) }
                  >
                    <div className={ classes.toolbarIcon }>
                      <IconButton style={ { color: IDCRA_THEME.TEXT } } onClick={ this.handleRightDrawerClose }>
                        <Icon>close</Icon>
                      </IconButton>
                    </div>
                    <Divider />
                    <List>{ this.rightListItem(studentData) }</List>
                  </Drawer>
                ) : null }
                <main className={ classes.content }>
                  {
                    cookie.get('token') &&
                    <div className={ classes.appBarSpacer } />
                  }
                  <div className={ classes.mainContent }>
                    <Switch>
                      <PrivateRoute path='/' exact component={ HomePage } />
                      <PrivateRoute path='/schools' exact component={ SchoolPage } />
                      <PrivateRoute path='/schools/:schoolID/cost' exact component={ SchoolCostPage } />
                      <PrivateRoute path='/students' exact component={ StudentPage } />
                      <PrivateRoute path='/survey/:studentID' component={ SurveyPage } />
                      <PrivateRoute path='/reports/:studentID' component={ ReportsPage } />
                      <Route path='/login' component={ LoginPage } />
                      <Route path='/register' component={ RegisterPage } />
                    </Switch>
                  </div>
                </main>
              </div>
            </React.Fragment>
          ) }
        </StudentQuery>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(Dashboard);
