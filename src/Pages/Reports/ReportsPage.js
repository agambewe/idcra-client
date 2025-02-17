// @flow
import React from 'react';
import {
  Paper,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Icon,
  IconButton,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import { API_URL } from '../../Constant/constant';
import { Value } from 'react-values';
import {
  BarChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
  Label,
} from 'recharts';
import ReportsQuery from '../../Queries/ReportsQuery';
import StudentQuery from '../../Queries/StudentQuery';

type Output = {
  parent: {
    reminder: string[],
    guidance: string[],
    supervision: string[],
  },
  teacher: {
    reminder: string[],
    guidance: string[],
  },
  operator: {
    recurring: string,
    fluoride: string,
    diet: string,
    sealant: string,
    ART: string,
  },
};

const lowOutput: Output = {
  parent: {
    reminder: ['Orang tua mengingatkan agar kontrol ke dokter gigi setiap 6 bulan sekali'],
    guidance: [
      'Orang tua mengajarkan cara menyikat gigi yang benar',
      'Orang tua mengingatkan agar menyikat gigi 2x sehari dengan pasta gigi ber fluoride',
    ],
    supervision: [
      'Orang tua memberikan pengawasan terhadap makanan manis dan lengket yang dikonsumsi sehari - hari',
    ],
  },
  teacher: {
    reminder: ['Guru mengingatkan agar kontrol ke dokter gigi setiap 6 bulan sekali'],
    guidance: [
      'Guru mengajarkan cara menyikat gigi yang benar',
      'Guru mengingatkan agar menyikat gigi 2x sehari dengan pasta gigi ber fluoride',
    ],
  },
  operator: {
    recurring: 'setiap 6-12 bulan',
    fluoride: 'pasta gigi 2x sehari',
    diet: 'pemeliharaan asupan diet',
    sealant: 'fissure sealant dilakukan jika diperlukan',
    ART: 'pengawasan karies baru',
  },
};

const mediumOutput: Output = {
  parent: {
    reminder: ['Orang tua mengingatkan agar kontrol ke dokter gigi setiap 4-6 bulan sekali'],
    guidance: [
      'Orang tua mengajarkan cara menyikat gigi yang benar',
      'Orang tua mengingatkan agar menyikat gigi 2x sehari dengan pasta gigi ber fluoride',
      'Orang tua mengingatkan agar dilakukan perawatan topical aplikasi fluoride',
    ],
    supervision: [
      'Orang tua melakukan diet makanan manis dan lengket yang dikonsumsi sehari- hari',
    ],
  },
  teacher: {
    reminder: ['Guru mengingatkan agar kontrol ke dokter gigi setiap 4-6 bulan sekali'],
    guidance: [
      'Guru mengajarkan cara menyikat gigi yang benar',
      'Guru mengingatkan agar menyikat gigi 2x sehari dengan pasta gigi ber fluoride',
      'Guru mengingatkan agar dilakukan perawatan topical aplikasi fluoride',
    ],
  },
  operator: {
    recurring: 'setiap 4-6 bulan',
    fluoride: 'pasta gigi 2x sehari + Topikal aplikasi',
    diet: 'diet dengan pengawasan',
    sealant: 'fissure sealant dilakukan jika diperlukan',
    ART: 'pengawasan karies baru + restorasi dari kavitas baru',
  },
};

const highOutput: Output = {
  parent: {
    reminder: ['Orang tua mengingatkan agar kontrol ke dokter gigi setiap 3-4 bulan sekali'],
    guidance: [
      'Orang tua mengajarkan cara menyikat gigi yang benar',
      'Orang tua mengingatkan agar menyikat gigi 2x sehari dengan pasta gigi ber fluoride',
      'Orang tua mengingatkan agar dilakukan perawatan topical aplikasi fluoride',
    ],
    supervision: [
      'Orang tua melakukan diet makanan manis dan lengket yang dikonsumsi sehari- hari',
      'Orang tua mengganti konsumsi permen yang manis dengan permen xylitol',
    ],
  },
  teacher: {
    reminder: ['Guru mengingatkan agar kontrol ke dokter gigi setiap 3-4 bulan sekali'],
    guidance: [
      'Guru mengajarkan cara menyikat gigi yang benar',
      'Guru mengingatkan agar menyikat gigi 2x sehari dengan pasta gigi ber fluoride',
      'Guru mengingatkan agar dilakukan perawatan topical aplikasi fluoride',
    ],
  },
  operator: {
    recurring: 'setiap 3-4 bulan',
    fluoride: 'topikal aplikasi + pasta gigi 2x sehari',
    diet: 'diet dengan pengawasan + xylitol',
    sealant: 'direkomendasikan fissure sealant',
    ART: 'pengawasan karies baru + restorasi dari kavitas baru',
  },
};

const outputMap: Map<string, Output> = new Map([
  ['low', lowOutput],
  ['medium', mediumOutput],
  ['high', highOutput],
]);

const styles = theme => ({
  dataContainer: {
    padding: '10px',
    backgroundColor: 'white',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  },
  rowCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  }
});

