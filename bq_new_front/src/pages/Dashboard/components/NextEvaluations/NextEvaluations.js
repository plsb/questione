import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid, Typography, Avatar,
  Paper, Box, CardActionArea
} from '@material-ui/core';
import api from "../../../../services/api";
import { useHistory } from "react-router-dom";
import moment from "moment/moment";
import useStyles from "../../../../style/style";
import TooltipQuestione from "../../../../components/TooltipQuestione";
import DecreaseStringSize from "../../../../components/DecreaseStringSize";

const useStylesLocal = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.primary.dark
  },
  differenceValue: {
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(1)
  }
}));

const NextEvaluations = props => {
  const { className, ...rest } = props;
  let history = useHistory();
  const [nextEvaluations, setNextEvaluations] = useState(null);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  async function loadNextEvaluations(){
    try {
      let url = 'class/student/next-evaluations';

      const response = await api.get(url);

      if(response.status == 200) {
        setNextEvaluations(response.data);

      } else {
        setNextEvaluations([]);
      }

    } catch (error) {

    }
  }


  useEffect(() => {
    loadNextEvaluations();
  }, []);

  return (
        <Grid
          container>
          <div style={{marginBottom: '10px' }}>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              PRÓXIMOS SIMULADOS
            </Typography>
            <Box display="flex" alignItems="left">
              {nextEvaluations && nextEvaluations.length > 0 ?
                    <div className={classesGeneral.subtitles} style={{marginTop: '5px'}}>
                      {'Lista dos simulados não finalizados ou não iniciados.'}
                    </div> :
                    <div className={classesGeneral.subtitles} style={{marginTop: '5px'}}>
                      {'Você não tem simulados para realizar.'}
                    </div>
              }
            </Box>
          </div>
            <Grid container style={{width: '100%'}} spacing={1}>
              {nextEvaluations && nextEvaluations.map((evaluations, i) => (
                  <Grid item xs={12} sm={12} md={12} lg={5} key={i} style={{marginBottom: '10px', marginRight: '40px'}}>
                    <TooltipQuestione description={'Clique para realizar o simulado '+evaluations.description} position={'bottom'} content={
                      <CardActionArea onClick={() => history.push(`/code/${evaluations.id_application}`)}>
                        <Paper className={classesGeneral.paperTitle}>
                          <Box display="flex">
                            <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-start">
                              <div className={classesGeneral.paperTitleText} >
                                {'Simulado: '}<DecreaseStringSize string={evaluations.description}/>
                              </div>
                            </Box>
                            <Box display="flex" justifyContent="flex-end">
                            </Box>
                          </Box>
                        </Paper>
                        <Paper style={{padding: '5px', paddingBottom: '10px'}}>

                          <div className={classesGeneral.paperTitleText}>
                            {'Turma: '}<DecreaseStringSize string={evaluations.class.id_class+' - '+evaluations.class.description} />
                          </div>
                          <div className={classesGeneral.paperTitleText}>
                            {'Professor: '+evaluations.class.user.name}
                          </div>
                          <div className={classesGeneral.paperTitleText}>
                            {'Data do simulado: '+ moment(evaluations.created_at).format('DD/MM/YYYY')}
                          </div>
                        </Paper>
                      </CardActionArea>
                    }/>

                  </Grid>
              ))}
            </Grid>
        </Grid>

  );
};

NextEvaluations.propTypes = {
  className: PropTypes.string
};

export default NextEvaluations;
