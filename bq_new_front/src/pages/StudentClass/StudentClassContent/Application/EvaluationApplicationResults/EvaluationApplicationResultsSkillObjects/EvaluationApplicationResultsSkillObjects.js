import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent, Paper,
  Box, Typography, Tooltip, Tab, Tabs, LinearProgress, Grid, Divider,
} from '@material-ui/core';
import {withStyles} from "@material-ui/core/styles";
import useStyles from "../../../../../../style/style";

const useStylesLocal = makeStyles(() => ({
  root: {
    margin: '5px'
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
  labelRed: {
    backgroundColor: '#EC0B43',
    display: 'block',
    margin: '10px',
    padding: '5px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
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

const EvaluationApplicationResultsSkillObjects = props => {
  const { className, history, result, objects, skills, ...rest } = props;
  const [ value, setValue] = React.useState(0);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {

  }, []);

  return (
      <div>
        <div>
          {/*<Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChangeTab}
              aria-label="nav tabs example">
            <LinkTab label="Competências" href="#" {...a11yProps(0)} />
            <LinkTab label="Objetos de Conhecimento" href="/#" {...a11yProps(1)} />

          </Tabs>
          <TabPanel value={value} index={0}>
            { skills == null ?
                <LinearProgress color="secondary" />
                :
                skills.length == 0 ?
                    <span className={classes.labelRed}>Esta avaliação não possui conteúdos associadas.</span>
                :
                skills.map(result => (
                  <Card
                      {...rest}
                      className={classes.root}>
                    <CardHeader
                        className={classes.head}
                        avatar={
                          <div>
                            <Typography variant="h5" color="textSecondary" component="h2">
                              {'Curso : '+result.course }
                            </Typography>
                          </div>
                        }
                        title={
                          <div className={classesGeneral.paperTitleText}>
                            {result.description }
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
                              <Typography variant="body1" component="p">
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
                              <Typography variant="body1" component="p">
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
                              <Typography variant="body1" component="p">
                                {result.percentage_correct < 30 ?
                                    <span className={classes.percentageRed}>{'Correto: '+result.percentage_correct+'%'}</span>
                                    : result.percentage_correct < 70 ?
                                        <span className={classes.percentageOrange}>{'Correto: '+result.percentage_correct+'%'}</span>
                                        : <span className={classes.percentageGreen}>{'Correto: '+result.percentage_correct+'%'}</span> }
                              </Typography>
                            </TooltipCustomized>

                          </div>
                        }/>
                        <CardContent>

                        </CardContent>
                  </Card>
            ))}

          </TabPanel>*/}
          <Grid container >
            {objects == null ?
                <LinearProgress color="secondary"    />
                :
                objects.length == 0 ?
                <span className={classes.labelRed}>Esta avaliação não possui objetos de conhecimento associados.</span>
                :
              objects.map((result, i) => (
                  <Grid item xs={12} sm={12} md={6} lg={4} key={i}>
                    <Paper
                           style={{height: '160px', paddingTop: '10px', paddingLeft: '10px', marginRight: '8px', marginBottom: '8px',
                             background: result.percentage_correct < 30 ? '#ffcdd2'
                                 : result.percentage_correct < 70 ? '#ffe0b2'
                                     : '#c8e6c9' }}>

                          <Box display='flex' height='100%'>
                            <Box display='grid' flexGrow={1} >
                              <Box >
                                <div className={classesGeneral.paperTitleText} style={{fontSize: '17px'}}>
                                  {result.description }
                                </div>
                                <div className={classesGeneral.paperTitleText} style={{fontSize: '11px'}}>
                                  {result.course }
                                </div>
                              </Box>
                              <Box display='flex' style={{alignSelf: 'flex-end', marginBottom: '10px'}} >
                                <Box>
                                  <div className={classesGeneral.paperTitleText} style={{fontSize: '14px', marginTop: '2px'}}>
                                    {result.total_questions+' questões no simulado.'}
                                  </div>
                                  <div className={classesGeneral.paperTitleText} style={{fontSize: '14px'}}>
                                    {!result.total_answer ? '0 estudantes responderam.' :
                                      (result.total_answer) == 1 ? (result.total_answer)+' estudante respondeu.' : (result.total_answer)+' estudantes responderam.'}
                                  </div>
                                </Box>
                              </Box>

                            </Box>

                            <Box display='flex' style={{margin:'10px', alignSelf: 'center'}}>
                               <Box>
                                <div className={classesGeneral.paperTitleTextBold} style={{fontSize: '18px'}}>
                                  {result.percentage_correct+'%'}
                                </div>
                                <div className={classesGeneral.paperTitleText}>
                                  {'Acertaram'}
                                </div>
                              </Box>
                            </Box>
                          </Box>
                    </Paper>
                  </Grid>

            ))}
          </Grid>
        </div>

      </div>
  );
};

EvaluationApplicationResultsSkillObjects.propTypes = {
  className: PropTypes.string,
  skills: PropTypes.array.isRequired,
  objects: PropTypes.array.isRequired,
};

export default EvaluationApplicationResultsSkillObjects;
