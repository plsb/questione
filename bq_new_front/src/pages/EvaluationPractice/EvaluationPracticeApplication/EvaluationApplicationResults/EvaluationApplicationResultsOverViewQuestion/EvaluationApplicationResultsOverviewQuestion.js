import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent, IconButton, Paper,
  Box, Typography, Collapse, Tooltip,
} from '@material-ui/core';
import { Done, Close, ExpandMoreRounded } from "@material-ui/icons";
import ReactHtmlParser from "react-html-parser";
import {withStyles} from "@material-ui/core/styles";

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

const TooltipCustomized = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

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
                        <TooltipCustomized
                            title={
                              <React.Fragment>
                                <span className={classes.percentageRed}>{'De 0% a 29% de acerto'}</span>
                                <span className={classes.percentageOrange}>{'De 30% a 69% de acerto'}</span>
                                <span className={classes.percentageGreen}>{'De 70% a 100% de acerto'}</span>
                              </React.Fragment>
                            }>
                            <Typography variant="button" color="body1" component="p">
                              {result.percentage_correct < 30 ?
                                  <span className={classes.percentageRed}>{'Correto: '+result.percentage_correct+'%'}</span>
                                  : result.percentage_correct < 70 ?
                                      <span className={classes.percentageOrange}>{'Correto: '+result.percentage_correct+'%'}</span>
                                      : <span className={classes.percentageGreen}>{'Correto: '+result.percentage_correct+'%'}</span> }
                            </Typography>
                        </TooltipCustomized>
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
                      <div>
                        <Typography variant="button" color="textSecondary" component="p">
                          {
                            result.idQuestion < 10 ? 'Questão - 00000' + result.idQuestion :
                                result.idQuestion < 100 ? 'Questão - 0000' + result.idQuestion :
                                    result.idQuestion < 1000 ? 'Questão - 000' + result.idQuestion :
                                        result.idQuestion < 10000 ? 'Questão - 00' + result.idQuestion :
                                            result.idQuestion < 100000 ? 'Questão - 0' + result.idQuestion :
                                                result.idQuestion
                          }
                        </Typography>

                        <br />
                      </div>
                      { result.reference != "" && result.reference != null ?
                          <div>
                            <Typography variant="button" color="textSecondary" component="p">
                              Referência:
                            </Typography>
                            <div> { result.reference } </div>
                            <br />
                          </div>
                          : null}
                      { result.skill != null ?
                          <div>
                            <Typography variant="button" color="textSecondary" component="p">
                              Competência:
                            </Typography>
                            <div> { result.skill } </div>
                            <br />
                          </div>
                          : null}
                      { result.objects != null ?
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
                                  { item.ordem }
                                  <Paper className={clsx(classes.paper, classes.paperRight)} elevation={3} variant="outlined">
                                    { ReactHtmlParser ( item.description)  }
                                  </Paper>
                                  <TooltipCustomized
                                      title={
                                        <React.Fragment>
                                          {'Representa o total e a porcentagem de respostas para a alternativa. O cálculo da porcentagem é ' +
                                          'baseado no total de respostas de cada questão. A cor verde na alternativa representa o gabarito, ' +
                                          'a cor vermelha representa um distrator.'}
                                        </React.Fragment>
                                      }>
                                      <Box display="column">
                                          <Typography variant="body2" color="textSecondary" component="p">
                                          { item.total_answer_item > 1 ? item.total_answer_item + ' Respostas.'
                                              : item.total_answer_item + ' Resposta.'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                          {item.percentage_answer + '%'}
                                        </Typography>
                                      </Box>
                                  </TooltipCustomized>
                                </Box>
                              </div>
                              :
                              <div>
                                <Box display="flex"
                                     flexWrap="nowrap">
                                  {item.ordem}
                                  <Paper className={clsx(classes.paper, classes.paperWrong)} variant="outlined">
                                    { ReactHtmlParser(item.description) } </Paper>
                                  <TooltipCustomized
                                      title={
                                        <React.Fragment>
                                          {'Representa o total e a porcentagem de respostas para a alternativa. O cálculo da porcentagem é ' +
                                          'baseado no total de respostas de cada questão. A cor verde na alternativa representa o gabarito, ' +
                                          'a cor vermelha representa um distrator.'}
                                        </React.Fragment>
                                      }>
                                      <Box display="column">
                                        <Typography variant="body2" color="textSecondary" component="p">
                                          { item.total_answer_item > 1 ? item.total_answer_item + ' Respostas.'
                                              : item.total_answer_item + ' Resposta.'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                          {item.percentage_answer + '%'}
                                        </Typography>
                                      </Box>
                                  </TooltipCustomized>
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
