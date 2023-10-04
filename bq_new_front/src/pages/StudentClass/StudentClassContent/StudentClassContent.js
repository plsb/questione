import React, { useEffect, useState } from 'react';

import api from "../../../services/api";
import {
    Card,
    CardHeader,
    Tabs,
    Tab,
    Box,
    Typography,
    IconButton,
    Paper,
    Grid,
    Link,
    AppBar,
    Toolbar,
    Dialog,
    Breadcrumbs, Button, LinearProgress, TablePagination, List, Divider, ListItem, ListItemText, Hidden,
} from '@material-ui/core';

import People from './People';
import ApplicationTable from './Application/EvaluationApplicationTable';
import ResultsAplicationProfessor from '../Professor/ResultsAplication/ResultsAplication';
import ApplicationListStudent from '../Student/ApplicationListStudent/ApplicationListStudent';
import {makeStyles} from "@material-ui/styles";
import useStyles from "./../../../style/style";
import CloseIcon from "@material-ui/icons/Close";
import GamificationPanel from "../../../components/GamificationPanel";
import {CharmHome} from "../../../icons/Icons";
import moment from "moment";
import EvaluationQuestions from "../../../components/EvaluationQuestions/EvaluationQuestions";
import {toast} from "react-toastify";
import TooltipQuestione from "../../../components/TooltipQuestione";

const useStylesLocal = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    content: {
        padding: 0,
        marginTop: theme.spacing(1)
    },
    chipgreen:{
        margin: 3,
        backgroundColor: '#009688',
        color: '#ffebee',
    },
    appBar: {
        position: 'relative',
        background: '#3a7cf7',
    },
}));


