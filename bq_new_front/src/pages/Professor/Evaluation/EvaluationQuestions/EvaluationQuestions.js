import React, { useEffect, useState } from 'react';
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
  Box, Breadcrumbs, Link,
} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import api from "../../../../services/api";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withStyles } from "@material-ui/core/styles";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import './styles.css';
import EvaluationQuestions from "../../../../components/EvaluationQuestions";
import useStyles from "../../../../style/style";
import {CharmHome} from "../../../../icons/Icons";


const useStylesLocal = makeStyles((theme) => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },
  ml: {
    marginLeft: '8px',
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
  },
  lineQuestion: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: 30
  },
  lineItemQuestion: {
    width: '100%'
  },
  correct: {
    color: '#80cbc4',
  },
  incorrect: {
    color: '#ef9a9a',
  },
  bgCorrect: {
    background: 'green',
    color: '#ffffff',
  },
  bgIncorrect: {
    background: 'red',
    color: '#ffffff',
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
  },
  paperWrongFont: {
    color: '#ef9a9a',
  },
  paperRight: {
      backgroundColor: '#80cbc4',
      color: '#212121',
  },
  paperRightFont: {
    color: '#80cbc4',
  },
  questionActions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '32px',
  },
  tituloCard: {
    fontSize: '15px',
    fontWeight: 'bold'
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`nav-tabpanel-${index}`}
          aria-labelledby={`nav-tab-${index}`}
          {...other}>
          {value === index && (
              <Box p={3}>
                  <Typography>{children}</Typography>
              </Box>
          )}
      </div>
  );
}

const EvaluationsResultDetails = props => {

  const { className, history, ...rest } = props;
  const { evaluationId } = props.match.params;
  const [questions, setQuestions] = useState(null);
  const [hasApplication, setHasApplication] = useState(null);
  const [evaluation, setEvaluation] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDeleteQuestionEvaluation, setOpenDeleteQuestionEvaluation] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

    const handleClose = () => {
        setAnchorEl(null);
    };

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  async function loadQuestionsEvaluation(id){
    try {
      const response = await api.get('evaluation/show/questions/'+id);
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

  useEffect(() => {
    if(evaluationId){
        loadQuestionsEvaluation(evaluationId);
    } else {
        setQuestions([]);
    }
  }, [refresh]);

  const handleBack = () => {
    history.goBack();
  };

  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
  };

  async function deleteQuestionEvaluation(questionId) {
    setOpenDeleteQuestionEvaluation(false);
    try {
        let url = 'evaluation/deletequestion/'+questionId+'+?fk_evaluation_id='+evaluationId;
        const fk_evaluation_id = evaluationId;
        const data = {
            fk_evaluation_id
        }
        const response = await api.delete(url);
        if (response.status === 202) {
            if(response.data.message){
                toast.error(response.data.message);
            }
        } else {
            toast.success('Questão excluída da avaliação.');
            setRefresh(refresh+1);
        }
    } catch (error) {

    }
}

  const onClickOpenDialogQEvaluation = () => {
    setOpenDeleteQuestionEvaluation(true);
  };

  const onClickCloseDialogQEvaluation = () => {
    setOpenDeleteQuestionEvaluation(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleCloseSnackbar = () => {
  //   setShowSnackbar(false);
  // };

  const difficulty = (porc, totalCorrect) => {
    if(totalCorrect < 20){
      return ''
    }
    if (porc >= 0.86) {
      return '- Dificuldade: Muito Fácil'
    } else if(porc >= 0.61 && porc <= 0.85){
      return '- Dificuldade: Fácil'
    } else if(porc >= 0.41 && porc <= 0.60){
      return '- Dificuldade: Média'
    } else if(porc >= 0.16 && porc <= 0.40){
      return '- Dificuldade: Difícil'
    } else if(porc <= 0.15){
      return '- Dificuldade: Muito Difícil'
    }
    return '';
  }

  return (
    <div className={classesGeneral.root}>
      <Box display="flex">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            <Box display="flex">
              <Box style={{marginTop: '2px', marginRight: '5px'}}>
                <CharmHome />
              </Box>
              <Box>
                Início
              </Box>
            </Box>
          </Link>
          <Link color="inherit" onClick={() => history.goBack()}>
            Avaliações
          </Link>
          <div color="inherit">
            {evaluationId ? 'Questões da avaliação de código '+evaluationId : 'Questões da avaliação'}
          </div>
        </Breadcrumbs>
      </Box>

      <Card
        {...rest}
        className={clsx(classes.root, className)}>
        <CardHeader
          subheader={
            <div className={classesGeneral.subtitleList}>{'Verifique as questões da sua avaliação.'}</div>}
          title={
          <div className={classesGeneral.titleList}>{'Questões da avaliação'}</div>}
        />
        <Divider />

        <EvaluationQuestions evaluationId={evaluationId}/>

      </Card>
    </div>
  );
};

EvaluationsResultDetails.propTypes = {
  className: PropTypes.string,
};

export default EvaluationsResultDetails;
