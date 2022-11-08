// @flow
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment-timezone';
import debounce from 'debounce';
import linkState from 'linkstate';
import cookie from 'js-cookie';
import { ROLES, SNACKBAR } from '../../Constant/constant';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
  Select,
  FormHelperText,
  MenuItem,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core/';
import SchoolsQuery from '../../Queries/SchoolQuery';
import StudentsQuery from '../../Queries/StudentsQuery';
import UserQuery from '../../Queries/UserQuery';
import CreateStudentMutation from '../../Mutations/CreateStudentMutation';
import ParentHasStudentMutation from '../../Mutations/ParentHasStudentMutation';
import CustomSnackbar from '../../Common/Snackbar';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class StudentPage extends React.Component<
  {},
  {
    activeSchoolId: string,
    name: string,
    dateOfBirth: string,
    searchStudentName: string,
  }
> {
  state = {
    activeSchoolId: '',
    name: '',
    dateOfBirth: '',
    searchStudentName: '',
    openDialog: false,
    selectedStudent: {
      id: null,
      name: '',
    },
    inlineMessage: {
      show: false,
      message: '',
    }
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  }

  resetSnackbar = () => {
    const inlineMessage = {
      show: false,
      message: ''
    };

    this.setState({ inlineMessage });
  }

  renderStudentsData = (studentsData) => {
    const data = [];
    const mappedStudents = studentsData.students.edges.map((edge, i) => {
      if (!edge || !edge.node) return null;

      const { node } = edge;
      let disableAddChildButton = false;
      const studentId = cookie.get('studentId');

      if (studentId) disableAddChildButton = true;

      return (
        <ListItem key={ i }>
          <ListItemText
            primary={ node.name }
            secondary={ moment(node.dateOfBirth).format('D MMMM YYYY') }
          />
          <ListItemSecondaryAction>
            { cookie.get('role') !== ROLES.PARENT ?
              <div>
                <Link to={ `/survey/${node.id}` }>
                  <IconButton aria-label='Take Survey'>
                    <Icon>format_list_numbered</Icon>
                  </IconButton>
                </Link>
                <Link to={ `/reports/${node.id}` }>
                  <IconButton aria-label='Report'>
                    <Icon>bar_chart</Icon>
                  </IconButton>
                </Link>
              </div> :
              <span>
                <IconButton
                  disabled={ disableAddChildButton }
                  onClick={
                    () => {
                      const selectedStudent = { name: node.name, id: node.id };
                      this.setState({ openDialog: true, selectedStudent })
                    }
                  } aria-label='Add Child'>
                  <Icon>add_circle</Icon>
                </IconButton>
              </span> }
          </ListItemSecondaryAction>
        </ListItem >
      );
    });

    data.push(mappedStudents);

    return data;
  }

  render = () => {
    // $FlowFixMe
    const { classes } = this.props;
    const isDateInputError =
      this.state.dateOfBirth.length &&
      !moment(this.state.dateOfBirth, 'DD-MM-YYYY', true).isValid();
    return (
      <SchoolsQuery query={ SchoolsQuery.query } variables={ { first: 30 } }>
        { ({ data: schoolsData, loading: schoolsLoading, refetch: refetchSchools }) => (
          <StudentsQuery
            skip={ !this.state.activeSchoolId }
            query={ StudentsQuery.query }
            variables={ {
              first: 30,
              schoolID: this.state.activeSchoolId,
              keyword: this.state.searchStudentName,
            } }
          >
            { ({ data: studentsData, refetch: refetchStudents }) => (
              <div>
                <CreateStudentMutation mutation={ CreateStudentMutation.mutation }>
                  { (create, { loading: createStudentLoading }) => (
                    <Paper style={ { padding: 15 } }>
                      {
                        this.state.inlineMessage.message &&
                        <CustomSnackbar
                          open={ this.state.inlineMessage.show }
                          close={ this.resetSnackbar }
                          contentStyle={ {
                            backgroundColor: SNACKBAR.ERROR,
                            width: '100%',
                            borderRadius: '4px',
                          } }
                          message={ this.state.inlineMessage.message }

                        />
                      }
                      <Typography style={ { margin: 10 } } variant='title' id='tableTitle'>
                        School
                      </Typography>
                      <FormControl style={ { minWidth: 200, margin: 10 } }>
                        <InputLabel htmlFor='school'>School Name</InputLabel>
                        <Select
                          onChange={ e => {
                            this.setState({ activeSchoolId: e.target.value });
                          } }
                          value={ this.state.activeSchoolId }
                          inputProps={ {
                            name: 'school',
                            id: 'school',
                          } }
                        >
                          { schoolsLoading ? (
                            <MenuItem value=''>
                              <em>Loading schools..</em>
                            </MenuItem>
                          ) : null }
                          { schoolsData && schoolsData.schools && schoolsData.schools.edges
                            ? schoolsData.schools.edges.map(edge => {
                              if (!edge || !edge.node) return null;
                              return (
                                <MenuItem key={ edge.node.id } value={ edge.node.id }>
                                  { edge.node.name }
                                </MenuItem>
                              );
                            })
                            : null }
                        </Select>
                      </FormControl>
                      { cookie.get('role') !== ROLES.PARENT &&
                        <React.Fragment>
                          <Typography style={ { margin: 10 } } variant='title' id='tableTitle'>
                            New student at this School
                          </Typography>

                          <form display={ { display: 'flex', flexWrap: 'wrap' } }>
                            <FormControl style={ { margin: 10 } } disabled={ !this.state.activeSchoolId }>
                              <InputLabel htmlFor='student-name'>Name</InputLabel>
                              <Input
                                value={ this.state.name }
                                id='student-name'
                                onChange={ linkState(this, 'name') }
                              />
                            </FormControl>
                            <FormControl
                              style={ { margin: 10 } }
                              error={ isDateInputError }
                              disabled={ !this.state.activeSchoolId }
                            >
                              <InputLabel htmlFor='student-dob'>Date of Birth</InputLabel>
                              <Input
                                value={ this.state.dateOfBirth }
                                id='student-dob'
                                onChange={ linkState(this, 'dateOfBirth') }
                              />
                              <FormHelperText>DD-MM-YYYY</FormHelperText>
                            </FormControl>
                            <Button
                              variant='contained'
                              style={ { marginLeft: 20 } }
                              disabled={
                                !this.state.activeSchoolId ||
                                !this.state.name ||
                                !this.state.dateOfBirth ||
                                isDateInputError
                              }
                              onClick={ (e: SyntheticEvent<HTMLButtonElement>) => {
                                e.preventDefault();
                                create({
                                  variables: {
                                    name: this.state.name,
                                    schoolID: this.state.activeSchoolId,
                                    dateOfBirth: moment(this.state.dateOfBirth, 'DD-MM-YYYY').format(
                                      'YYYY-MM-DD'
                                    ),
                                  },
                                }).then(() => {
                                  this.setState({ name: '', dateOfBirth: '' });
                                  refetchStudents();
                                });
                              } }
                            >
                              { createStudentLoading ? 'CREATING...' : 'CREATE' }
                            </Button>
                          </form>
                        </React.Fragment>
                      }
                    </Paper>
                  ) }
                </CreateStudentMutation>
                <Paper className={ classes.root }>
                  <Toolbar
                    style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }
                  >
                    <Typography variant='title' id='tableTitle'>
                      Students
                    </Typography>
                    <FormControl disabled={ !this.state.activeSchoolId }>
                      <InputLabel htmlFor='search-student-name'>Search Student Name</InputLabel>
                      <Input
                        id='search-student-name'
                        onChange={ debounce(linkState(this, 'searchStudentName'), 200, true) }
                      />
                    </FormControl>
                  </Toolbar>

                  <List>
                    { studentsData && studentsData.students ?
                      this.renderStudentsData(studentsData) :
                      (
                        <ListItem>
                          <ListItemText primary={ 'There is no student in this school' } />
                        </ListItem>
                      )
                    }
                  </List>
                  <UserQuery query={ UserQuery.query } variables={ { email: cookie.get('email') } }>
                    { ({ data: userData, loading: userLoading, refetch: refetchUser }) => (
                      <ParentHasStudentMutation mutation={ ParentHasStudentMutation.mutation }>
                        { (addStudent, { loading: addParentHasStudentLoading }) => (
                          <Dialog
                            open={ this.state.openDialog }
                            onClose={ this.handleCloseDialog }
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                          >
                            <DialogTitle id='alert-dialog-title'>{ 'Add Child' }</DialogTitle>
                            <DialogContent>
                              <DialogContentText id='alert-dialog-description'>
                                Are you sure you want to add <b>{ this.state.selectedStudent.name }</b> as your child? <br />
                                You can only set your child's data once.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={ this.handleCloseDialog }>
                                CANCEL
                              </Button>
                              <Button onClick={
                                () => {
                                  const userId = userData.user.id || null;
                                  const studentId = this.state.selectedStudent.id || null;
                                  if (userId && studentId) {
                                    addStudent({
                                      variables: {
                                        userId: userId,
                                        studentId: studentId
                                      },
                                    }).then(() => {
                                      this.props.history.push(`/reports/${studentId}`);
                                    }).catch((err) => {
                                      if (err.message) {
                                        const inlineMessage = {
                                          show: true,
                                          message: 'There is something wrong, please try again!'
                                        };
                                        this.handleCloseDialog();
                                        this.setState({ inlineMessage });
                                      }
                                    });
                                  }
                                }
                              } autoFocus>
                                ADD
                              </Button>
                            </DialogActions>
                          </Dialog>
                        ) }
                      </ParentHasStudentMutation>
                    ) }
                  </UserQuery>
                </Paper>
              </div>
            ) }
          </StudentsQuery>
        ) }
      </SchoolsQuery>
    );
  };
}

export default withRouter(withStyles(styles)(StudentPage));
