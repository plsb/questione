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
  Chip

} from '@material-ui/core';
import api from "../../../../../../services/api";
import PerfectScrollbar from "react-perfect-scrollbar";

const TooltipCustomized = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
  headStudent: {
    width: '100px ',
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
    height: '82px',
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

    const classes = useStyles();

    const [classProfessorOverview, setClassProfessorOverview] = useState(null);
    const [ value, setValueTab] = React.useState(0);

   const { className, history, studentClassId} = props;

    async function loadClassProfessorOverview(){
        try {
          let url = `class/professor/overview/${studentClassId}`;
          const response = await api.get(url);
          
          if(response.status == 200) {  
            setClassProfessorOverview(response.data);
          } else {
            setClassProfessorOverview([]);
          }
          
        } catch (error) {
          
        }
      }

    useEffect(() => {
        loadClassProfessorOverview();
    }, []);
  

    return(
        <div className={classes.root}>
              <TabPanel value={value} index={0}>
               <Box
                    display="flex"
                    flexWrap="nowrap"
                    p={1}
                    m={1}
                    bgcolor="background.paper">
                    
                    <Box p={1}>
                      <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell className={classes.headStudent}> Aluno(a)</TableCell>
                                <TableCell className={classes.headPercentage}> % de Acerto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {!classProfessorOverview ? null : classProfessorOverview.map((result, i) => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={result.student.id}>
                                                 <TableCell className={classes.bodyStudent}>
                                                    <Typography align="center" color="inherit" style={{fontWeight: 'bold'}}>
                                                        {result.student.name}
                                                    </Typography>
                                                 </TableCell>
                                                 <TableCell className={classes.bodyStudent}>
                                                    {/*<Typography align="center" color="inherit" style={{fontWeight: 'bold'}}>
                                                        {result.total_porcentage_correct_all}
                                                    </Typography>*/}
                                                    {result.total_porcentage_correct_all < 30 ?
                                                      <span className={classes.percentageRed}>{result.total_porcentage_correct_all+'%'}</span>
                                                        : result.total_porcentage_correct_all < 70 ?
                                                      <span className={classes.percentageOrange}>{result.total_porcentage_correct_all+'%'}</span>
                                                      : <span className={classes.percentageGreen}>{result.total_porcentage_correct_all+'%'}</span> }
                                                 </TableCell>
                                        </TableRow>
                              ))}
                        </TableBody>
                      </Table>
                      </Box>
                      <PerfectScrollbar>
                        <Box p={1}>

                              <div className={classes.inner}>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        {!classProfessorOverview ? null :
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
                                                  {classProfessorResult.evaluation_answer.map(evaluation => (
                                                    <TableCell aling="canter" className={classes.bodyPercentage}>
                                                      {/*<Typography align="center" variant="h6" color="textPrimary" gutterBottom>
                                                        {evaluation.porcentage_correct}
                                                  </Typography> */}
                                                  {evaluation.porcentage_correct < 30 ?
                                                  <span className={classes.percentageRed}>{evaluation.porcentage_correct+'%'}</span>
                                                    : evaluation.porcentage_correct < 70 ?
                                                  <span className={classes.percentageOrange}>{evaluation.porcentage_correct+'%'}</span>
                                                  : <span className={classes.percentageGreen}>{evaluation.porcentage_correct+'%'}</span> }
                                                      <Typography  variant="overline" color="block" gutterBottom>
                                                        {evaluation.finalized_at != null ? "Finalizada" : 
                                                          evaluation.created_at != null ? "Iniciada" :
                                                          "Não iniciada"}
                                                       </Typography>
                                                    </TableCell>
                                                  
                                                  ))}
                                              </TableRow>
                                                
                                              
                                          ))}
                                      
                                    </TableBody>
                                  </Table>
                              </div>

                        </Box>
                    </PerfectScrollbar>

                </Box>
              </TabPanel>
        </div>
    );
}

export default ResultsGeneral;