class ReportsPage extends React.Component<{}> {
  handleDownloadPDF = id => {
    console.log(id);
    window.open(`${API_URL}/reports/surveys/` + id + '.pdf');
  };

  render = () => (
    <StudentQuery
      query={ StudentQuery.query }
      // $FlowFixMe
      variables={ { id: this.props.match.params.studentID } }
    >
      { ({ data: studentData, loading: studentLoading }) => (
        <ReportsQuery
          query={ ReportsQuery.query }
          // $FlowFixMe
          variables={ { studentID: this.props.match.params.studentID } }
        >
          { ({ data: surveysData, loading: surveysLoading }) => (
            <div>
              <Paper style={ { marginBottom: 20 } }>
                <Toolbar>
                  <Typography variant='title'>
                    { studentData && studentData.student && studentData.student.name
                      ? studentData.student.name
                      : '...' }{ ' ' }
                    Reports
                  </Typography>
                </Toolbar>
              </Paper>
              { surveysData && surveysData.surveys && surveysData.surveys.edges
                ? surveysData.surveys.edges.map(edge => {
                  if (!edge || !edge.node) return null;
                  let risk: 'low' | 'medium' | 'high' = 'low';
                  if (edge.node.subjectiveScore > 66) risk = 'high';
                  if (edge.node.subjectiveScore > 33 && edge.node.subjectiveScore <= 66)
                    risk = 'medium';
                  const output = outputMap.get(risk);
                  return (
                    <ExpansionPanel key={ edge.cursor } style={ { marginBottom: 20, borderRadius: '4px' } } expandIcon={ <span>Test</span> }>
                      <ExpansionPanelSummary>
                        <Typography variant='title' style={ { flexGrow: 1 } }>
                          { moment(edge.node.createdAt).format('D MMMM YYYY') }
                        </Typography>
                        <div>
                          <IconButton
                            onClick={ (e: SyntheticEvent<HTMLButtonElement>) => {
                              this.handleDownloadPDF(edge.node.id);
                            } } aria-label='Download PDF'>
                            <Icon>download</Icon>
                          </IconButton>
                        </div>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div className={ this.props.classes.cardContainer }>
                          <div className={ this.props.classes.rowCardContainer }>
                            <Paper className={ this.props.classes.dataContainer }>
                              <BarChart
                                width={ 280 }
                                height={ 280 }
                                data={ [
                                  {
                                    name: 'Risk',
                                    value: edge.node.subjectiveScore,
                                    label: `${edge.node.subjectiveScore}%`,
                                  },
                                ] }
                              >
                                <XAxis dataKey='name'>
                                  <Label
                                    value='Subjective Caries Assessment'
                                    offset={ -2 }
                                    position='insideBottom'
                                  />
                                </XAxis>
                                <YAxis
                                  type='number'
                                  unit='%'
                                  ticks={ [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }
                                />
                                <Tooltip />
                                <Bar
                                  dataKey='value'
                                  fill={ (() => {
                                    if (risk === 'low') return 'green';
                                    if (risk === 'medium') return 'orange';
                                    return 'red';
                                  })() }
                                >
                                  <LabelList dataKey='label' position='top' />
                                </Bar>
                              </BarChart>
                            </Paper>
                            <br />
                            <Paper className={ this.props.classes.dataContainer }>
                              <BarChart
                                width={ 280 }
                                height={ 280 }
                                data={ [
                                  {
                                    name: 'D',
                                    value: edge.node.upperD,
                                  },
                                  {
                                    name: 'M',
                                    value: edge.node.upperM,
                                  },
                                  {
                                    name: 'F',
                                    value: edge.node.upperF,
                                  },
                                ] }
                              >
                                <XAxis dataKey='name'>
                                  <Label
                                    value='Objective Caries Assessment'
                                    offset={ -2 }
                                    position='insideBottom'
                                  />
                                </XAxis>
                                <YAxis type='number' />
                                <Tooltip />
                                <Bar dataKey='value' fill='red'>
                                  <LabelList position='top' />
                                </Bar>
                              </BarChart>
                            </Paper>
                          </div>
                          <br />

                          { output ? (
                            <div style={ { padding: 24 } }>
                              <div className={ this.props.classes.rowCardContainer }>
                                <Paper className={ this.props.classes.dataContainer }>
                                  <Typography variant='headline'>Operator's Suggestions</Typography>
                                  <ul>
                                    { Object.keys(output.operator).map(key => (
                                      <li>
                                        <Typography>
                                          { key.toUpperCase() }: { output.operator[key] }
                                        </Typography>
                                      </li>
                                    )) }
                                  </ul>
                                </Paper>
                                <br />
                                <Paper className={ this.props.classes.dataContainer }>
                                  <Typography variant='headline'>Parent's Suggestions</Typography>
                                  <Value defaultValue={ 0 }>
                                    { ({ value, set }) => (
                                      <div>
                                        <Tabs
                                          value={ value }
                                          onChange={ (_, index) => {
                                            set(index);
                                          } }
                                          centered
                                          indicatorColor='primary'
                                          textColor='primary'
                                        >
                                          <Tab label='reminder' />
                                          <Tab label='guidance' />
                                          <Tab label='supervision' />
                                        </Tabs>
                                        <div style={ { display: 'flex', justifyContent: 'center' } }>
                                          { value === 0 ? (
                                            <ul>
                                              { output.parent.reminder.map(reminder => (
                                                <li key={ reminder }>
                                                  <Typography>{ reminder }</Typography>
                                                </li>
                                              )) }
                                            </ul>
                                          ) : null }
                                          { value === 1 ? (
                                            <ul>
                                              { output.parent.guidance.map(guidance => (
                                                <li key={ guidance }>
                                                  <Typography>{ guidance }</Typography>
                                                </li>
                                              )) }
                                            </ul>
                                          ) : null }
                                          { value === 2 ? (
                                            <ul>
                                              { output.parent.supervision.map(supervision => (
                                                <li key={ supervision }>
                                                  <Typography>{ supervision }</Typography>
                                                </li>
                                              )) }
                                            </ul>
                                          ) : null }
                                        </div>
                                      </div>
                                    ) }
                                  </Value>
                                  <Typography variant='headline'>Teacher's Suggestions</Typography>
                                  <Value defaultValue={ 0 }>
                                    { ({ value, set }) => (
                                      <div>
                                        <Tabs
                                          value={ value }
                                          onChange={ (_, index) => {
                                            set(index);
                                          } }
                                          centered
                                          indicatorColor='primary'
                                          textColor='primary'
                                        >
                                          <Tab label='reminder' />
                                          <Tab label='guidance' />
                                        </Tabs>
                                        <div style={ { display: 'flex', justifyContent: 'center' } }>
                                          { value === 0 ? (
                                            <ul>
                                              { output.teacher.reminder.map(reminder => (
                                                <li key={ reminder }>
                                                  <Typography>{ reminder }</Typography>
                                                </li>
                                              )) }
                                            </ul>
                                          ) : null }
                                          { value === 1 ? (
                                            <ul>
                                              { output.teacher.guidance.map(guidance => (
                                                <li key={ guidance }>
                                                  <Typography>{ guidance }</Typography>
                                                </li>
                                              )) }
                                            </ul>
                                          ) : null }
                                        </div>
                                      </div>
                                    ) }
                                  </Value>
                                </Paper>
                              </div>
                            </div>
                          ) : null }
                          <br />
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                })
                : null }
              { surveysData && surveysData.surveys && surveysData.surveys.edges ? (
                <Paper>
                  <Toolbar>
                    <Typography variant='title'>Caries Risk Progress</Typography>
                  </Toolbar>
                  <LineChart
                    width={ 280 }
                    height={ 280 }
                    data={ surveysData.surveys.edges.map(edge => ({
                      name: moment(edge.node.createdAt).format('D-MM-YYYY'),
                      value: edge.node.subjectiveScore,
                    })) }
                  >
                    <XAxis dataKey='name'>
                      <Label value='Date' offset={ -2 } position='insideBottom' />
                    </XAxis>
                    <YAxis
                      reversed
                      type='number'
                      unit='%'
                      ticks={ [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }
                    />
                    <Tooltip />
                    <Line dataKey='value' fill='red'>
                      <LabelList position='top' />
                    </Line>
                  </LineChart>
                  <br />
                </Paper>
              ) : null }
            </div>
          ) }
        </ReportsQuery>
      )
      }
    </StudentQuery >
  );
}

export default withStyles(styles)(ReportsPage);
