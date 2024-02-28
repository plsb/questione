import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  TableBody,
  Chip, TableContainer, Paper

} from '@material-ui/core';
import api from "../../../../../../services/api";
import PerfectScrollbar from "react-perfect-scrollbar";
import useStyles from "../../../../../../style/style";
import TooltipQuestione from "../../../../../../components/TooltipQuestione";
import ScrollBar from "react-perfect-scrollbar";

const TooltipCustomized = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

const useStylesLocal = makeStyles(theme => ({
  root: {

  },
  content: {
    padding: 0,

  },
  headStudent: {
    width: '10px ',
    height: '115px',
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
    textAlign: 'center',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial'
  },
  headPercentage: {
    width: '30px',
    height: '90px',
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
    maxWidth: '170px',
    width: '100px',
    height: '100px',
    backgroundColor: '#FFF',
    color: '#393A68',
    paddingLeft: '6px',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    border: '1px solid #f2f2f2',
    lineHeight: '20px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'auto',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial',
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
  percentageGold: {
    backgroundColor: '#ffd600',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  percentageBlue: {
    backgroundColor: '#3a7cf7',
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
  bodyPercentage: {
    width: '20%',
    height: '82px',
    textAlign: 'center',
    backgroundColor: '#FFF',
    color: '#393A68',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    border: '1px solid #f2f2f2',
    lineHeight: '15px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'auto',
    textOverflow: 'ellipsis',
    fontFamily: 'Open Sans, sans-serif, Helvetica, Arial'
  },
  headQuestion: {
    width: '90px',
    backgroundColor: '#FFF',
    color: '#393A68',
    textAlign: 'center',
    height: '115px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
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

const ResultsGeneral = props =>{

    const classes = useStylesLocal();
    const classesGeneral = useStyles()

    const [classProfessorOverview, setClassProfessorOverview] = useState(null);
    const [ value, setValueTab] = React.useState(0);

   const { className, history, studentClassId} = props;



    async function loadClassProfessorOverview(){
        try {

          let url = `class/professor/overview/${studentClassId}`;
          const response = await api.get(url);

          if(response.status == 200) {
            if(response.data.length === 0){
              setClassProfessorOverview(null);
            } else {
              setClassProfessorOverview(response.data);
            }
          } else {
            setClassProfessorOverview(null);
          }
          
        } catch (error) {

        }

      }

    useEffect(() => {
      loadClassProfessorOverview();
    }, []);

    return(
        <div className={classes.root}>
              <Box display="flex" justifyContent="center" style={{marginTop: '20px'}}>
                <div className={classesGeneral.paperTitleTextBold} style={{ marginRight: '10px'}}>
                  Legenda:
                </div>
                <div className={classesGeneral.paperTitleText} style={{color: '#f44336', marginRight: '5px'}}>
                  0 a 29%;
                </div>
                <div className={classesGeneral.paperTitleText} style={{color: '#ffab40', marginRight: '5px'}}>
                  30 a 69%;
                </div>
                <div className={classesGeneral.paperTitleText} style={{color: '#43a047'}}>
                  70 a 100%.
                </div>
              </Box>

             <Box
                  display="flex"
                  flexWrap="nowrap"
                  justifyContent="center"
                  p={1}
                  m={1}
                  bgcolor="background.paper">

                  <Box p={1}>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.headStudent}> Aluno(a)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {!classProfessorOverview ? null : classProfessorOverview.map((result, i) => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={result.student.id}>
                                           <TableCell className={classes.bodyStudent}>
                                             <div className={classesGeneral.paperTitleTextBold} align="center">
                                               <ScrollBar>
                                                {result.student.name}
                                               </ScrollBar>
                                             </div>
                                           </TableCell>
                                        </TableRow>
                              ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    </Box>
                    <PerfectScrollbar>
                      <Box p={1}>
                            <div className={classes.inner}>
                              <TableContainer component={Paper}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      {!classProfessorOverview ? null :
                                          classProfessorOverview[0].class_gamified == 1 ?
                                              <TableCell className={classes.headQuestion}> Total XP </TableCell> : null}
                                      <TableCell className={classes.headQuestion}> % de Acerto</TableCell>
                                      {!classProfessorOverview ?
                                          null :
                                          classProfessorOverview[0].evaluation_answer.map((result, i) => (
                                              <TableCell className={classes.headQuestion}>
                                                {'Simulado ' + (i+1)}
                                              </TableCell>

                                          ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {!classProfessorOverview ? null :
                                          classProfessorOverview.map((classProfessorResult, i) => (
                                                  <TableRow
                                                      className={classes.tableRow}
                                                      hover
                                                      key={classProfessorResult.id}>
                                                      {classProfessorResult.class_gamified ==1 &&
                                                          <TableCell className={classes.bodyStudent}>
                                                            <div className={classesGeneral.paperTitleTextBold} align="center">
                                                              {classProfessorResult.total_xp+ ' XP'}
                                                            </div>
                                                            {classProfessorResult.position.position > 0 && classProfessorResult.total_xp > 0 ?
                                                                <span className={
                                                                  classProfessorResult.position.position == 1 ? classes.percentageGold :
                                                                      classProfessorResult.position.position == 2 ? classes.percentageBlue :
                                                                          classProfessorResult.position.position == 3 ? classes.percentageBlue : null}
                                                                      style={{fontSize: '12px'}} align="center">
                                                                          <TooltipQuestione description={'Fornece a posição do aluno em relação aos demais colegas na turma que está participando da gamificação. '+
                                                                              'Essa classificação é determinada com base na pontuação de experiência (XP) de cada participante.'} position={'top-start'}
                                                                                            content={classProfessorResult.position.position+'º posição.'} justify={'center'}/>
                                                                        </span> :
                                                                                    null}
                                                          </TableCell>}
                                                      <TableCell className={classes.bodyStudent}>
                                                          {classProfessorResult.total_porcentage_correct_all < 30 ?
                                                              <span className={classes.percentageRed}>{classProfessorResult.total_porcentage_correct_all+'%'}</span>
                                                              : classProfessorResult.total_porcentage_correct_all < 70 ?
                                                                  <span className={classes.percentageOrange}>{classProfessorResult.total_porcentage_correct_all+'%'}</span>
                                                                  : <span className={classes.percentageGreen}>{classProfessorResult.total_porcentage_correct_all+'%'}</span> }
                                                        </TableCell>
                                                        {classProfessorResult.evaluation_answer.map(evaluation => (
                                                              <TableCell aling="canter" className={classes.bodyPercentage}>
                                                                  {!evaluation.created_at ? null
                                                                      : evaluation.porcentage_correct < 30 ?
                                                                  <span className={classes.percentageRed}>{evaluation.porcentage_correct+'%'}</span>
                                                                    : evaluation.porcentage_correct < 70 ?
                                                                  <span className={classes.percentageOrange}>{evaluation.porcentage_correct+'%'}</span>
                                                                  : <span className={classes.percentageGreen}>{evaluation.porcentage_correct+'%'}</span> }
                                                                <div className={classesGeneral.paperTitleText} style={{fontSize: '10px', fontWeight: '1'}}>
                                                                  {evaluation.finalized_at != null ? "Finalizado" :
                                                                      evaluation.created_at != null ? "Iniciado" :
                                                                          "Não iniciado"}
                                                                </div>
                                                                <Typography  variant="overline" color="block" gutterBottom>

                                                                 </Typography>
                                                              </TableCell>
                                                    )
                                                    )}
                                                  </TableRow>



                                        ))}

                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </div>

                      </Box>
                  </PerfectScrollbar>

              </Box>
        </div>
    );
}

export default ResultsGeneral;