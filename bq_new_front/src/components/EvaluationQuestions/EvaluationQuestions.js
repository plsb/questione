import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    LinearProgress, Chip, Box, Hidden
} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import api from "../../services/api";
import moment from "moment";
import EvaluationQuestionCard
    from "../../pages/Professor/Evaluation/EvaluationQuestions/components/EvaluationQuestionCard";
import Tab from "@material-ui/core/Tab";
import useStyles from "../../style/style";

const useStylesLocal = makeStyles(theme => ({
    root: {

    },
    head: {
        paddingBottom: 0,
        paddingTop: 10
    },
    chipGreen:{
      backgroundColor: '#4db6ac',
      color: '#ffffff',
        marginRight: 2
    },
    chipRed:{
        backgroundColor: '#f44336',
        color: '#ffffff',
        marginRight: 2
    },
    chipblue: {
        margin: 3,
        backgroundColor: '#2196f3',
        color: '#fff',
    },
    spacer: {
    flexGrow: 1
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    paper: {
        display: 'flex',
        marginBottom: 10,
        '& > *': {
            margin: theme.spacing(2),
        },
    },
    paperWrong: {
        backgroundColor: '#ef9a9a',
        color: '#212121',
        margin: 3,
        padding: 8
    },
    paperRight: {
        backgroundColor: '#80cbc4',
        color: '#212121',
        margin: 3,
        padding: 8
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    labelRank: {
      textAlign: 'right'
    },
    colorLabelDifficulty: {
        color: '#3f51b5',
        fontSize: 16,
        fontWeight: 'bold'
    },
    colorLabelDifficultyWithoutAnswer:{
        color: '#f44336',
        fontSize: 16,
        fontWeight: 'bold'
    }
}));

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
};

const EvaluationQuestions = props => {
    const { className, history, evaluationId, hideDescription, ...rest } = props;

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    const [questions, setQuestions] = useState(null);
    const [hasApplication, setHasApplication] = useState(null);
    const [evaluation, setEvaluation] = useState('');
    const [expanded, setExpanded] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);

    async function loadQuestionsEvaluation(){
        try {
            const response = await api.get('evaluation/show/questions/'+evaluationId);
            if (response.status === 200) {
                setQuestions(response.data.evaluation_questions);
                setHasApplication(response.data.has_application);
                setEvaluation(response.data.evaluation);
            } else {
                setQuestions([]);
            }
        } catch (error) {

        }
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        if(evaluationId){
            loadQuestionsEvaluation(evaluationId);
        } else {
            setQuestions([]);
        }
    }, [refresh]);

  return (
      <div className={classes.content}>
          {evaluation != null &&
              <div>
                  <Card style={{marginTop: '5px'}}>
                      <CardHeader
                          avatar={
                              <div>
                                  { evaluation &&
                                      <div>
                                          { !hideDescription &&
                                          <div className={classesGeneral.subtitleList} style={{fontWeight: 'bold'}}>
                                              {'Descrição: '+evaluation.description}
                                          </div>}
                                          <div className={classesGeneral.subtitleList}>
                                              {"Total de questões: "}
                                              {questions ? questions.length : null}
                                          </div>
                                          <div className={classesGeneral.subtitleList}>
                                              {"Criada em: "+  moment(evaluation.created_at).format('DD/MM/YYYY')}
                                          </div>
                                      </div>}

                              </div>
                          }
                      />
                  </Card>
                  <Card>
                      <CardContent>
                          {questions == null ?
                              <LinearProgress color="secondary" />
                              :
                              questions.length == 0 ?
                                  <div className={classesGeneral.textRedInfo}>
                                      {'Esta avaliação não possui questões.'}
                                  </div>
                              :
                              <div>
                                  {questions.map((data, i) => (
                                      <Box display="flex" style={{marginBottom: '20px'}}>
                                          <Hidden xsDown>
                                              <Chip label={(i + 1)}
                                                    style={{fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        margin: '8px'}} color="secondary" size="medium"/>
                                          </Hidden>
                                          <EvaluationQuestionCard
                                              question={data.question}
                                              id_evaluation={evaluationId}
                                              setQuestions={setQuestions}
                                              hasApplication={hasApplication}
                                              setRefresh={setRefresh}
                                          />
                                      </Box>

                                  ))}

                              </div>
                          }
                      </CardContent>
                  </Card>
              </div>
          }
      </div>
  );
};

EvaluationQuestions.propTypes = {
    className: PropTypes.string,
    hideDescription: PropTypes.bool,

};

export default withRouter(EvaluationQuestions);
