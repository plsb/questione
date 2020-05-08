import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Tooltip
} from '@material-ui/core';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PerfectScrollbar from "react-perfect-scrollbar";
import { Done, Close } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {},
  headStudent: {
    width: '200px',
    height: '40px',
    backgroundColor: '#FFF',
    color: '#393A68',
    paddingLeft: '12px',
    boxSizing: 'border-box',
    border: '1px solid #f2f2f2',
    lineHeight: '40px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial'
  },
  bodyStudent: {
    width: '200px',
    height: '30px',
    backgroundColor: '#FFF',
    color: '#393A68',
    paddingLeft: '12px',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    border: '1px solid #f2f2f2',
    lineHeight: '20px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial'
  },
  headQuestion: {
    width: '90.0px',
    backgroundColor: '#FFF',
    display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '80px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
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
  answerCorrect: {
    width: '90.0px',
    backgroundColor: '#5DE2A5',
    display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '60px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  answerIncorrect: {
    width: '90.0px',
    backgroundColor: '#F14D76',
    display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '60px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  bodyPercentage: {
    width: '50',
    height: '30px',
    textAlign: 'center',
    backgroundColor: '#FFF',
    color: '#393A68',
    paddingLeft: '12px',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    border: '1px solid #f2f2f2',
    lineHeight: '20px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial'
  }
}));

const EvaluationApplicationResults = props => {
  const { className, history, ...rest } = props;
  const { idApplication } = props.match.params;
  const [ answerStudents, setAnswerStudents ] = useState([]);
  const [ evaluationQuestions, setEvaluationQuestions ] = useState([]);

  const classes = useStyles();

  async function findEvaluation(id){
    try {
      const response = await api.get('/evaluation/applications/result-question-evaluation/'+id);
      console.log('data ', response);
      if (response.status === 200) {
        setEvaluationQuestions(response.data[0].questions);
      }
    } catch (error) {

    }
  }

  async function findResults(id){
    try {
      const response = await api.get('/evaluation/applications/result-answer-students/'+id);
      console.log(response.data);
      if (response.status === 200) {
        setAnswerStudents(response.data);
        findEvaluation(id);
      }
    } catch (error) {

    }
  }

  useEffect(() => {

  }, [answerStudents]);

  useEffect(() => {
    if(idApplication){
      findResults(idApplication);
    }

  }, []);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.contentHeader}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
      </div>
      <CardHeader
        subheader=""
        title="Resultado da Aplicação"/>
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headStudent}>Aluno(a)</TableCell>
                  <TableCell className={classes.bodyPercentage}>% de Acerto</TableCell>
                  {evaluationQuestions.map((result, i) => (
                        <TableCell className={classes.headQuestion}>
                          {'Q' + (i+1)}
                          {result.percentageCorrect < 30 ?
                          <span className={classes.percentageRed}>{result.percentageCorrect+'%'}</span>
                              : result.percentageCorrect < 70 ?
                              <span className={classes.percentageOrange}>{result.percentageCorrect+'%'}</span>
                                  : <span className={classes.percentageGreen}>{result.percentageCorrect+'%'}</span> }
                        </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {answerStudents.map(result => (
                    <TableRow
                        className={classes.tableRow}
                        hover
                        key={result.fk_user_id}>
                      <TableCell className={classes.bodyStudent}>{result.student}</TableCell>
                      <TableCell className={classes.bodyPercentage}>{result.percentage_correct + '%'}</TableCell>
                      {result.questions.map(quest => (
                          quest.correct == 1 ?
                          <TableCell className={classes.answerCorrect}>
                            <Done />
                          </TableCell> :
                                <TableCell className={classes.answerIncorrect}>
                                  <Close />
                                </TableCell>
                      ))}

                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>

    </Card>
  );
};

EvaluationApplicationResults.propTypes = {
  className: PropTypes.string,
};

export default EvaluationApplicationResults;
