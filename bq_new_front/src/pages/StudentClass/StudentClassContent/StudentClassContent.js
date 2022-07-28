import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';

// import api from "../../../services/api";

import {
    Card,
    // CardHeader,
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
    // TextField
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import People from './People';
import EvaluationTable from './Evaluation/EvaluationTable';
import ApplicationTable from './Application/EvaluationApplicationTable';
import StudentEvaluationTable from './StudentEvaluation/EvaluationTable';
import EvaluationsResults from './EvaluationsResult/EvaluationsResultTable';

import useStyles from './styles';

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

    useEffect(() => {}, [refresh]);

    return (
        <div className={classes.root}>
            <div className={classes.contentHeader}>
                <IconButton onClick={() => history.goBack()}>
                    <ArrowBackIcon />
                </IconButton>
            </div>

            <Tabs
                variant="fullWidth"
                value={tabValue}
                onChange={handleChangeTab}
                aria-label="nav tabs example"
            >
                <LinkTab label="Avaliações" style={{ display: level_user === '2' ? 'block' : 'none' }} href="/student-class/evaluations" {...a11yProps(0)} />
                <LinkTab label="Aplicações" style={{ display: level_user === '2' ? 'block' : 'none' }} href="/student-class/applications" {...a11yProps(1)} />
                <LinkTab label="Pessoas" style={{ display: level_user === '2' ? 'block' : 'none' }} href="/student-class/peoples" {...a11yProps(2)} />
                <LinkTab label="Avaliações" style={{ display: level_user === '0' ? 'block' : 'none' }} href="/student-class/evaluations/student" {...a11yProps(3)} />
                <LinkTab label="Avaliações respondidas" style={{ display: level_user === '0' ? 'block' : 'none' }} href="/student-class/answed-evaluations" {...a11yProps(4)} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Card
                    className={classes.table}
                >
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <EvaluationTable studentClassId={studentClassId} />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <ApplicationTable studentClassId={studentClassId} />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <People />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <StudentEvaluationTable studentClassId={studentClassId} />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            <EvaluationsResults studentClassId={studentClassId} history={history} />
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>
        </div>
    );
}

export default StudentClassContent;