const StudentClassContent = props => {

    const { className, history, location, ...rest } = props;

    const studentClassId = location.pathname.replace('/student-class/', '');
    const level_user = localStorage.getItem("@Questione-acess-level-user");

    let initialTabValue = 0;

    if (localStorage.getItem('@questione/student-class-tab')) {
        initialTabValue = localStorage.getItem('@questione/student-class-tab');
    } else {
        if (level_user === '0') {
            initialTabValue = 3;
        }
    }
    
    const [refresh, setRefresh] = React.useState(1);
    const [tabValue, setTabValue] = useState(parseInt(initialTabValue));

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    const [classProfessor, setClassProfessor] = useState(null);
    const [openDialogPeople, setOpenDialogPeople] = React.useState(false);

    const [evaluationSelected, setEvaluationSelected] = useState(null);
    const [openNewApplication, setOpenNewApplication] = React.useState(false);
    const [evaluations, setEvaluations] = useState(null);
    const [totalEvaluations, setTotalEvaluations] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const loadEvaluations = async (page) => {
        try {
            let status = 1;
            const response = await api.get(`evaluation`, {
                params: {
                    status,
                    page
                },
            });

            if (response.status == 200) {
                setTotalEvaluations(response.data.total);
                setEvaluations(response.data.data);
            } else {
                setEvaluations([]);
            }

        } catch (e) {

        }
    };
    const handlePageChangeEvaluations = (event, page) => {
        loadEvaluations(page + 1, 1)
        setPage(page);
    };

    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value);
    };

    const handleCloseDialogPeople = () => {
        setOpenDialogPeople(false);
    }

    async function loadClassProfessor(){
        try {
          let url = `class/student/show/${studentClassId}`;
          const response = await api.get(url);
          
          if(response.status == 200) {  
            setClassProfessor(response.data);
          } else {
            setClassProfessor([]);
          }
          
        } catch (error) {

        }
      }


    const a11yProps = (index) => {
        return {
            id: `nav-tab-${index}`,
            'aria-controls': `nav-tabpanel-${index}`,
        };
    }

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;
        
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`nav-tabpanel-${index}`}
                aria-labelledby={`nav-tab-${index}`}
                {...other}>
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    const LinkTab = (props) => {
        return (
            <Tab
                component="a"
                onClick={(event) => {
                    event.preventDefault();
                }}
                {...props}
            />
        );
    }

    const handleChangeTab = (event, newValue) => {
        localStorage.setItem('@questione/student-class-tab', newValue);
        setTabValue(newValue);
    };

    useEffect(() => {
        loadEvaluations(1);
        loadClassProfessor();
    }, []);

    const handleNewApplicationExit = () => {
        setOpenNewApplication(false);
        setEvaluationSelected(null);
    }

    const handleNewApplication = () => {
        setOpenNewApplication(true);
    };

    async function newApplication(){
        if(evaluationSelected != null){
            try {

                const fk_evaluation_id = evaluationSelected.id;
                const description = evaluationSelected.description + ' (Simulado de '+new Date().toLocaleDateString('pt-BR')+')';
                const fk_class_id = studentClassId;
                const data = {
                    description, fk_evaluation_id, fk_class_id
                }
                const response = await api.post('evaluation/add-application', data);
                if (response.status === 202) {
                    if(response.data.message){
                        toast.error(response.data.message);
                    }
                    setOpenNewApplication(false);
                    setEvaluationSelected(null);
                } else {
                    toast.success('Nova aplicação cadastrada.');
                    setOpenNewApplication(false);
                    setEvaluationSelected(null);
                    window.location.reload();
                }

            } catch (error) {

            }

        }
    }

    return (
        <div className={classesGeneral.root}>
            <Box display="flex">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/">
                        <Box display="flex">
                            <Box style={{marginTop: '2px', marginRight: '5px'}}>
                                <CharmHome/>
                            </Box>
                            <Box>
                                Início
                            </Box>
                        </Box>
                    </Link>
                    <Link color="inherit" onClick={() => history.goBack()}>
                        {localStorage.getItem('@Questione-acess-level-user') === "2" ? 'Turmas' : 'Minhas turmas'}
                    </Link>
                    <div color="inherit">
                        Turma {classProfessor && classProfessor.id_class}
                    </div>
                </Breadcrumbs>
            </Box>
            <Card className={classes.root}>
                <CardHeader
                    title={
                        <div>
                            <Grid container direction="row" xs={12}>
                                <Grid item xs={12} sm={12} md={7} style={{marginBottom: '20px'}}>
                                    <Box display="flex" alignItems="row">
                                        <Hidden smDown>
                                            <Box>
                                                { classProfessor
                                                    && (classProfessor.gamified_class === 1 &&
                                                        <img
                                                            style={{marginTop: '20px', marginRight: '10px'}}
                                                            alt="Logo"
                                                            src="/images/videogame.png" width='100px'/>
                                                    )}

                                            </Box>
                                        </Hidden>
                                        <Box>
                                            { classProfessor
                                                &&
                                                <div>
                                                    <div className={classesGeneral.titleList}>
                                                        {classProfessor.id_class+' - '+classProfessor.description}
                                                    </div>
                                                    <div className={classesGeneral.paperTitleTextBold} style={{fontSize: '15px', marginTop: '30px'}}>
                                                        {'Professor: '+classProfessor.user.name}
                                                    </div>
                                                    <div className={classesGeneral.paperTitleTextBold} style={{fontSize: '15px'}}>
                                                        {'Curso: '+classProfessor.course.description}
                                                    </div>
                                                    {classProfessor.gamified_class === 1 &&
                                                        <div className={classesGeneral.textGreeInfo} style={{fontSize: '15px'}}>
                                                            {'Turma gamificada'}
                                                        </div>
                                                    }
                                                    {classProfessor.status === 2 &&
                                                        <div className={classesGeneral.textRedInfo} style={{marginTop: '5px', fontSize: '15px'}}>
                                                            {'Turma arquivada'}
                                                        </div>
                                                    }
                                                    <Link onClick={() => setOpenDialogPeople(true)}>
                                                        <TooltipQuestione description={'Clique aqui para visualizar os participantes desta turma.'} position={'bottom'} content={
                                                            <div className={classesGeneral.paperTitleText} style={{fontSize: '15px'}}>
                                                                {classProfessor.class_student_all && classProfessor.class_student_all.length + ' estudante(s)'}
                                                            </div>
                                                        }/>
                                                    </Link>
                                                </div>
                                            }
                                            { localStorage.getItem('@Questione-acess-level-user') === "2" &&
                                                <Button style={{marginTop:'20px'}} color="primary" variant='outlined' onClick={handleNewApplication}>Adicionar Simulado</Button>}
                                        </Box>
                                    </Box>
                                </Grid>
                                { classProfessor && (classProfessor.gamified_class === 1
                                        && localStorage.getItem('@Questione-acess-level-user') === "0") &&
                                <Grid item xs={12} sm={12} md={5}>
                                        <GamificationPanel gamified_class={classProfessor.gamified_class} classId={studentClassId}/>
                                </Grid> }
                            </Grid>
                            <Dialog
                                open={openDialogPeople}
                                fullScreen
                                onClose={handleCloseDialogPeople}
                                aria-labelledby="simple-dialog-title">
                                {classProfessor &&
                                <div>
                                    <AppBar className={classes.appBar}>
                                        <Toolbar>
                                            <IconButton edge="start" color="inherit" onClick={handleCloseDialogPeople} aria-label="close">
                                                <CloseIcon />
                                            </IconButton>
                                            <div className={classesGeneral.titleList} style={{color: '#FFF', marginBottom: '15px'}}>
                                                Pessoas da turma {classProfessor.id_class +' - '+ classProfessor.description}
                                            </div>
                                        </Toolbar>
                                    </AppBar>
                                    <div style={{marginTop: '50px'}}>
                                         <People idClass={classProfessor.id}/>
                                    </div>
                                </div>}
                            </Dialog>
                            <Dialog fullScreen={true}
                                    onClose={handleNewApplicationExit}
                                    aria-labelledby="responsive-dialog-title" open={openNewApplication}>
                                <AppBar className={classes.appBar}>
                                    <Toolbar>
                                        <IconButton edge="start" color="inherit" onClick={handleNewApplicationExit} aria-label="close">
                                            <CloseIcon />
                                        </IconButton>
                                        <div className={classesGeneral.titleList} style={{color: '#FFF', marginBottom: '15px'}}>
                                            {evaluationSelected != null ? 'Crie um simulado a partir da avaliação '+evaluationSelected.id : 'Selecione a avaliação'}
                                        </div>

                                    </Toolbar>
                                </AppBar>

                                {/* não foi selecionada a avaliação*/}
                                {evaluationSelected == null && evaluations == null ?
                                    <LinearProgress color="secondary" />
                                    :
                                    evaluationSelected == null &&
                                    <div style={{margin: '10px'}}>
                                        <TablePagination
                                            component="div"
                                            count={totalEvaluations}
                                            onChangePage={handlePageChangeEvaluations}
                                            onChangeRowsPerPage={handleRowsPerPageChange}
                                            page={page}
                                            rowsPerPage={rowsPerPage}
                                            rowsPerPageOptions={[10]}
                                        />
                                        <List>
                                            {evaluations.map(evaluation => (
                                                <div>
                                                    <Divider/>
                                                    <ListItem button onClick={() => setEvaluationSelected(evaluation)}>
                                                        <ListItemText id={evaluation.id} primary={
                                                            <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '10px'}}>
                                                                {evaluation.description}
                                                            </div>}

                                                                      secondary={
                                                                          <div className={classesGeneral.paperTitleText}>
                                                                              {'Esta avaliação foi criada em: '+ moment(evaluation.created_at).format('DD/MM/YYYY')+'.'}
                                                                          </div>}/>
                                                    </ListItem>
                                                    <Divider/>
                                                </div>

                                            ))}

                                        </List>
                                    </div>}

                                {(evaluationSelected != null && level_user === '2') &&
                                    <div style={{margin: '10px'}}>
                                        <Box display={'flex'} justifyContent='center' style={{marginTop: '20px', marginBottom: '30px'}}>
                                            <Button variant="outlined" color="primary" size="medium" onClick={newApplication}>
                                                Criar um Simulado a partir da avaliação {evaluationSelected.id}
                                            </Button>
                                        </Box>
                                        <EvaluationQuestions evaluationId={evaluationSelected.id}/>
                                    </div>
                                }
                            </Dialog>
                        </div>
                    }
                />
            </Card>

            {level_user === '2' &&
                <div>
                    <ApplicationTable studentClassId={studentClassId} />
                </div>}

            {level_user === '0' &&
                <div>
                    <ApplicationListStudent studentClassId={studentClassId} />
                </div>}
        </div>
    );
}

export default StudentClassContent;
