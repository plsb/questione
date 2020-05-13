import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent, IconButton, Paper,
  Box, Typography, AppBar, Collapse,
} from '@material-ui/core';
import { Done, Close, ExpandMoreRounded } from "@material-ui/icons";
import ReactHtmlParser from "react-html-parser";
import api from "../../../../../services/api";

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

const EvaluationApplicationResultsOverviewQuestion = props => {
  const { className, history, result, numberQuestion, ...rest } = props;
  const [ answerStudents, setAnswerStudents ] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);

  const classes = useStyles();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  useEffect(() => {

  }, [cancel]);


  return (
      <div>
            <div>
              <Card className={classes.root}>
                <CardHeader
                    action={
                      <div>
                        <Typography variant="button" color="body1" component="p">
                          Total de Repostas: {result.total_asnwer}
                        </Typography>
                        <Typography variant="button" color="body1" component="p">
                          {result.percentage_correct < 30 ?
                              <span className={classes.percentageRed}>{'Correto: '+result.percentage_correct+'%'}</span>
                              : result.percentage_correct < 70 ?
                                  <span className={classes.percentageOrange}>{'Correto: '+result.percentage_correct+'%'}</span>
                                  : <span className={classes.percentageGreen}>{'Correto: '+result.percentage_correct+'%'}</span> }
                        </Typography>
                        <IconButton
                            className={clsx(classes.expand, {
                              [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more">
                          <ExpandMoreRounded />
                        </IconButton>
                      </div>
                    }
                    title={ 'Questão ' + (numberQuestion+1)}/>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <div className={classes.lineQuestion}>
                      { result.reference != "" && result.reference != null ?
                          <div>
                            <Typography variant="button" color="textSecondary" component="p">
                              Referência:
                            </Typography>
                            <div> { result.reference } </div>
                            <br />
                          </div>
                          : null}
                      { result.profile.length != 0 ?
                          <div>
                            <Typography variant="button" color="textSecondary" component="p">
                              Perfil:
                            </Typography>
                            <div> { result.profile } </div>
                            <br />
                          </div>
                          : null}
                      { result.skill != 0 ?
                          <div>
                            <Typography variant="button" color="textSecondary" component="p">
                              Competência:
                            </Typography>
                            <div> { result.skill } </div>
                            <br />
                          </div>
                          : null}
                      { result.objects != 0 ?
                          <div>
                            <Typography variant="button" color="textSecondary" component="p">
                              Objeto(s) de Conhecimento:
                            </Typography>
                            {result.objects.map(item => (
                                <div> { ReactHtmlParser (item.description) } </div>
                            ))}
                            <br />
                          </div>
                          : null}

                      <Typography variant="button" color="textSecondary" component="p">
                        Texto base:
                      </Typography>
                      <div> { ReactHtmlParser (result.base_text) } </div>

                      <Typography variant="button" color="textSecondary" component="p">
                        Enunciado:
                      </Typography>
                      <div> { ReactHtmlParser (result.stem) } </div>

                      <Typography variant="button" color="textSecondary" component="p">
                        Alternativas:
                      </Typography>
                      <br />

                      {result.itens.map(item => (
                          item.correct == 1 ?
                              <div>
                                <Box display="flex"
                                     flexWrap="nowrap">
                                  <Paper className={clsx(classes.paper, classes.paperRight)} elevation={3} variant="outlined">
                                    { ReactHtmlParser (item.description)  }
                                  </Paper>
                                  <Box display="column">
                                      <Typography variant="body2" color="textSecondary" component="p">
                                      { item.total_answer_item > 1 ? item.total_answer_item + ' Respostas.'
                                          : item.total_answer_item + ' Resposta.'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                      {item.percentage_answer + '%'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </div>
                              :
                              <div>
                                <Box display="flex"
                                     flexWrap="nowrap">
                                  <Paper className={clsx(classes.paper, classes.paperWrong)} variant="outlined">
                                    { ReactHtmlParser (item.description) } </Paper>
                                  <Box display="column">
                                    <Typography variant="body2" color="textSecondary" component="p">
                                      { item.total_answer_item > 1 ? item.total_answer_item + ' Respostas.'
                                          : item.total_answer_item + ' Resposta.'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                      {item.percentage_answer + '%'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </div>
                      ))}
                    </div>

                  </CardContent>
                </Collapse>
              </Card>
            </div>
      </div>
  );
};

EvaluationApplicationResultsOverviewQuestion.propTypes = {
  className: PropTypes.string,
  result: PropTypes.object,
  numberQuestion: PropTypes.number,
};

export default EvaluationApplicationResultsOverviewQuestion;
