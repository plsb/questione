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
    DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, AppBar, Toolbar, CardMedia
} from '@material-ui/core';
import {Link as RouterLink, withRouter} from "react-router-dom";
import api from "../../services/api";
import moment from "moment";
import useStyles from "../../style/style";
import TooltipQuestione from "../TooltipQuestione";
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from "@material-ui/icons/Close";

const useStylesLocal = makeStyles(theme => ({

    appBar: {
        position: 'relative',
        background: '#3a7cf7',
    },
    fontNarrativeTitle: {
        fontSize: '22px',
        fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif',
        fontWeight: 'bold'
    },
    fontNarrative: {
        fontSize: '18px',
        fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif'
    }

}));

const GamificationPanel = props => {
    const { className, history, question, gamified_class, classId, refresh, ...rest } = props;

    const [openDialogNarrative, setOpenDialogNarrative] = React.useState(false);
    const [openDialogRP, setOpenDialogRP] = React.useState(false);
    const [openDialogInfoRP, setOpenDialogInfoRP] = React.useState(false);
    const [openDialogXP, setOpenDialogXP] = React.useState(false);
    const [openDialogInfoXP, setOpenDialogInfoXP] = React.useState(false);
    const [openDialogBadge, setOpenDialogBadge] = React.useState(false);
    const [openDialogAllBadges, setOpenDialogAllBadges] = React.useState(false);
    const [historyRP, setHistoryRP] = useState(null);
    const [historyXP, setHistoryXP] = useState(null);
    const [totalXP, setTotalXP] = useState(0);
    const [totalRP, setTotalRP] = useState(0);
    const [rankPositionText, setRankPositionText] = useState('0/0');
    const [rankPosition, setRankPosition] = useState(null);
    const [badges, setBadges] = useState(null);

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

    async function loadBadges(){
        try {
            let url = `class/student/gamification/badges/${classId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setBadges(response.data);
            } else {
                setBadges([]);
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

    const handleOpenDialogAllBadges = () => {
        setOpenDialogAllBadges(true);
    };

    const handleCloseDialogAllBadges = () => {
        setOpenDialogAllBadges(false);
    };

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

    const handleClickOpenDialogInfoXP = () => {
        setOpenDialogInfoXP(true);
    };

    const handleCloseDialogInfoXP = () => {
        setOpenDialogInfoXP(false);
    };

    const handleClickOpenDialogInfoRP = () => {
        setOpenDialogInfoRP(true);
    };

    const handleCloseDialogInfoRP = () => {
        setOpenDialogInfoRP(false);
    };

    const handleClickOpenDialogBadge = () => {
        setOpenDialogBadge(true);
    };

    const handleCloseDialogBadge = () => {
        setOpenDialogBadge(false);
    };

    const handleOpenDialogNarrative = () => {
        setOpenDialogNarrative(true);
    };
    const handleCloseDialogNarrative = () => {
        setOpenDialogNarrative(false);
    };

    useEffect(() => {
        loadHistoryRP();
        loadHistoryXP();
        loadTotalXP();
        loadTotalRP();
        loadRankPosition();
        loadBadges();

    }, [refresh]);



    return (
      <div className={classes.content}>
              <Box>
                  <Paper style={{paddingTop: '5px', paddingBottom: '20px', paddingRight: '20px', paddingLeft: '20px',}}>

                      <Grid
                          container
                          spacing={0}
                          direction="column"
                          alignItems="center"
                          justify="center"
                          style={{ minHeight: '100h' }}>
                      <TooltipQuestione description={'Clique aqui para explorar a narrativa e obtenha informações detalhadas sobre o Questione Gamificado! 🌐🔍✨'} position={'bottom'} content={
                          <Box display="flex">
                              <Box>
                                  <img
                                      style={{marginTop: '15px', marginRight: '10px'}}
                                      alt="Logo"
                                      src="/images/control-video-game.png" width='36px'/>
                              </Box>
                              <Box>
                                      <div className={classesGeneral.paperTitleTextBold} style={{marginTop: '20px', fontSize: '16px'}}>
                                          Painel de desempenho:
                                      </div>
                              </Box>
                              <Box >
                                  <IconButton
                                      onClick={handleOpenDialogNarrative}>
                                      <InfoIcon style={{width: '19px'}}  />
                                  </IconButton>
                              </Box>
                          </Box>
                          }/>
                      </Grid>

                      <Divider style={{marginTop: '5px'}}/>

                      <Grid container spacing={1}>
                          <Grid item xs={6}>

                              <TooltipQuestione description={'Sua posição nesta turma é calculada com base nos seus pontos de experiência (XP). Em caso de empate, a batalha é decidida pelo número de conquistas e pela quantidade de simulados resolvidos. É uma competição amigável e inteligente! 💪🏆😄'} position={'bottom'} content={
                                  <Box display="flex" alignItems="row">
                                      <img
                                          style={{marginTop: '15px', marginRight: '10px'}}
                                          alt="Logo"
                                          src="/images/podio.png" width='35px'/>
                                      <div className={classesGeneral.paperTitleTextBold} style={{marginTop: '22px'}}>
                                          {'Sua posição: '+rankPositionText}
                                      </div>
                                  </Box>

                              }/>
                              <TooltipQuestione description={'Pontos reutilizáveis (PR) são pontos que você pode usar para obter assistência no Questione. Para visualizar como você adquiriu ou utilizou esses pontos, clique em "histórico".'} position={'bottom'} content={
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
                                              <IconButton
                                                  style={{marginTop: '11px', marginLeft: '2px'}}
                                                  size='small'
                                                  onClick={handleClickOpenDialogInfoRP}>
                                                  <InfoIcon style={{width: '15px'}}  />
                                              </IconButton>
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
                              }/>
                              <TooltipQuestione description={'Pontos de experiência (XP) são pontos que você adquire no Questione ao resolver os simulados, e eles influenciam sua posição no ranking. Para revisar como você obteve esses pontos, clique em "histórico".'} position={'bottom'} content={
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
                                              <IconButton
                                                  style={{marginTop: '11px', marginLeft: '2px'}}
                                                  size='small'
                                                  onClick={handleClickOpenDialogInfoXP}>
                                                  <InfoIcon style={{width: '15px'}}  />
                                              </IconButton>
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
                              }/>

                          </Grid>
                          <Grid item xs={1}>
                              <Divider orientation="vertical" style={{marginTop: '5px', padding: '1px'}}/>
                          </Grid>
                          <Grid item xs={5}>
                              <TooltipQuestione description={"Conquistas são distintivos que você ganha no Questione ao realizar os simulados."}
                                                position={'top-start'} content={
                              <Box display="flex" alignItems="row">

                                          <img
                                              style={{marginTop: '15px', marginRight: '10px'}}
                                              alt="Logo"
                                              src="/images/caixa-de-presente.png" width='35px'/>
                                          <div className={classesGeneral.paperTitleTextBold} style={{marginTop: '25px'}}>
                                              {'Conquistas:'}
                                          </div>
                                            <div style={{marginTop: '18px', marginLeft: '5px'}}>
                                                <IconButton
                                                    size='small'
                                                    onClick={handleClickOpenDialogBadge}>
                                                    <InfoIcon style={{width: '15px'}}  />
                                                </IconButton>
                                            </div>

                              </Box>
                                  }/>
                              <Divider style={{marginTop: '5px'}}/>
                              <Box display="flex" alignItems="row">
                                  <Grid container>
                                    {badges && badges.length>0 ?
                                        <Grid container>
                                            {badges.map((badge, i) => (
                                               <Grid item xs={4} sm={4} md={4} lg={4} xl={4} style={{marginTop: '10px'}}>
                                                          <TooltipQuestione description={badge.badges_settings.description} position={'top-start'} content={
                                                                  <img
                                                                      src={badge.badges_settings.image ? "/images/medals/"+badge.badges_settings.image : "/images/404.png"}
                                                                      style={{marginRight: '5px', width:'35px'}}/>
                                                          }/>
                                                      </Grid>
                                              ))}
                                            <Box>
                                                <Link
                                                    component="button"
                                                    variant="body2"
                                                    style={{fontSize: '13px', marginTop: '20px'}}
                                                    onClick={handleOpenDialogAllBadges}>
                                                    Todas as conquistas...
                                                </Link>
                                            </Box>
                                            <Dialog
                                                open={openDialogAllBadges}
                                                onClose={handleCloseDialogAllBadges}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description">
                                                <DialogTitle id="alert-dialog-title">
                                                    {<div className={classesGeneral.titleDialog}>
                                                        {"Suas Conquistas: O Desfile do Sucesso! "}
                                                    </div>}
                                                </DialogTitle>
                                                <DialogContent>
                                                    <div className={classesGeneral.messageDialog}>
                                                            <DialogContentText id="alert-dialog-description">
                                                                <Table className={classes.table} size="small" aria-label="a dense table">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell align="left">
                                                                                <div className={classesGeneral.paperTitleText} >
                                                                                    Conquista
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {badges && badges.length>0 ?
                                                                            badges.map((badge, i) => (
                                                                                <TableRow key={1}>
                                                                                    <TableCell align="left">
                                                                                        <Box display={'flex'}>
                                                                                            <div className={classesGeneral.messageDialog} style={{color: '#3a7cf7', fontWeight: 'bold', fontSize: '18px', marginTop: '8px', marginRight: '5px'}}>
                                                                                                {badge.total+'x '}
                                                                                            </div>
                                                                                            <div>
                                                                                                <img
                                                                                                    src={badge.badges_settings.image ? "/images/medals/"+badge.badges_settings.image : "/images/404.png"}
                                                                                                    style={{marginRight: '5px', width:'40px'}}/>
                                                                                            </div>
                                                                                            <div className={classesGeneral.messageDialog} style={{marginTop: '8px', marginLeft: '5px'}}>
                                                                                                {badge.badges_settings.description}
                                                                                            </div>
                                                                                        </Box>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )) : null}

                                                                    </TableBody>
                                                                </Table>

                                                            </DialogContentText>
                                                    </div>

                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleCloseDialogAllBadges} autoFocus>
                                                        Fechar
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>



                                        </Grid>
                                        :
                                        <div>
                                            <div className={classesGeneral.textRedInfo} style={{marginTop: '25px'}}>
                                                {'Você não tem conquistas nesta turma. '}
                                            </div>
                                            <div className={classesGeneral.paperTitleText} style={{marginTop: '5px'}}>
                                                <Link
                                                    onClick={handleClickOpenDialogBadge}>
                                                        {'Como ganhar?'}
                                                </Link>
                                            </div>
                                        </div>
                                    }
                                  </Grid>
                              </Box>

                          </Grid>
                      </Grid>
                  </Paper>

              </Box>
          <Dialog
              open={openDialogRP}
              onClose={handleCloseDialogRP}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">
                  {<div className={classesGeneral.titleDialog}>
                      {"Histório da Pontuação Reutilizável"}
                  </div>}
              </DialogTitle>
              <DialogContent>

                  {historyRP ? historyRP.map((history, i) => (
                      <DialogContentText id="alert-dialog-description">
                          <div className={classesGeneral.messageDialog}>
                              {history.type === "C" ?
                                  '+'+ history.point +' pontos de CRÉDITO no dia '+moment(history.created_at).format('DD/MM/YYYY')+' ('+ history.config_gamification.description+')'
                                  : history.point +' pontos de DÉBITO no dia '+moment(history.created_at).format('DD/MM/YYYY')+' ('+ history.config_gamification.description+')'
                              }
                          </div>
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
                  {<div className={classesGeneral.titleDialog}>
                      {"Histório da pontuação XP"}
                  </div>}
              </DialogTitle>
              <DialogContent>
                  <div className={classesGeneral.messageDialog}>
                      {historyXP ? historyXP.map((history, i) => (
                          <DialogContentText id="alert-dialog-description">
                              <div className={classesGeneral.messageDialog}>
                                {'+'+history.point +' pontos no dia '+moment(history.created_at).format('DD/MM/YYYY')+' ('+ history.config_gamification.description+')' }
                              </div>
                          </DialogContentText>

                      )) : null}
                  </div>

              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseDialogXP} autoFocus>
                      Fechar
                  </Button>
              </DialogActions>
          </Dialog>

          <Dialog
              open={openDialogBadge}
              onClose={handleCloseDialogBadge}
              aria-labelledby="alert-dialog-title2"
              aria-describedby="alert-dialog-description2">
              <DialogTitle id="alert-dialog-title2">
                  {<div className={classesGeneral.titleDialog}>
                      {"Informações de como ganhar conquistas"}
                  </div>}
              </DialogTitle>
              <DialogContent>
                  <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead>
                          <TableRow>
                              <TableCell align="left">Descrição</TableCell>
                              <TableCell align="center">Conquista</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Acumular 5 acertos'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'5 é D+!'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Acumular 10 acertos'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'10 é D+!'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Acumular 20 acertos'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'20 é D+!'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Obter uma posição entre os três primeiros do ranking'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Medalha de ouro'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Obter uma posição entre os três primeiros do ranking'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Medalha de prata'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Obter uma posição entre os três primeiros do ranking'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Medalha de bronze'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Acumular duas medalhas de ouro'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Mente binária'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Acertar completamente dois simulados'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Brilhante'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Responder um simulado no mesmo dia que foi publicado '}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Pontual'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conseguir 100 pontos de experiência '}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Ninja da Computação (100XP)'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conseguir 200 pontos de experiência '}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Estudioso 200PX!'}
                                  </div>
                              </TableCell>
                          </TableRow>
                      </TableBody>
                  </Table>

              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseDialogBadge} autoFocus>
                      Fechar
                  </Button>
              </DialogActions>
          </Dialog>

          {/*Informações de como ganhar XP*/}
          <Dialog
              open={openDialogInfoXP}
              onClose={handleCloseDialogInfoXP}
              aria-labelledby="alert-dialog-title2"
              aria-describedby="alert-dialog-description2">
              <DialogTitle id="alert-dialog-title2">
                  {<div className={classesGeneral.titleDialog}>
                      {"Informações de como ganhar pontos de experiência (XP)"}
                  </div>}
              </DialogTitle>
              <DialogContent>
                  <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead>
                          <TableRow>
                              <TableCell align="left">Descrição</TableCell>
                              <TableCell align="center">XP</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Acertar cada questão do teste'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+15 XP'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Finalizar um simulado'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+5 XP'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Acertar todas as questões de um simulado '}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+30 XP'}
                                  </div>
                              </TableCell>
                          </TableRow>
                      </TableBody>
                  </Table>

              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseDialogInfoXP} autoFocus>
                      Fechar
                  </Button>
              </DialogActions>
          </Dialog>

          {/*Informações de como ganhar RP*/}
          <Dialog
              open={openDialogInfoRP}
              onClose={handleCloseDialogInfoRP}
              aria-labelledby="alert-dialog-title2"
              aria-describedby="alert-dialog-description2">
              <DialogTitle id="alert-dialog-title2">
                  {<div className={classesGeneral.titleDialog}>
                      {"Informações de como ganhar e utilizar pontos reutilizáveis (PR)"}
                  </div>}
              </DialogTitle>
              <DialogContent>
                  <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead>
                          <TableRow>
                              <TableCell align="left">Descrição</TableCell>
                              <TableCell align="center">PR</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Ingressar em uma Turma'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+70 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Finalizar um simulado'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+10 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Acertar todas as questões de um simulado '}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+30 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Ajuda: Apagar uma alternativa errada'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'-10 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Ajuda: Apagar duas alternativas erradas'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'-20 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Ajuda: Apagar três alternativas erradas'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'-30 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Ajuda: Ajuda dos universitários'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'-30 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: 5 é D+!'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+20 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: 10 é D+!'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+30 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: 20 é D+!'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+40 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Medalha de ouro'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+30 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Medalha de prata'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+20 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Medalha de bronze'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+15 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Mente binária '}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+50 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Brilhante'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+50 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Pontual'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+30 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Nija da Computação (100PX)'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+20 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Estudioso 200PX!'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+30 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                      </TableBody>
                  </Table>

              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseDialogInfoRP} autoFocus>
                      Fechar
                  </Button>
              </DialogActions>
          </Dialog>

          <Dialog
              open={openDialogNarrative}
              fullScreen
              onClose={handleCloseDialogNarrative}
              aria-labelledby="simple-dialog-title">
              <div>
                  <AppBar className={classes.appBar}>
                      <Toolbar>
                          <IconButton edge="start" color="inherit" onClick={handleCloseDialogNarrative} aria-label="close">
                              <CloseIcon />
                          </IconButton>
                          <div className={classesGeneral.titleList} style={{color: '#FFF', marginBottom: '15px'}}>
                              Narrativa
                          </div>
                      </Toolbar>
                  </AppBar>
                  <Grid
                      container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justify="center"
                      style={{ minHeight: '100h' }}>

                          <Grid item xs={8} style={{ marginTop: '25px' }}>
                              <div style={{textAlign: 'center', marginBottom: '50px'}}>
                                  <img
                                      alt="Logo"
                                      src="/images/imagemNarrativa.png" width='500px'/>
                              </div>

                              <p className={classes.fontNarrativeTitle}> <b>Sua aventura começa assim...</b> </p>
                              <p className={classes.fontNarrative}>
                                  <b>Alana Gitrun</b> é uma dedicada estudante de computação que se destaca por sua paixão pela tecnologia e a ciência.
                                  Seu grande sonho é um dia desenvolver pesquisas na área de tecnologia da informação, com trabalhos reconhecidos em todo o mundo, seguindo os passos de seus ídolos:
                                  Alan Turing, Ada Lovelace e Grace Hopper.</p>
                              <p className={classes.fontNarrative}>
                                  Um dia, enquanto mergulhava em linhas de código e algoritmos, um e-mail especial chegou à sua caixa de entrada.
                                  Era nada menos que uma convocação da prestigiada empresa de pesquisa e desenvolvimento, conhecida por abrigar as mentes mais brilhantes da área.
                                  O e-mail anunciava a abertura de uma seleção para novos talentos e convidava Alana a participar.
                              </p>
                              <p className={classes.fontNarrative}>
                                  Alana sente o coração bater forte, e sem hesitar um segundo sequer, viu nessa oportunidade a chance de trilhar o caminho para realizar seus sonhos mais ambiciosos.
                                  Determinada e com um sorriso que não cabia no rosto, Alana clica no link. A tela se transforma em um portal virtual, transportando-a para um universo digital vibrante.
                              </p>
                              <p className={classes.fontNarrative}>
                                  <b>Nesse momento, uma assistente virtual a saúda: </b>
                              </p>
                              <CardMedia width="892" height="502"
                                         component="iframe" src="https://www.youtube.com/embed/dAJBXoCoYGQ"
                              style={{marginBottom: '50px'}}/>

                              <div class="container" style={{textAlign: 'center'}} className={classes.fontNarrativeTitle}>
                                  <b>Painel de desempempo</b>
                              </div>
                              <Divider style={{marginTop: '5px'}}/>

                              <p className={classes.fontNarrative}>
                                  O painel de desempenho é utilizado quando o módulo gamificado em uma turma está sendo aplicado.
                                  Desta forma, o painel é responsável por apresentar ao aluno todos os elementos utilizados na versão gamificada do Questione,
                                  principalmente em relação ao seu desempenho. Assim, ele contém informações referentes ao desempenho do aluno,
                                  como suas conquistas e como ele pode adquirir novas. Os elementos apresentados no painel de desempenho são os seguintes:
                              </p>

                              <ol className={classes.fontNarrative}>
                                  <li style={{margin: '15px'}}><b>Ranking:</b> Mostra, apenas para o aluno, a sua posição em relação aos demais.
                                      Para o seu cálculo é considerado os XP(Experience Points), adquiridos no decorrer dos simulados.</li>
                                  <li style={{margin: '15px'}}><b>Pontos de experiências (XP):</b> Do inglês Experience Points - XP, são pontos de experiências adquiridos conforme o desempenho dos alunos nos simulados.</li>
                                  <li style={{margin: '15px'}}><b>Pontos Reutilizáveis (PR):</b> É a nossa moeda virtual, SiCoin (Si é sigla do silício na tabela periódica - metal utilizado para a produção de circuitos eletrônicos), que representa os pontos adquiridos conforme a execução dos desafios e aquisição de novas conquistas.</li>
                                  <li style={{margin: '15px'}}><b>Conquistas:</b> Representam todos os badges (emblemas/ícones) adquiridas conforme o  desempenho do aluno nos simulados. Todos os disponíveis para aquisição, estão representados a seguir:</li>
                              </ol>

                              <table style={{textAlign: 'center', marginBottom: '50px'}} border="1px">
                                  <tr>
                                      <td style={{padding: '15px'}}><b>Badges</b></td>
                                      <td style={{padding: '15px'}}><b>Descrição</b></td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                          alt="Logo"
                                          src="/images/medals/medal_top_5.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>5 é demais!</b> - Adquirido ao acumular 5 questões corretas.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_top_10.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>10 é demais!</b> - Adquirido ao acumular 10 questões corretas.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_top_20.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>20 é demais!</b> - Adquirido ao acumular 20 questões corretas.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_bronze.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Medalha de bronze</b> - Atingir o 3° lugar no ranking.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_silver.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Medalha de prata</b> - Atingir o 2° lugar no ranking.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_gold.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Medalha de ouro</b> - Atingir o 1° lugar no ranking.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_oracle.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Brilhante</b> - Acertar completamente 2 simulados.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_pontual.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Pontual</b> - Adquirido quando um simulado é respondido no mesmo dia em que ele foi publicado.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_two_medals_gold.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Mente binária</b> - Adquirido quando são acumuladas 2 medalhas de ouro.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_star_100.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Pergaminho da sabedoria</b> - Adquirido quando atingir 100 XP.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_star_200.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Ninja da Computação</b> - Adquirido quando atingir 200 XP.  </td>
                                  </tr>
                                  <tr>
                                      <td style={{padding: '15px'}}>
                                          <img
                                              alt="Logo"
                                              src="/images/medals/medal_star_400.png" width='70px'/></td>
                                      <td style={{padding: '15px'}}><b>Surpreendente</b> - Adquirido quando atingir 400 XP.  </td>
                                  </tr>

                              </table>
                          </Grid>
                      </Grid>
              </div>
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
