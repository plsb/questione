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
    DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@material-ui/core';
import {Link as RouterLink, withRouter} from "react-router-dom";
import api from "../../services/api";
import moment from "moment";
import useStyles from "../../style/style";
import TooltipQuestione from "../TooltipQuestione";
import InfoIcon from '@material-ui/icons/Info';

const useStylesLocal = makeStyles(theme => ({

}));

const GamificationPanel = props => {
    const { className, history, question, gamified_class, classId, refresh, ...rest } = props;

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
                              <Divider orientation="vertical" style={{marginTop: '5px', padding: '2px'}}/>
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
                                      {'Atingir 5 questões corretas'}
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
                                      {'Atingir 10 questões corretas'}
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
                                      {'Gênio da turma '}
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
                                      {'Oráculo'}
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
                                      {'Estudioso!'}
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
                                      {'+10 XP'}
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
                                      {'+10 XP'}
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
                                      {'+20 XP'}
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
                                      {'+50 PR'}
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
                                      {'+20 PR'}
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
                                      {'-15 PR'}
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
                                      {'-20 PR'}
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
                                      {'-25 PR'}
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
                                      {'+50 PR'}
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
                                      {'+50 PR'}
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
                                      {'+60 PR'}
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
                                      {'+50 PR'}
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
                                      {'+40 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Gênio da turma '}
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
                                      {'Conquista: Oráculo'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+80 PR'}
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
                                      {'+50 PR'}
                                  </div>
                              </TableCell>
                          </TableRow>
                          <TableRow key={1}>
                              <TableCell align="left">
                                  <div className={classesGeneral.messageDialog}>
                                      {'Conquista: Estudioso!'}
                                  </div>
                              </TableCell>
                              <TableCell align="center">
                                  <div className={classesGeneral.messageDialog}>
                                      {'+90 PR'}
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
      </div>
    );
};

GamificationPanel.propTypes = {
    className: PropTypes.string,
    gamified_class: PropTypes.number,
    classId: PropTypes.number
};

export default withRouter(GamificationPanel);
