import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';

import api from "../../../services/api";

import {
    Card,
    CardHeader,
    Divider,
    // CardActions,
    // Button,
    // Menu,
    // MenuItem,
    // TablePagination,
    CardContent,
    // LinearProgress,
    // Grid,
    // Table,
    // TableBody,
    Tabs,
    Tab,
    Box,
    Typography,
    IconButton,
    Accordion,
    AccordionDetails,
    AccordionSummary,

    // TextField
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import People from './People';
import EvaluationTable from './Evaluation/EvaluationTable';
import ApplicationTable from './Application/EvaluationApplicationTable';
import StudentEvaluationTable from './StudentEvaluation/EvaluationTable';
import EvaluationsResults from './EvaluationsResult/EvaluationsResultTable';

import useStyles from './styles';
import ResultsAplication from '../Professor/ResultsAplication/ResultsAplication';



function StudentClassContent({ history, location, ...rest }) {
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

    const classes = useStyles();

    const [classProfessor, setClassProfessor] = useState(null);

    async function loadClassProfessor(){
        try {
          let url = `class/professor/show/${studentClassId}`;
          const response = await api.get(url);
          
          if(response.status == 200) {  
            setClassProfessor(response.data[0]);
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
        if(classProfessor)
            console.log('class', classProfessor);
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.contentHeader}>
                <IconButton onClick={() => history.goBack()}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            

            {/*<CardHeader
                subheader=""
                title="Turma: " />*/}
            <Card className={classes.root}>
                <CardHeader
                avatar={
                    <div>
                        {
                            classProfessor ?
                                <div >
                                    <Typography variant="button" color="textSecondary" component="p" className={classes.title}>{'Turma '}</Typography>
                                    <Typography variant="button" color="textSecondary" component="p">
                                        {'Responsável: '+classProfessor.user.name}
                                    </Typography>
                                    <Typography variant="button" color="textSecondary" component="p">
                                        {'Código: '+classProfessor.id_class}
                                    </Typography>
                                    <Typography variant="button" color="textSecondary" component="p">
                                        {'Descrição: '+classProfessor.description}
                                    </Typography>
                                </div>
                                :
                                null
                        }
                    
                    </div>
                }
                />
            </Card>
            <Divider />

            <Tabs
                variant="fullWidth"
                value={tabValue}
                onChange={handleChangeTab}
                aria-label="nav tabs example"
            >
               {/* <LinkTab label="Avaliações" style={{ display: level_user === '2' ? 'block' : 'none' }} href="/student-class/evaluations" {...a11yProps(0)} /> */}
                <LinkTab label="Simulados" style={{ display: level_user === '2' ? 'block' : 'none' }} href="/student-class/applications" {...a11yProps(0)} />
                <LinkTab label="Pessoas" style={{ display: level_user === '2' ? 'block' : 'none' }} href="/student-class/peoples" {...a11yProps(1)} />
                <LinkTab label="Avaliações" style={{ display: level_user === '0' ? 'block' : 'none' }} href="/student-class/evaluations/student" {...a11yProps(2)} />
                <LinkTab label="Avaliações respondidas" style={{ display: level_user === '0' ? 'block' : 'none' }} href="/student-class/answed-evaluations" {...a11yProps(3)} />
                <LinkTab label="Resultados" style={{ display: level_user === '2' ? 'block' : 'none' }} href="/student-class/applications" {...a11yProps(4)} />
            </Tabs>

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
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <ApplicationTable studentClassId={studentClassId} />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <People />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <StudentEvaluationTable studentClassId={studentClassId} />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <EvaluationsResults studentClassId={studentClassId} history={history} />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <ResultsAplication studentClassId={studentClassId}/> 
      
                        </div>
                    </CardContent>
                </Card>
            </TabPanel> 
        </div>
    );
}

export default StudentClassContent;
