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
  TableBody

} from '@material-ui/core';
import api from "../../../../../../services/api";

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
}));

const ResultsGeneral = props =>{

    const classes = useStyles();

    const [classProfessorOverview, setClassProfessorOverview] = useState(null);

    async function loadClassProfessorOverview(){
        try {
          let url = `class/professor/overview/2`;
          const response = await api.get(url);

          console.log('response', response);
          
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
                            <TableCell  className={classes.headStudent}>Aluno(a)</TableCell>
                                <TableCell className={classes.headPercentage}>% de Acerto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {!classProfessorOverview ? null : classProfessorOverview.map(result => (
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
                                                    <Typography align="center" color="inherit" style={{fontWeight: 'bold'}}>
                                                        {result.total_porcentage_correct_all}
                                                    </Typography>
                                                 </TableCell>
                                        </TableRow>
                              ))}
                        </TableBody>
                      </Table>
                    </Box>  
                </Box>
        </div>
    );
}

export default ResultsGeneral;