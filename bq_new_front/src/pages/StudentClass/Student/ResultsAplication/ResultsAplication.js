import React, { useEffect, useState } from 'react';

import {
    Card,
    CardHeader,
    Divider,
    CardContent,
    Tabs,
    Tab,
    Box,
    Typography,
    IconButton,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    CardMedia,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ResultsByTest from './ResultsByTest/ResultsByTest';
import ResultsGeneral from './ResultsGeneral/components/ResultsGeneral';
import {makeStyles} from "@material-ui/styles";
import api from "../../../../services/api";
import moment from "moment/moment";

const useStyles = makeStyles(theme => ({
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
        borderRadius: 3,
        border: 0,
        height: 48,
        marginTop: '5px',
        padding: '0 30px',
    },
    root: {
        display: 'flex',
        marginBottom: '30px',
        height: '100px'
    },
    cover: {
        width: 151,
    },
    div: {
        margin: '0px'
    }
}));

const ResultsAplication = props =>{

    const classes = useStyles();

    const { className, history, studentClassId, fk_class_id } = props;

    const [classStudent, setClassStudent] = useState(null);
    const [totalXP, setTotalXP] = useState(null);
    const [totalRP, setTotalRP] = useState(null);
    const [historyXP, setHistoryXP] = useState(null);
    const [historyRP, setHistoryRP] = useState(null);
    const [rankPositionText, setRankPositionText] = useState(null);
    const [rankPosition, setRankPosition] = useState(null);

    const [openDialogXP, setOpenDialogXP] = React.useState(false);
    const [openDialogRP, setOpenDialogRP] = React.useState(false);

    async function loadClassStudent(){
        try {
            let url = `class/student/show/${studentClassId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setClassStudent(response.data);
            } else {
                setClassStudent([]);
            }

        } catch (error) {

        }
    }

    async function loadTotalXP(){
        try {
            let url = `class/student/gamification/totalxp/${studentClassId}`;
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
            let url = `class/student/gamification/totalrp/${studentClassId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setTotalRP(response.data);
            } else {
                setTotalRP([]);
            }

        } catch (error) {

        }
    }

    async function loadHistoryXP(){
        try {
            let url = `class/student/gamification/historyxp/${studentClassId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setHistoryXP(response.data);
            } else {
                setHistoryXP([]);
            }

        } catch (error) {

        }
    }

    async function loadHistoryRP(){
        try {
            let url = `class/student/gamification/historyrp/${studentClassId}`;
            const response = await api.get(url);

            if(response.status == 200) {
                setHistoryRP(response.data);
            } else {
                setHistoryRP([]);
            }

        } catch (error) {

        }
    }

    async function loadRankPosition(){
        try {
            let url = `class/student/gamification/rankPosition/${studentClassId}`;
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

    useEffect(() => {
        loadClassStudent();
        loadTotalXP();
        loadTotalRP();
        loadRankPosition();
        loadHistoryXP();
        loadHistoryRP();
    }, []);

    const handleClickOpenDialogXP = () => {
        setOpenDialogXP(true);
    };

    const handleCloseDialogXP = () => {
        setOpenDialogXP(false);
    };

    const handleClickOpenDialogRP = () => {
        setOpenDialogRP(true);
    };

    const handleCloseDialogRP = () => {
        setOpenDialogRP(false);
    };

    return(
        <div>
            { !classStudent ? null :  classStudent.gamified_class == 1 ?
                <Grid container className={classes.root} spacing={4}>
                    <Grid item xs={3}>
                        <Card className={classes.root}>
                            <img
                                src={rankPosition <= 3 ? `/images/classification_${rankPosition}.png`
                                        : `/images/classification_X.png`}
                                alt="Total de XP"
                                loading="lazy"
                                width="100"
                                height="100px"
                            />
                            <CardContent className={classes.content}>
                                <Typography variant="h3" gutterBottom>
                                    {rankPositionText}
                                </Typography>
                                <Typography variant="button" display="block" gutterBottom>
                                    Ranking
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card className={classes.root}>
                            <img
                                src="/images/target.png"
                                alt="Total de XP"
                                loading="lazy"
                                width="100"
                                height="100px"
                            />
                            <CardContent className={classes.content}>
                                <Typography variant="h3" gutterBottom>
                                    {totalXP+' pontos'}
                                </Typography>
                                <Typography variant="button" display="block" gutterBottom>
                                    Total de XP
                                </Typography>
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleClickOpenDialogXP}>
                                    Histórico
                                </Link>

                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card className={classes.root}>
                            <img
                                src="/images/gold.png"
                                alt="Total de PR"
                                loading="lazy"
                                width="100"
                                height="100px"
                            />
                            <CardContent className={classes.content}>
                                <Typography variant="h3" gutterBottom>
                                    {totalRP}
                                </Typography>
                                <Typography variant="button" display="block" gutterBottom>
                                    Moeda de troca
                                </Typography>
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleClickOpenDialogRP}>
                                    Histórico
                                </Link>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                : null}

            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Typography>Visão Geral</Typography>
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
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header">
                    <Typography>Resultados por Simulado</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        spacing={1}>
                        <Grid
                            item
                            md={12}
                            xs={12}>
                            <ResultsByTest studentClassId={studentClassId}/>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

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
        </div>
    );
}

export default ResultsAplication;