import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent, IconButton, Paper,
  Box, Typography, AppBar, Collapse, Tooltip, Tab, Tabs, Switch, Chip,
} from '@material-ui/core';
import {withStyles} from "@material-ui/core/styles";
import api from "../../../../../services/api";
import {Edit, FormatListBulleted} from "@material-ui/icons";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },
  percentageRed: {
    backgroundColor: '#EC0B43',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  percentageOrange: {
    backgroundColor: '#F5A623',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  percentageGreen: {
    backgroundColor: '#5DE2A5',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  paperWrong: {
    width: '88%',
    backgroundColor: '#ef9a9a',
    color: '#212121',
    margin: 3,
    padding: 8
  },
  paperRight: {
    width: '88%',
    backgroundColor: '#80cbc4',
    color: '#212121',
    margin: 3,
    padding: 8
  },
  checkedCancel: {
    color: '#f44336'
  },
  lineQuestion: {
    marginLeft: 20,
  },
}));


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`nav-tabpanel-${index}`}
          aria-labelledby={`nav-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box p={3}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
      <Tab
          component="a"
          onClick={(event) => {
            event.preventDefault();
          }}
          {...props}
      />
  );
}

const TooltipCustomized = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const EvaluationApplicationResultsSkillObjects = props => {
  const { className, history, result, idApplication, ...rest } = props;
  const [ skills, setSkills ] = useState([]);
  const [ objects, setObjects ] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [ value, setValue] = React.useState(0);

  const classes = useStyles();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  async function findResultsSkill(){
    try {
      const response = await api.get('/evaluation/applications/result-percentage-question-by-skill/'+idApplication);
      if (response.status === 200) {
        setSkills(response.data);
      }
    } catch (error) {

    }
  }

  async function findResultsObjects(){
    try {
      const response = await api.get('/evaluation/applications/result-percentage-question-by-objects/'+idApplication);
      if (response.status === 200) {
        setObjects(response.data);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    findResultsSkill();
    findResultsObjects();
  }, []);



  return (
      <div>
        <Paper className={classes.root}>
          <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChangeTab}
              aria-label="nav tabs example">
            <LinkTab label="Competências" href="#" {...a11yProps(0)} />
            <LinkTab label="Objetos de Conhecimento" href="/#" {...a11yProps(1)} />

          </Tabs>
          <TabPanel value={value} index={0}>
            {skills.map(result => (
                <Card
                    {...rest}
                    className={classes.root}>
                  <CardHeader
                      className={classes.head}
                      avatar={
                        <div>
                          <Typography variant="h4" color="textSecondary" component="h2">
                            {result.description }
                          </Typography>
                          <Typography variant="h6" color="textSecondary" component="h2">
                            {'Curso : '+result.course }
                          </Typography>
                        </div>
                      }
                      action={
                        <div>
                          <TooltipCustomized
                              title={
                                <React.Fragment>
                                  {'O Total de questões representa a quantidade de todas as questões que foram aplicadas na avaliação com a competência '}
                                  <b>{result.description}</b>{' associada.'}
                                </React.Fragment>
                              }>
                            <Typography variant="body2" component="p">
                              {'Total de questões: '+result.total_questions}
                            </Typography>
                          </TooltipCustomized>
                          <TooltipCustomized
                              title={
                                <React.Fragment>
                                  {'O Total de respostas representa a quantidade de todas as respostas cadastradas para todas as questões com a competência '}
                                  <b>{result.description}</b>{' associada.'}
                                </React.Fragment>
                              }>
                            <Typography variant="body2" component="p">
                              {'Total de respostas: '+result.total_answer}
                            </Typography>
                          </TooltipCustomized>

                          <TooltipCustomized
                              title={
                                <React.Fragment>
                                  <span className={classes.percentageRed}>{'De 0% a 29% de acerto'}</span>
                                  <span className={classes.percentageOrange}>{'De 30% a 69% de acerto'}</span>
                                  <span className={classes.percentageGreen}>{'De 70% a 100% de acerto'}</span>
                                </React.Fragment>
                              }>
                            <Typography variant="body2" component="p">
                              {result.percentage_correct < 30 ?
                                  <span className={classes.percentageRed}>{'Correto: '+result.percentage_correct+'%'}</span>
                                  : result.percentage_correct < 70 ?
                                      <span className={classes.percentageOrange}>{'Correto: '+result.percentage_correct+'%'}</span>
                                      : <span className={classes.percentageGreen}>{'Correto: '+result.percentage_correct+'%'}</span> }
                            </Typography>
                          </TooltipCustomized>

                        </div>
                      }/>
                </Card>

            ))}

          </TabPanel>
          <TabPanel value={value} index={1}>
            {objects.map(result => (
                <Card
                    {...rest}
                    className={classes.root}>
                  <CardHeader
                      className={classes.head}
                      avatar={
                        <div>
                          <Typography variant="h4" color="textSecondary" component="h2">
                            {result.description }
                          </Typography>
                          <Typography variant="h6" color="textSecondary" component="h2">
                            {'Curso : '+result.course }
                          </Typography>
                        </div>
                      }
                      action={
                        <div>
                          <TooltipCustomized
                              title={
                                <React.Fragment>
                                  {'O Total de questões representa a quantidade de todas as questões que foram aplicadas na avaliação com o objeto de conhecimento '}
                                  <b>{result.description}</b>{' associado.'}
                                </React.Fragment>
                              }>
                            <Typography variant="body2" component="p">
                              {'Total de questões: '+result.total_questions}
                            </Typography>
                          </TooltipCustomized>
                          <TooltipCustomized
                              title={
                                <React.Fragment>
                                  {'O Total de respostas representa a quantidade de todas as respostas cadastradas para todas as questões com o objeto de conhecimento '}
                                  <b>{result.description}</b>{' associado.'}
                                </React.Fragment>
                              }>
                            <Typography variant="body2" component="p">
                              {'Total de respostas: '+result.total_answer}
                            </Typography>
                          </TooltipCustomized>

                          <TooltipCustomized
                              title={
                                <React.Fragment>
                                  <span className={classes.percentageRed}>{'De 0% a 29% de acerto'}</span>
                                  <span className={classes.percentageOrange}>{'De 30% a 69% de acerto'}</span>
                                  <span className={classes.percentageGreen}>{'De 70% a 100% de acerto'}</span>
                                </React.Fragment>
                              }>
                            <Typography variant="body2" component="p">
                              {result.percentage_correct < 30 ?
                                  <span className={classes.percentageRed}>{'Correto: '+result.percentage_correct+'%'}</span>
                                  : result.percentage_correct < 70 ?
                                      <span className={classes.percentageOrange}>{'Correto: '+result.percentage_correct+'%'}</span>
                                      : <span className={classes.percentageGreen}>{'Correto: '+result.percentage_correct+'%'}</span> }
                            </Typography>
                          </TooltipCustomized>

                        </div>
                      }/>
                </Card>

            ))}

          </TabPanel>


        </Paper>

      </div>
  );
};

EvaluationApplicationResultsSkillObjects.propTypes = {
  className: PropTypes.string,
  idApplication: PropTypes.number,
};

export default EvaluationApplicationResultsSkillObjects;
