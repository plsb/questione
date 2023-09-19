import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Paper,
    Dialog,
    Box,
    Divider,
    Link,
    Grid,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, Button
} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import api from "../../services/api";
import moment from "moment";
import useStyles from "../../style/style";

const useStylesLocal = makeStyles(theme => ({

}));

const GamificationPanel = props => {
    const { className, history, question, gamified_class, classId, ...rest } = props;

    const [openDialogRP, setOpenDialogRP] = React.useState(false);
    const [openDialogXP, setOpenDialogXP] = React.useState(false);
    const [historyRP, setHistoryRP] = useState(null);
    const [historyXP, setHistoryXP] = useState(null);
    const [totalXP, setTotalXP] = useState(0);
    const [totalRP, setTotalRP] = useState(0);
    const [rankPositionText, setRankPositionText] = useState('0/0');
    const [rankPosition, setRankPosition] = useState(null);

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    async function loadRankPosition(){
        try {
            let url = `class/student/gamification/rankPosition/${classId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setRankPositionText(response.data.string);
                setRankPosition(response.data.position);
            } else {
                setRankPositionText([]);
                setRankPosition([]);
            }

        } catch (error) {

        }
    }

    async function loadTotalXP(){
        try {
            let url = `class/student/gamification/totalxp/${classId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setTotalXP(response.data);
            } else {
                setTotalXP([]);
            }

        } catch (error) {

        }
    }

    async function loadTotalRP(){
        try {
            let url = `class/student/gamification/totalrp/${classId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setTotalRP(response.data);
            } else {
                setTotalRP([]);
            }

        } catch (error) {

        }
    }

    async function loadHistoryRP(){
        try {
            let url = `class/student/gamification/historyrp/${classId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setHistoryRP(response.data);
            } else {
                setHistoryRP([]);
            }

        } catch (error) {

        }
    }

    async function loadHistoryXP(){
        try {
            let url = `class/student/gamification/historyxp/${classId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setHistoryXP(response.data);
            } else {
                setHistoryXP([]);
            }

        } catch (error) {

        }
    }

    const handleClickOpenDialogRP = () => {
        setOpenDialogRP(true);
    };

    const handleCloseDialogRP = () => {
        setOpenDialogRP(false);
    };

    const handleClickOpenDialogXP = () => {
        setOpenDialogXP(true);
    };

    const handleCloseDialogXP = () => {
        setOpenDialogXP(false);
    };

    useEffect(() => {
        loadHistoryRP();
        loadHistoryXP();
        loadTotalXP();
        loadTotalRP();
        loadRankPosition();

    }, []);



    return (
      <div className={classes.content}>
              { (gamified_class === 1 && localStorage.getItem('@Questione-acess-level-user') === "0" &&
                      <Box>
                          <Paper style={{paddingTop: '5px', paddingBottom: '20px', paddingRight: '20px', paddingLeft: '20px',}}>
                              <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                      <Box display="flex" alignItems="row">
                                          <img
                                              style={{marginTop: '15px', marginRight: '10px'}}
                                              alt="Logo"
                                              src="/images/podio.png" width='35px'/>
                                          <div className={classesGeneral.paperTitleTextBold} style={{marginTop: '22px'}}>
                                              {'Sua posição: '+rankPositionText}
                                          </div>
                                      </Box>
                                      <Box display="flex">
                                          <Box>
                                              <img
                                                  style={{marginTop: '15px', marginRight: '10px'}}
                                                  alt="Logo"
                                                  src="/images/moeda.png" width='35px'/>
                                          </Box>
                                          <div style={{ width: '100%' }}>
                                              <Box display="flex">
                                                  <Box display="flex" alignItems="row">
                                                      <div className={classesGeneral.paperTitleTextBold} style={{marginTop: '20px'}}>
                                                          {totalRP + ' PR'}
                                                      </div>
                                                  </Box>
                                              </Box>
                                              <Box display="flex" alignItems="row">
                                                  <Link
                                                      component="button"
                                                      variant="body2"
                                                      onClick={handleClickOpenDialogRP}>
                                                      Histórico
                                                  </Link>
                                              </Box>
                                          </div>
                                      </Box>
                                      <Box display="flex" alignItems="row">
                                          <Box>
                                              <img
                                                  style={{marginTop: '15px', marginRight: '10px'}}
                                                  alt="Logo"
                                                  src="/images/distintivo.png" width='36px'/>
                                          </Box>
                                          <div style={{ width: '100%' }}>
                                              <Box display="flex">
                                                  <Box display="flex" alignItems="row">
                                                      <div className={classesGeneral.paperTitleTextBold} style={{marginTop: '20px'}}>
                                                          {totalXP + ' XP'}
                                                      </div>
                                                  </Box>
                                              </Box>
                                              <Box display="flex" alignItems="row">
                                                  <Link
                                                      component="button"
                                                      variant="body2"
                                                      onClick={handleClickOpenDialogXP}>
                                                      Histórico
                                                  </Link>
                                              </Box>
                                          </div>
                                      </Box>
                                  </Grid>
                                  <Grid item xs={1}>
                                      <Divider orientation="vertical" style={{marginTop: '5px', padding: '2px'}}/>
                                  </Grid>
                                  <Grid item xs={5}>
                                      <Box display="flex" alignItems="row">
                                          <img
                                              style={{marginTop: '15px', marginRight: '10px'}}
                                              alt="Logo"
                                              src="/images/caixa-de-presente.png" width='35px'/>
                                          <div className={classesGeneral.paperTitleTextBold} style={{marginTop: '25px'}}>
                                              {'Conquistas:'}
                                          </div>
                                      </Box>
                                      <div className={classesGeneral.textRedInfo} style={{marginTop: '25px'}}>
                                          {'Você não tem conquistas nesta turma.'}
                                      </div>

                                  </Grid>
                              </Grid>
                          </Paper>

                      </Box>
                  )}
          <Dialog
              open={openDialogRP}
              onClose={handleCloseDialogRP}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">
                  {"Histório da Pontuação Reutilizável"}
              </DialogTitle>
              <DialogContent>

                  {historyRP ? historyRP.map((history, i) => (
                      <DialogContentText id="alert-dialog-description">
                          {history.type === "C" ?
                              '+'+ history.point +' pontos de CRÉDITO no dia '+moment(history.created_at).format('DD/MM/YYYY')+' ('+ history.config_gamification.description+')'
                              : '-'+history.point +' pontos de DÉBITO no dia '+moment(history.created_at).format('DD/MM/YYYY')+' ('+ history.config_gamification.description+')'
                          }
                      </DialogContentText>

                  )) : null}

              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseDialogRP} autoFocus>
                      Fechar
                  </Button>
              </DialogActions>
          </Dialog>

          <Dialog
              open={openDialogXP}
              onClose={handleCloseDialogXP}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">
                  {"Histório da pontuação XP"}
              </DialogTitle>
              <DialogContent>

                  {historyXP ? historyXP.map((history, i) => (
                      <DialogContentText id="alert-dialog-description">
                          {history.point +' pontos no dia '+moment(history.created_at).format('DD/MM/YYYY')+' ('+ history.config_gamification.description+')' }
                      </DialogContentText>

                  )) : null}

              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseDialogXP} autoFocus>
                      Fechar
                  </Button>
              </DialogActions>
          </Dialog>
      </div>
    );
};

GamificationPanel.propTypes = {
    className: PropTypes.string,
    gamified_class: PropTypes.number,
    classId: PropTypes.number
};

export default withRouter(GamificationPanel);
