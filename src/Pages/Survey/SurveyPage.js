// @flow
import React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment-timezone';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import cookie from 'js-cookie';
import StudentQuery from '../../Queries/StudentQuery';
import DiagnosisAndActionsQuery from '../../Queries/DiagnosisAndActionsQuery';
import CreateSurveyMutation from '../../Mutations/CreateSurveyMutation';
import UserQuery from '../../Queries/UserQuery';
import { IDCRA_THEME } from '../../Constant/constant';

type Questions = Array<{
  question: string,
  low?: string,
  medium?: string,
  high?: string,
}>;

const questions1: Questions = [
  {
    question: 'Apakah anda menyikat gigi 2x sehari?',
    low: 'Ya',
    medium: '1 kali sehari',
    high: 'Tidak sama sekali',
  },
  {
    question: 'Apakah anda menyikat gigi pada setelah sarapan dan sebelum tidur?',
    low: 'Ya',
    medium: 'Tidak',
  },
  {
    question: 'Apakah anda tau cara sikat gigi yang benar?',
    low: 'Ya',
    medium: 'Tidak',
  },
  {
    question: 'Apakah anda menyikat gigi dengan pasta gigi berfluoride?',
    low: 'Ya',
    medium: 'Tidak',
  },
  {
    question: 'Apakah anda suka mengkonsumsi makanan manis dan lengket?',
    low: 'Tidak',
    medium: 'Kadang – kadang',
    high: 'Sering',
  },
  {
    question: 'Apakah Anda rutin kontrol ke dokter gigi 6 bulan sekali?',
    low: 'Ya',
    medium: 'Jika sakit saja',
    high: 'Tidak pernah',
  },
  {
    question: 'Berapa kali dalam sehari mengonsumsi snack?',
    low: 'Tidak pernah',
    medium: '1-3 kali sehari',
    high: 'Lebih dari 3 kali',
  },
];

const questions2: Questions = [
  {
    question: 'Apakah ada gigi yang berlubang di rongga mulut Anda?',
    low: 'Tidak',
    medium: '1-2 lesi',
    high: '>=3 lesi',
  },
  {
    question: 'Apakah ada gigi yang dicabut gara-gara gigi berlubang dalam 3 tahun terakhir?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada plak yang terlihat langsung pada gigi?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Adakah morfologi dan posisi gigi yang memengaruhi kebersihan rongga mulut ?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada tambalan di sela-sela gigi?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada parit gigi yang dalam?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada akar gigi yang terlihat jelas?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada tambalan yang berlebihan sehingga menjadi tempat menumpuknya makanan?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada atau pernah menggunakan alat ortodonsi? (cekat / lepasan)',
    low: 'Tidak',
    medium: 'Ya',
  },
];

const SessionForm = (props: {
  session: number,
  questions: Questions,
  activeQuestion: number,
  onAnswer: (number, string, number) => void,
  onFinish: () => void,
  onClickBack: (number) => void,
}) => (
  <div>
    <Stepper activeStep={ props.activeQuestion } orientation='vertical'>
      { props.questions.map((question, index) => (
        <Step key={ question.question } >
          <StepLabel>{ question.question }</StepLabel>
          <StepContent>
            <FormGroup style={ { paddingLeft: 24, paddingRight: 24 } } row>
              { question.low ? (
                <FormControlLabel
                  control={
                    <Radio
                      onClick={ () => question.low && props.onAnswer(props.session, 'Low', index) }
                      name={ `${question.question}-${question.low}` }
                      aria-label={ question.low }
                      style={ { color: IDCRA_THEME.PRIMARY } }
                    />
                  }
                  label={ question.low }
                />
              ) : null }
              { question.medium ? (
                <FormControlLabel
                  control={
                    <Radio
                      onClick={ () =>
                        question.medium && props.onAnswer(props.session, 'Medium', index)
                      }
                      name={ `${question.question}-${question.medium}` }
                      aria-label={ question.medium }
                      style={ { color: IDCRA_THEME.PRIMARY } }
                    />
                  }
                  label={ question.medium }

                />
              ) : null }
              { question.high ? (
                <FormControlLabel
                  control={
                    <Radio
                      onClick={ () => question.high && props.onAnswer(props.session, 'High', index) }
                      name={ `${question.question}-${question.high}` }
                      aria-label={ question.high }
                      style={ { color: IDCRA_THEME.PRIMARY } }
                    />
                  }
                  label={ question.high }
                />
              ) : null }
            </FormGroup>
          </StepContent>
        </Step>
      )) }
      <Step>
        <StepLabel>Selesai</StepLabel>
        <StepContent>
          <Button variant='contained' onClick={ props.onFinish }>
            Next
          </Button>
        </StepContent>
      </Step>
    </Stepper >
    {/* <Button disabled={ props.session < 1 } variant='contained' onClick={ () => props.onClickBack(props.session) }>Back</Button> */ }
  </div>
);

