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
    Breadcrumbs,
} from '@material-ui/core';

import People from './People';
import ApplicationTable from './Application/EvaluationApplicationTable';
import ResultsAplicationProfessor from '../Professor/ResultsAplication/ResultsAplication';
import ApplicationListStudent from '../Student/ApplicationListStudent/ApplicationListStudent';
import {makeStyles} from "@material-ui/styles";
import useStyles from "./../../../style/style";
import CloseIcon from "@material-ui/icons/Close";
import GamificationPanel from "../../../components/GamificationPanel";


export function CharmHome(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 5.75v7.5h8.5v-7.5m-10.5 1.5L8 1.75l6.25 5.5"></path></svg>
    )
}

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
        loadClassProfessor();
    }, []);

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
                                Inicio
                            </Box>
                        </Box>
                    </Link>
                    <Link color="inherit" onClick={() => history.goBack()}>
                        {localStorage.getItem('@Questione-acess-level-user') === "2" ? 'Turmas' : 'Minhas turmas'}
                    </Link>
                    <Link color="inherit">
                        Turma {classProfessor && classProfessor.id_class}
                    </Link>
                </Breadcrumbs>
            </Box>
            <Card className={classes.root}>
                <CardHeader
                    title={
                        <div>
                            <Grid container direction="row" xs={12}>
                                <Grid item xs={12} sm={12} md={7} style={{marginBottom: '20px'}}>
                                    <Box display="flex" alignItems="row">
                                        <Box>
                                            { classProfessor
                                                && (classProfessor.gamified_class === 1 &&
                                                    <img
                                                        style={{marginTop: '20px', marginRight: '10px'}}
                                                        alt="Logo"
                                                        src="/images/videogame.png" width='100px'/>
                                                )}

                                        </Box>
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
                                                    <Link onClick={() => setOpenDialogPeople(true)}>
                                                        <div className={classesGeneral.paperTitleText} style={{fontSize: '15px'}}>
                                                            {classProfessor.class_student_all && classProfessor.class_student_all.length + ' estudante(s)'}
                                                        </div>
                                                    </Link>
                                                </div>
                                            }
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={5}>
                                    {classProfessor &&
                                        <GamificationPanel gamified_class={classProfessor.gamified_class} classId={studentClassId}/>}
                                </Grid>
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
                        </div>
                    }
                />
            </Card>

            {level_user === '2' &&
                <Tabs
                    variant="fullWidth"
                    value={tabValue}
                    onChange={handleChangeTab}
                    aria-label="nav tabs example">
                   {/* <LinkTab label="Avaliações" style={{ display: level_user === '2' ? 'block' : 'none' }} href="/student-class/evaluations" {...a11yProps(0)} /> */}
                    {level_user === '2' && <LinkTab label="Simulados"  href="/student-class/applications" {...a11yProps(0)} />}
                    {/*<LinkTab label="Avaliações" style={{ display: level_user === '0' ? 'block' : 'none' }} href="/student-class/evaluations/student" {...a11yProps(2)} />*/}
                    {/*<LinkTab label="Avaliações respondidas" style={{ display: level_user === '0' ? 'block' : 'none' }} href="/student-class/answed-evaluations" {...a11yProps(3)} />*/}
                    {level_user === '2' && <LinkTab label="Resultados" href="/student-class/applications" {...a11yProps(1)} />}
                </Tabs>}

            {/*<TabPanel value={tabValue} index={0}>
                <Card
                    className={classes.table}
                >
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <EvaluationTable studentClassId={studentClassId} />
                        </div>
                    </CardContent>
                </Card>
    </TabPanel> */}

            <TabPanel value={tabValue} index={0}>
                {level_user === '2' ?
                    <div style={{ margin: '5px', marginLeft: '16px' }}>
                        <ApplicationTable studentClassId={studentClassId} />
                    </div>
                    :
                    null}


            </TabPanel>



            {/*<TabPanel value={tabValue} index={2}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <StudentEvaluationTable studentClassId={studentClassId} />
                        </div>
                    </CardContent>
                </Card>
        </TabPanel>*/}

           {/* <TabPanel value={tabValue} index={3}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <EvaluationsResults studentClassId={studentClassId} history={history} />
                        </div>
                    </CardContent>
                </Card>
         </TabPanel>*/}

            <TabPanel value={tabValue} index={1}>
                {level_user === '2' &&
                    <div style={{ margin: '16px', marginLeft: '16px' }}>
                        <ResultsAplicationProfessor studentClassId={studentClassId}/>
                    </div>

                   /* <div style={{ margin: '16px', marginLeft: '16px' }}>
                        <ResultsAplicationStudent studentClassId={studentClassId}/>
                    </div>*/

                }
            </TabPanel>

            {level_user === '0' &&
                <div>
                    <ApplicationListStudent studentClassId={studentClassId} />
                </div>}
        </div>
    );
}

export default StudentClassContent;
