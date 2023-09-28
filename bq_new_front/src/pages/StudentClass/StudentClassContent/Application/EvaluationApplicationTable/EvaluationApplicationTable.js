import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Table,
  TableBody,
  TablePagination,
  CardHeader,
  Grid,
  LinearProgress,
  Button,
  Dialog,
  Typography,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  AccordionSummary,
  AccordionDetails,
  Accordion
} from '@material-ui/core';
import api from '../../../../../services/api';

import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import EvaluationApplicationCard from "../EvaluationApplicationCard";
import {useTheme} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment/moment";
import EvaluationQuestions from "../../../../../components/EvaluationQuestions/EvaluationQuestions";
import useStyles from "../../../../../style/style";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ResultsGeneral from "../../../Professor/ResultsAplication/ResultsGeneral/components/ResultsGeneral";

const useStylesLocal = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(1)
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
  },
  appBar: {
    position: 'relative',
    background: '#3a7cf7',
  },
  title: {
    marginLeft: 2,
    flex: 1,
    fontWeight: 'bold',
    color: '#ffffff'
  },
}));

const EvaluationApplicationTable = props => {
  const { className, history, studentClassId } = props;

  const [evaluationsApplications, setEvaluationsApplications] = useState(null);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

  const [totals, setTotals] = useState({unavailable: 0, avaiable: 0});
  const [refresh, setRefresh] = useState(null);

  
  const [searchText, setSearchText] = useState('');

  async function loadEvaluationsApplications(){
    try {
      let url = `class/professor/list-applications/${studentClassId}`;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      if(response.status == 200) {  
        //setTotal(response.data.total);
        setEvaluationsApplications(response.data);

        let unavailable = 0, available = 0;
        response.data.forEach(function logArrayElements(element, index, array) {
          if(element.status == 1 && element.evaluation.status != 2){
            available += 1;
          }
        });

        unavailable = response.data.length - available;
        setTotals({
          unavailable, available
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

  useEffect(() => {
    loadEvaluationsApplications();
  }, [refresh]);


  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    loadEvaluationsApplications(1);
  }

  return (
      <div className={classes.root}>
        {/*<UsersToolbar
            onChangeSearch={updateSearch.bind(this)}
            searchText={searchText}
            onClickSearch={onClickSearch}/>*/}
        <div className={classes.content}>
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
            <div className={classesGeneral.paperTitleGreen} style={{marginLeft: '0px', marginTop: '15px', marginBottom: '15px', borderRadius: '15px'}}>
              {totals.available == 1 ? totals.available + ' habilitado.' : totals.available + ' habilitados.'}
            </div>

            <div className={classesGeneral.paperTitleGray} style={{marginLeft: '10px', fontWeight: 'bold', marginTop: '15px', marginBottom: '15px', borderRadius: '15px'}}>
              {totals.unavailable == 1 ? totals.unavailable + ' inhabilitado.' : totals.unavailable + ' inabilitados.'}
            </div>

          </Box>

              {evaluationsApplications == null ?
                  <LinearProgress color="secondary"    />
                  :
                    <Grid
                        container
                        spacing={1}>
                      <Grid
                          item
                          md={12}
                          xs={12}>
                        <Table>
                          <TableBody>
                            {
                              evaluationsApplications.map((application, i) => (
                                  <EvaluationApplicationCard
                                      application={application}
                                      key={application.id}
                                      setRefresh={setRefresh}
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

EvaluationApplicationTable.propTypes = {
  history: PropTypes.object
};

export default EvaluationApplicationTable;
