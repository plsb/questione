import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TablePagination,
  CardHeader,
  Grid,
  LinearProgress,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  AccordionSummary,
  AccordionDetails, Accordion, Box, Breadcrumbs, Link
} from '@material-ui/core';
import api from '../../../../services/api';
import EvaluationApplicationCardStudent from '../EvaluationApplicationCardStudent';
import {PlayArrow} from "@material-ui/icons";

import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ResultsGeneral from "../ResultsAplication/ResultsGeneral/components/ResultsGeneral";
import useStyles from "../../../../style/style";
import {CharmHome} from "../../StudentClassContent/StudentClassContent";


const useStylesLocal = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
  inner: {
    minWidth: '100%'
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  headTable: {
    fontWeight: "bold"
  },
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const AplicationListStudent = props => {
  const { className, history, studentClassId } = props;

  const [evaluationsApplications, setEvaluationsApplications] = useState(null);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const [searchText, setSearchText] = useState('');
  const [totals, setTotals] = useState({unavailable: 0, finalized: 0, started: 0});

  async function loadEvaluationsApplications(){
    try {
      let url = `class/student/list-applications/${studentClassId}`;
      
      const response = await api.get(url);

      if(response.status == 200) {  
        //setTotal(response.data.total);
        setEvaluationsApplications(response.data);

        let unavailable = 0, finalized = 0, started = 0;
        response.data.forEach(function logArrayElements(element, index, array) {
          if(element.application.status == 0){
            unavailable += 1;
          } else if(element.answer_head){
            if(element.answer_head.finalized_at){
              finalized += 1;
            } else {
              started += 1;
            }
          } else {
            started += 1;
          }
        });
        setTotals({
          unavailable, finalized, started
        });

      } else {
        setEvaluationsApplications([]);
      }
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    loadEvaluationsApplications();
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    loadEvaluationsApplications(1);
  }

  const handlePageChange = (event, page) => {
    loadEvaluationsApplications(page+1)
  };


  return (
      <div className={classes.root}>
        <div className={classes.content}>
              {evaluationsApplications == null ?
                  <LinearProgress color="secondary"    />
                  :
                    <Grid
                        container
                        spacing={1}>
                      <Grid
                          item
                          xs={12} sm={12}>
                        <Accordion style={{marginTop: '15px', marginLeft: '5px', marginRight: '5px'}}>
                          <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header">
                            <div className={classesGeneral.paperTitleTextBold}>Visão Geral</div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid
                                container
                                spacing={1}>
                              <Grid
                                  item
                                  md={12}
                                  xs={12}>
                                <ResultsGeneral studentClassId={studentClassId}/>

                              </Grid>
                            </Grid>

                          </AccordionDetails>
                        </Accordion>
                        <Box display="flex" justifyContent="left" style={{marginRight: '10px'}}>
                          <div className={classesGeneral.paperTitleGreen} style={{marginLeft: '10px', marginTop: '15px', marginBottom: '15px', borderRadius: '15px'}}>
                            {totals.finalized == 1 ? totals.finalized + ' finalizado.' : totals.finalized + ' finalizados.'}
                          </div>

                          <div className={classesGeneral.paperTitle} style={{marginLeft: '10px', fontWeight: 'bold', marginTop: '15px', marginBottom: '15px', borderRadius: '15px'}}>
                            {totals.started == 1 ? totals.started + ' não finalizado.' : totals.started + ' não finalizados.'}
                          </div>

                          <div className={classesGeneral.paperTitleGray} style={{marginLeft: '10px', marginTop: '15px', marginBottom: '15px', borderRadius: '15px'}}>
                            {totals.unavailable == 1 ? totals.unavailable + ' indisponível.' : totals.unavailable + ' indisponíveis.'}
                          </div>

                        </Box>
                        <Table>
                          <TableBody>
                            {evaluationsApplications.map((application, i) => (
                                <EvaluationApplicationCardStudent
                                    answer_head={application.answer_head}
                                    application={application.application}
                                    key={application.application.id}
                                    studentClassId={studentClassId}
                                    position={(evaluationsApplications.length - i)}/>

                            ))
                            }
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid> }

        </div>
      </div>
  );
};

AplicationListStudent.propTypes = {
  history: PropTypes.object
};

export default AplicationListStudent;