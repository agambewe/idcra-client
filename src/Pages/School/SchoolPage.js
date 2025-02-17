// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import moment from 'moment-timezone';
import SchoolsQuery from '../../Queries/SchoolQuery';
import linkState from 'linkstate';
import CreateSchoolMutation from '../../Mutations/CreateSchoolMutation';
import { Tooltip } from '@material-ui/core';
import { API_URL, IDCRA_THEME } from '../../Constant/constant';
import { questions1, questions2 } from '../../Data/questions';
import axios from 'axios';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class SchoolPage extends React.Component<
  {},
  {
    newSchoolName: string,
  }
> {
  state = {
    newSchoolName: '',
  };
  handleDownloadSchoolsZip = id => {
    console.log(id);
    window.open(`${API_URL}/reports/school/` + id);
  };
  handleDownloadSurveysZip = id => {
    console.log(id);
    const question1List = questions1.map((q) => {
      let list = {};
      const question = q.question;
      let answer = {};
      if (q.low) answer.low = q.low;
      if (q.medium) answer.medium = q.medium;
      if (q.high) answer.high = q.high;
      list = { question, answer };

      return list;
    })
    const question2List = questions2.map((q) => {
      let list = {};
      const question = q.question;
      let answer = {};
      if (q.low) answer.low = q.low;
      if (q.medium) answer.medium = q.medium;
      if (q.high) answer.high = q.high;
      list = { question, answer };

      return list;
    })
    const questionsLists = JSON.stringify({ school_id: id, questions: [...question1List, ...question2List] });

    axios.post(API_URL + '/reports/surveys/school/', questionsLists, {
      headers: {
      }
    })
      .then((response) => {
        window.open(`${API_URL}/reports/surveys/school/` + id);
        console.log(response);
      }, (error) => {
        console.log(error);
      });
  };
  render = () => {
    // $FlowFixMe
    const { classes } = this.props;
    return (
      <SchoolsQuery query={ SchoolsQuery.query } variables={ { first: 30 } }>
        { ({ data: schoolsData, loading: schoolsLoading, refetch: refetchSchools }) => (
          <div>
            <CreateSchoolMutation mutation={ CreateSchoolMutation.mutation }>
              { (create, { loading: creatingSchool }) => (
                <Paper style={ { padding: 20, backgroundColor: IDCRA_THEME.CARD_TITLE } }>
                  <Typography style={ { margin: '10 0' } } variant='title' id='tableTitle'>
                    New School
                  </Typography>
                  <FormControl>
                    <InputLabel htmlFor='name-simple'>New School Name</InputLabel>
                    <Input id='name-simple' onChange={ linkState(this, 'newSchoolName') } />
                  </FormControl>
                  <Button
                    variant='contained'
                    style={ { marginLeft: 20 } }
                    disabled={ this.state.newSchoolName.length === 0 }
                    onClick={ (e: SyntheticEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      create({ variables: { name: this.state.newSchoolName } }).then(() => {
                        this.setState({ newSchoolName: '' });
                        refetchSchools();
                      });
                    } }
                  >
                    { creatingSchool ? 'Creating...' : 'Create' }
                  </Button>
                </Paper>
              ) }
            </CreateSchoolMutation>

            <Paper className={ classes.root }>
              <Toolbar>
                <Typography variant='title' id='tableTitle'>
                  Schools
                </Typography>
              </Toolbar>
              <List>
                { schoolsData &&
                  schoolsData.schools &&
                  schoolsData.schools.edges &&
                  schoolsData.schools.edges.length ? (
                  schoolsData.schools.edges.map((edge, i) => {
                    if (!edge || !edge.node) return null;
                    const { node } = edge;
                    return (
                      <ListItem key={ i }>
                        <ListItemText
                          primary={ node.name }
                          secondary={ moment(node.createdAt).format('D MMMM YYYY') }
                        />
                        <ListItemSecondaryAction>
                          <Link to={ `/schools/${node.id}/cost` }>
                            <IconButton aria-label='Cost'>
                              <Tooltip title='Cost'>
                                <Icon>monetization_on</Icon>
                              </Tooltip>
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={ (e: SyntheticEvent<HTMLButtonElement>) => {
                              this.handleDownloadSchoolsZip(node.id);
                            } } aria-label='Download Schools Zip'>
                            <Tooltip title='Download Schools Zip'>
                              <Icon>download</Icon>
                            </Tooltip>
                          </IconButton>
                          <IconButton
                            onClick={ (e: SyntheticEvent<HTMLButtonElement>) => {
                              this.handleDownloadSurveysZip(node.id);
                            } } aria-label='Download Surveys Zip'>
                            <Tooltip title='Download Surveys Zip'>
                              <Icon>assignment_returned</Icon>
                            </Tooltip>
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })
                ) : (
                  <ListItem>
                    <ListItemText primary={ 'There is no school' } />
                  </ListItem>
                ) }
              </List>
            </Paper>
          </div>
        )
        }
      </SchoolsQuery>
    );
  };
}

export default withStyles(styles)(SchoolPage);