class SurveyPage extends React.Component<
  {},
  {
    activeSession: number,
    activeQuestion1: number,
    activeQuestion2: number,
    answers: Array<{
      session: number,
      index: number,
      answer: string,
    }>,
    lowerD: number,
    lowerE: number,
    lowerF: number,
    upperD: number,
    upperM: number,
    upperF: number,
    cases: Map<number, string>,
    toothNumberInput: number,
  }
> {
  state = {
    activeSession: 0,
    activeQuestion1: 0,
    activeQuestion2: 0,
    answers: [],
    lowerD: 0,
    lowerE: 0,
    lowerF: 0,
    upperD: 0,
    upperM: 0,
    upperF: 0,
    subjectiveScore: 0,
    cases: (new Map(): Map<number, string>),
    toothNumberInput: 0,
  };
  setInput = (type: 'number' | 'string', statePath: string) => (
    e: SyntheticEvent<HTMLInputElement>
  ) => {
    this.setState({
      [statePath]: type === 'number' ? parseInt(e.currentTarget.value, 10) : e.currentTarget.value,
    });
  };
  answer = (session: number, answer: string, index: number) => {
    const sessionCounterName = `activeQuestion${session}`;
    console.log(this.state);
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.setState(state => ({
          [sessionCounterName]: state[sessionCounterName] + 1,
          answers: [...state.answers, { session, answer, index }],
        }));
      });
    }, 100);
  };

  onClickBack = (session: number) => {
    const sessionCounterName = `activeQuestion${session}`;
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.setState(state => ({
          [sessionCounterName]: state[sessionCounterName] - 1,
        }));
      });
    }, 100);
  }

  removeCase = () => {
    const { cases } = this.state;

    if (cases && cases.size > 0) {
      this.setState(state => {
        let lastKey = [...state.cases.keys()].pop();
        let casesCopy = new Map(state.cases);
        casesCopy.delete(lastKey);
        return (
          {
            cases: casesCopy,
            toothNumberInput: 0,
          }
        )
      });
    }
  }
  renderActiveSession = () => {
    switch (this.state.activeSession) {
      case 0:
      default:
        return (
          <div>
            <Typography>Make sure you are ready to start survey</Typography>
            <Button
              variant='contained'
              onClick={ () => {
                this.setState({ activeSession: 1 });
              } }
            >
              Start Survey
            </Button>
          </div>
        );

      case 1:
        return (
          <SessionForm
            session={ 1 }
            questions={ questions1 }
            activeQuestion={ this.state.activeQuestion1 }
            onAnswer={ this.answer }
            onFinish={ () => {
              this.setState({ activeSession: 2 });
            } }
            onClickBack={ this.onClickBack }
          />
        );

      case 2:
        return (
          <SessionForm
            session={ 2 }
            questions={ questions2 }
            activeQuestion={ this.state.activeQuestion2 }
            onAnswer={ this.answer }
            onFinish={ () => {
              this.setState({ activeSession: 3 });
            } }
            onClickBack={ this.onClickBack }
          />
        );

      case 3:
        return (
          <DiagnosisAndActionsQuery query={ DiagnosisAndActionsQuery.query } variables={ { first: 10 } }>
            { ({ data: DnAData, loading: DnALoading }) => (
              <div style={ { display: 'flex', flexDirection: 'column' } }>
                <div>
                  <div style={ { display: 'flex', justifyContent: 'center', flexDirection: 'column' } }>
                    <Typography variant='title'>DMF-T</Typography>
                    <div style={ { display: 'flex', flexDirection: 'column', padding: 24 } }>
                      <TextField
                        id='d'
                        label='d'
                        type='number'
                        value={ this.state.lowerD }
                        onChange={ this.setInput('number', 'lowerD') }
                        margin='normal'
                      />
                      <TextField
                        id='e'
                        label='e'
                        type='number'
                        value={ this.state.lowerE }
                        onChange={ this.setInput('number', 'lowerE') }
                        margin='normal'
                      />
                      <TextField
                        id='f'
                        label='f'
                        type='number'
                        value={ this.state.lowerF }
                        onChange={ this.setInput('number', 'lowerF') }
                        margin='normal'
                      />
                    </div>
                    <div style={ { display: 'flex', flexDirection: 'column', padding: 24 } }>
                      <TextField
                        id='D'
                        label='D'
                        type='number'
                        value={ this.state.upperD }
                        onChange={ this.setInput('number', 'upperD') }
                        margin='normal'
                      />
                      <TextField
                        id='M'
                        label='M'
                        type='number'
                        value={ this.state.upperM }
                        onChange={ this.setInput('number', 'upperM') }
                        margin='normal'
                      />
                      <TextField
                        id='F'
                        label='F'
                        type='number'
                        value={ this.state.upperF }
                        onChange={ this.setInput('number', 'upperF') }
                        margin='normal'
                      />
                    </div>
                  </div>
                  <div style={ { display: 'flex', justifyContent: 'center', flexDirection: 'column' } }>
                    <Typography variant='title'>Preventive and Curative</Typography>
                    <div style={ { display: 'flex', flexDirection: 'column' } }>
                      { Array.from(this.state.cases.entries()).map(
                        ([toothNumber: number, DnAID: string]) => {
                        return (
                      <div style={ { width: '100%', margin: '0 auto' } }>
                        <div
                          key={ toothNumber }
                          style={ {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'baseline',
                            justifyContent: 'space-evenly',
                          } }
                        >
                          <TextField
                            id={ `tooth-number-${toothNumber}` }
                            label='Tooth Number'
                            value={ toothNumber }
                            type='number'
                            margin='normal'
                            disabled={ toothNumber }
                          />
                          <FormControl style={ { minWidth: 200, margin: 10 } }>
                            <InputLabel htmlFor='diagnosis'>Diagnosis</InputLabel>
                            <Select
                              inputProps={ {
                                name: `diagnosis-${toothNumber}`,
                                id: `diagnosis-${toothNumber}`,
                              } }
                              onChange={ e => {
                                this.setState(state => ({
                                  cases: state.cases.set(toothNumber, e.target.value),
                                }));
                              } }
                              value={ DnAID }
                            >
                              { DnALoading ? (
                                <MenuItem value=''>
                                  <em>Loading..</em>
                                </MenuItem>
                              ) : null }
                              { DnAData &&
                                DnAData.diagnosisAndActions &&
                                DnAData.diagnosisAndActions.edges
                                ? DnAData.diagnosisAndActions.edges.map(edge => {
                                  if (!edge || !edge.node) return null;
                                  const { node } = edge;
                                  return (
                                    <MenuItem key={ node.id } value={ node.id }>
                                      { node.diagnosis }
                                    </MenuItem>
                                  );
                                })
                                : null }
                            </Select>
                          </FormControl>
                        </div>
                        <div
                          style={ {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'baseline',
                            justifyContent: 'space-evenly',
                          } }
                        >
                          <TextField
                            disabled
                            value={ (() => {
                              if (
                                DnAData &&
                                DnAData.diagnosisAndActions &&
                                DnAData.diagnosisAndActions.edges
                              ) {
                                const edge = DnAData.diagnosisAndActions.edges.find(
                                  edge => edge && edge.node && edge.node.id === DnAID
                                );
                                if (edge && edge.node) {
                                  return edge.node.action;
                                }
                              }
                              return 'No Action';
                            })() }
                            id='action'
                            label='Action'
                            margin='normal'
                          />
                          <Button
                            variant='contained'
                            onClick={ this.removeCase }
                          >
                            Remove Case
                          </Button>
                        </div>
                      </div>
                      );
                      }
                    )}

                      <div
                        style={ {
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'baseline',
                          justifyContent: 'space-evenly',
                        } }
                      >
                        <TextField
                          id='init-tooth-number'
                          label='Tooth Number'
                          value={ this.state.toothNumberInput }
                          onChange={ this.setInput('number', 'toothNumberInput') }
                          type='number'
                          margin='normal'
                        />
                        <Button
                          style={ { marginLeft: 10 } }
                          variant='contained'
                          onClick={ () => {
                            this.setState(state => ({
                              cases: state.cases.set(this.state.toothNumberInput, ''),
                              toothNumberInput: 0,
                            }));
                          } }
                          disabled={ this.state.toothNumberInput <= 0 }
                        >
                          Add case
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={ { display: 'flex', justifyContent: 'center' } }>
                  <UserQuery query={ UserQuery.query } variables={ { email: cookie.get('email') || '' } }>
                    { ({ data: userData, loading }) => (
                      <CreateSurveyMutation mutation={ CreateSurveyMutation.mutation }>
                        { (create, { loading: createSurveyLoading }) => (
                          <Button
                            variant='contained'
                            onClick={ () => {
                              const { lowerD, lowerE, lowerF, upperD, upperM, upperF } = this.state;
                              const cases = Array.from(this.state.cases.entries()).map(
                                ([toothNumber: number, diagnosisAndActionId: string]) => ({
                          toothNumber,
                          diagnosisAndActionId,
                                })
                        );
                        const answers1 = this.state.answers
                                .filter(answer => answer.session === 1)
                        .reduce(
                                  (prev, curr) => ({
                          ...prev,
                          [`s1q${curr.index + 1}`]: curr.answer,
                                  }),
                        { }
                        );
                        const answers2 = this.state.answers
                                .filter(answer => answer.session === 2)
                        .reduce(
                                  (prev, curr) => ({
                          ...prev,
                          [`s2q${curr.index + 1}`]: curr.answer,
                                  }),
                        { }
                        );
                        const surveyInput = {
                          ...answers1,
                                ...answers2,
                        // $FlowFixMe
                        studentId: this.props.match.params.studentID,
                        surveyorId: userData && userData.user && userData.user.id,
                        date: moment().format('YYYY-MM-DD'),
                        cases,
                        lowerD,
                        lowerE,
                        lowerF,
                        upperD,
                        upperM,
                        upperF,
                              };
                        create({
                          variables: {
                          survey: surveyInput,
                                },
                              }).then(() => {
                          this.setState({ activeSession: 4 });
                              });
                            }}
                          >
                        { createSurveyLoading ? 'Submitting..' : 'Submit' }
                      </Button>
                    ) }
                  </CreateSurveyMutation>
                    )}
                </UserQuery>
              </div>
              </div>
        )
    }
          </DiagnosisAndActionsQuery >
        );

      case 4:
    return (
      <div>
        <Typography>Done!</Typography>
        <Button
          variant='contained'
          onClick={ () => {
            // $FlowFixMe
            this.props.history.push(`/reports/${this.props.match.params.studentID}`);
          } }
        >
          View Results
        </Button>
      </div>
    );
  }
};
render = () => (
  // $FlowFixMe
  <StudentQuery query={ StudentQuery.query } variables={ { id: this.props.match.params.studentID } }>
    { ({ data: studentData, loading: studentLoading }) => (
      <Paper>
        <Toolbar>
          <Typography variant='title'>
            { studentData && studentData.student && studentData.student.name
              ? studentData.student.name
              : '...' }{ ' ' }
            is taking a survey
          </Typography>
        </Toolbar>
        <Stepper activeStep={ this.state.activeSession } orientation='horizontal' style={ { overflowX: 'auto' } }>
          <Step onClick={ () => this.setState({ activeSession: 1 }) }>
            <StepLabel>Get Ready!</StepLabel>
          </Step>
          <Step onClick={ () => this.setState({ activeSession: 2 }) }>
            <StepLabel>Contributing Conditions</StepLabel>
          </Step>
          <Step onClick={ () => this.setState({ activeSession: 3 }) }>
            <StepLabel>Clinical Conditions</StepLabel>
          </Step>
          <Step onClick={ () => this.setState({ activeSession: 4 }) }>
            <StepLabel>Assessment</StepLabel>
          </Step>
          <Step onClick={ () => this.setState({ activeSession: 5 }) }>
            <StepLabel>Result</StepLabel>
          </Step>
        </Stepper>
        <div style={ { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 } }>
          { this.renderActiveSession() }
        </div>
      </Paper>
    ) }
  </StudentQuery >
);
}

export default withRouter(SurveyPage);
