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
  Typography, Grid, Tooltip,
  Paper, LinearProgress
} from '@material-ui/core';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Close, Done, Block} from "@material-ui/icons";
import {withStyles} from "@material-ui/core/styles";
import Swal from "sweetalert2";

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
    padding: '10px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  percentageGreen: {
    backgroundColor: '#5DE2A5',
    display: 'block',
    margin: '8px',
    padding: '10px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4,
  },
  percentageNull: {
    backgroundColor: '#90a4ae',
    color: '#fff',
    display: 'block',
    margin: '8px',
    padding: '10px',
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
  const [ head, setHead ] = useState([]);
  const [ questions, setQuestions ] = useState(null);

  const classes = useStyles();

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message
    });
  }

  async function findHead(){
    try {

      const response = await api.get('/evaluation/student/result/evaluations-specific/'+idHead);

      if (response.status == 200) {
        setQuestions(response.data.questions);
        setHead(response.data);
      } if (response.status == 202 ){
        if(response.data.message) {
          loadAlert('error', response.data.message);
          setQuestions([]);
          setHead([]);
        } else {
          setQuestions([]);
          setHead([]);
        }
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
              { questions == null ?
                  <LinearProgress color="secondary"    />
                  :
                  <div>
                    {head.qtdCorrect != null ?
                    <Paper variant="outlined" style={{padding: '5px', marginBottom: '15px'}}>
                      <Typography align="center"
                                  variant="body2" color="textPrimary"
                                  style={{fontWeight: 'bold', fontSize: '14px', marginRight: '5px',
                                    color: '#009688'}} >
                        {head.qtdCorrect >= 2 ? 'Você acertou '+head.qtdCorrect+ ' questões.'
                            : 'Você acertou '+head.qtdCorrect+ ' questão.'}
                      </Typography>
                      <Typography align="center"
                                  variant="body2" color="textPrimary"
                                  style={{fontWeight: 'bold', fontSize: '14px', marginRight: '5px',
                                    color: '#EC0B43'}} >
                        {head.qtdIncorrect >= 2 ? 'Você errou '+head.qtdIncorrect+ ' questões.'
                            : 'Você errou '+head.qtdIncorrect+ ' questão.'}
                      </Typography>

                    </Paper>
                    : null}

                    {questions.map((result, i) => (
                        <div style={{marginBottom: '30px'}}>
                          <Typography align="center" style={{fontWeight: 'bold'}}
                                      variant="h5" component="h2">
                            {'Questão ' + (i+1)}
                          </Typography>
                          {result.skill ?
                              <Grid
                                  container
                                  direction="row"
                                  justify="center"
                                  alignItems="center">
                                <Typography align="center"
                                            variant="body2" color="textPrimary"
                                            style={{fontWeight: 'bold', marginRight: '5px'}} >
                                  Competência:
                                </Typography>
                                <Typography align="center"
                                            variant="body2" color="textPrimary" >
                                  {result.skill.description}
                                </Typography>
                              </Grid>
                              : null }
                          {result.objects ?
                              <Grid
                                  container
                                  direction="row"
                                  justify="center"
                                  alignItems="center">
                                  <Typography align="center"
                                              variant="body2" color="textPrimary"
                                              style={{fontWeight: 'bold', marginRight: '5px'}} >
                                    Objeto(s) de Conhecimento:
                                  </Typography>
                                  <Typography align="center"
                                              variant="body2" color="textPrimary" >
                                      {result.objects.map(item => (
                                            item.object.description + '; '
                                      ))}
                                  </Typography>
                              </Grid>
                              : null }
                            {result.answer == null ?
                                    <span className={classes.percentageNull}><Block /></span>
                                    :
                                    result.correct == 1 ?
                                        <span className={classes.percentageGreen}><Done /></span>
                                         :
                                        <span className={classes.percentageRed}><Close /></span>}
                        </div>

                    ))}
                  </div>

              }

            </CardContent>
       </Card>
      </div>
  );
};

EvaluationsResultDetails.propTypes = {
  className: PropTypes.string,
};

export default EvaluationsResultDetails;
