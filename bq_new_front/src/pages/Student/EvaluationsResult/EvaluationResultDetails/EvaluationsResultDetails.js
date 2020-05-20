import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Tooltip
} from '@material-ui/core';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Close, Done, Block} from "@material-ui/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import {withStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },
  headQuestion: {
    width: '90.0px',
    backgroundColor: '#FFF',
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
  percentageGreen: {
    backgroundColor: '#5DE2A5',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  percentageNull: {
    backgroundColor: '#90a4ae',
    color: '#fff',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    borderRadius: 4
  },
  answerCorrect: {
    width: '90.0px',
    backgroundColor: '#5DE2A5',
    //display: 'inline-block',
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
    //display: 'inline-block',
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
  answerNull: {
    width: '90.0px',
    backgroundColor: '#cfd8dc',
    //display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '70px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  }
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

const EvaluationsResultDetails = props => {
  const { className, history, ...rest } = props;
  const { idHead } = props.match.params;
  const [ questions, setQuestions ] = useState([]);

  const classes = useStyles();

  async function findHead(){
    try {

      const response = await api.get('/evaluation/student/result/evaluations-specific/'+idHead);

      if (response.status === 200) {
        setQuestions(response.data.questions);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    findHead();

  }, []);

  const handleBack = () => {
    history.goBack();
  };

  return (
      <div>
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
              title="Avaliação"/>
          <Divider />
            <CardContent>
                  <PerfectScrollbar>
                      <div className={classes.inner}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {questions.map((result, i) => (
                                  <TableCell className={classes.headQuestion}>
                                    {'Questão ' + (i+1)}
                                  </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TooltipCustomized
                                title={
                                  <React.Fragment>
                                    <span className={classes.percentageRed}>{'Errou'}</span>
                                    <span className={classes.percentageGreen}>{'Acertou'}</span>
                                    <span className={classes.percentageNull}>{'Não respondeu'}</span>
                                  </React.Fragment>
                                }>
                                <TableRow
                                    className={classes.tableRow}
                                    hover>
                                    {questions.map(result => (
                                        result.answer == null ?
                                            <TableCell className={classes.answerNull}>
                                              <Block />
                                            </TableCell>
                                            :
                                        result.correct == 1 ?
                                              <TableCell className={classes.answerCorrect}>
                                                <Done />
                                              </TableCell> :
                                              <TableCell className={classes.answerIncorrect}>
                                                <Close />
                                              </TableCell>
                                    ))}
                                </TableRow>
                            </TooltipCustomized>
                          </TableBody>
                        </Table>
                      </div>

                  </PerfectScrollbar>
            </CardContent>
       </Card>
      </div>
  );
};

EvaluationsResultDetails.propTypes = {
  className: PropTypes.string,
};

export default EvaluationsResultDetails;
