import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import api from "../../services/api";

import {
    Card,
    CardHeader,
    CardActions,
    Button,
    Menu,
    MenuItem,
    TablePagination,
    CardContent,
    LinearProgress,
    Grid,
    Table,
    TableBody,
    Tabs,
    Tab,
    Box,
    Typography,
    TextField
} from '@material-ui/core';

import StudentClassCard from '../../components/StudentClassCard';
import DialogStudentClassRegister from '../../components/DialogStudentClassRegister';
import StudentClassToolbar from './components/StudentClassToolbar';

import useStyles from './styles';

function StudentClass({ history }) {
    // Salas criadas
    const [studentClasses, setStudentClasses] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = React.useState(0);
    const [searchText, setSearchText] = React.useState('');
    const [status, setStatus] = React.useState(1);

    // Salas matriculadas
    const [matriculatedStudentClasses, setMatriculatedStudentClasses] = React.useState([]);
    const [matriculatedRowsPerPage, setMatriculatedRowsPerPage] = React.useState(10);
    const [matriculatedPage, setMatriculatedPage] = useState(1);
    const [matriculatedTotal, setMatriculatedTotal] = React.useState(0);
    const [matriculatedSearchText, setMatriculatedSearchText] = React.useState('');
    const [matriculatedStatus, setMatriculatedStatus] = React.useState(1);

    
    const [refresh, setRefresh] = React.useState(1);
    const [showRegisterDialog, setShowRegisterDialog] = React.useState(false);
    const [registerLoading, setRegisterLoading] = React.useState(false);
    const [tabValue, setTabValue] = useState(0);

    const classes = useStyles();

    const getStudentClasses = async (page, status, description = '') => {
        console.log('Chamou');

        try {
            const response = await api.get(`class/`, {
                params: {
                    status,
                    page,
                    description,
                },
            });

            if (response.status === 202) {
                if (tabValue === 0 && response.data[0].message) {
                    toast.error(response.data[0].message);
                }

                if (tabValue === 1 && response.data[1].message) {
                    toast.error(response.data[1].message);
                }
            } else {
                setStudentClasses(response.data[0].data);
                setTotal(response.data[0].total);
                setPage(() => parseInt(page));
                setStatus(status);

                setMatriculatedStudentClasses(response.data[1].data);
                setMatriculatedTotal(response.data[1].total);
                setMatriculatedPage(() => parseInt(page));
                setMatriculatedStatus(status);
            }
        } catch (e) {

        }
    };

    const registerInStudentClasses = async (studentClassCode) => {
        setRegisterLoading(true);

        try {
            const response = await api.post(`class/student/`, {
                id_class: studentClassCode,
            });

            if (response.status === 202) {
                if (response.data.message) {
                    toast.error(response.data.message);
                    setRegisterLoading(false);
                }
            } else {
                toast.success("Inscrição realizada com sucesso!");
                setRegisterLoading(false);
                setShowRegisterDialog(false);
            }
        } catch (e) {

        }
    };

    // Métodos das salas criadas
    const handlePageChange = (event, page) => {
        getStudentClasses(parseInt(page) + 1, 1, searchText);
    };
    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value);
    };
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    }
    const onClickSearch = (e) => {
        getStudentClasses(1, status, searchText);
    };

    // Métodos das salas matriculadas
    const handleMatriculatedPageChange = (event, page) => {
        getStudentClasses(parseInt(page) + 1, 1, matriculatedSearchText);
    };
    const handleMatriculatedRowsPerPageChange = event => {
        setMatriculatedRowsPerPage(event.target.value);
    };
    const handleMatriculatedSearch = (e) => {
        setMatriculatedSearchText(e.target.value);
    }
    const onMatriculatedClickSearch = (e) => {
        getStudentClasses(1, matriculatedStatus, matriculatedSearchText);
    };

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
        setTabValue(newValue);

        if (newValue === 0) {
            getStudentClasses(page, status, searchText);
        } else {
            getStudentClasses(matriculatedPage, matriculatedStatus, matriculatedSearchText);
        }
    };

    useEffect(() => {
        getStudentClasses(page, status, searchText);
    }, [refresh]);

    return (
        <div className={classes.root}>
            <Tabs
                variant="fullWidth"
                value={tabValue}
                onChange={handleChangeTab}
                aria-label="nav tabs example"
            >
                <LinkTab label="Sou professor" href="/drafts" {...a11yProps(0)} />
                <LinkTab label="Sou aluno" href="#" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Card className={classes.header}>
                    <CardHeader
                        avatar={(
                            <h3>Turmas</h3>
                        )}
                    />
                    <CardActions>
                        <div className={classes.headerActions}>
                            <Button aria-controls="simple-menu" aria-haspopup="true" color="info" variant="contained" onClick={() => {
                                setShowRegisterDialog(true);
                            }} style={{ marginRight: '12px' }}>
                                Participar de uma turma 
                            </Button>
                            <Button aria-controls="simple-menu" aria-haspopup="true" color="primary" variant="contained" onClick={() => history.push('/student-class-details')}>
                                Criar nova turma
                            </Button>
                        </div>
                    </CardActions>
                </Card>

                <Card
                    className={classes.table}
                >
                    <div style={{ margin: '16px', marginLeft: '16px' }}>
                        Descrição sobre o módulo turmas...
                    </div>
                    <CardHeader
                        avatar={
                            <div>
                                <StudentClassToolbar
                                    onChangeSearch={handleSearch.bind(this)}
                                    searchText={searchText}
                                    onClickSearch={onClickSearch}
                                    handleStatusCallback={getStudentClasses}
                                    tabValue={tabValue}
                                />
                            </div>
                        }
                        action={
                            <TablePagination
                                component="div"
                                count={total}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handleRowsPerPageChange}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[10]}
                            />
                        }
                    />
                    <CardContent>
                        {studentClasses == null ?
                            <LinearProgress color="secondary" />
                            : (
                                <Grid
                                    container
                                    spacing={1}
                                >
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <Table>
                                            <TableBody>
                                                {studentClasses.map((studentClass) => (
                                                    <StudentClassCard
                                                        key={studentClass.id}
                                                        id={studentClass.id}
                                                        classId={studentClass.id_class}
                                                        title={studentClass.description}
                                                        user={studentClass.user}
                                                        status={status}
                                                        showUser
                                                        isOwner
                                                        toFileCallback={() => {
                                                            setRefresh(refresh + 1);
                                                        }}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </CardContent>
                    <CardActions className={classes.actions}>
                        <TablePagination
                            component="div"
                            count={total}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[10]}
                        />
                    </CardActions>
                </Card>

                <DialogStudentClassRegister
                    handleClose={() => setShowRegisterDialog(false)}
                    open={showRegisterDialog}
                    onClickRegister={registerInStudentClasses}
                    registerLoading={registerLoading}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card className={classes.header}>
                    <CardHeader
                        avatar={(
                            <h3>Turmas em que estou matriculado</h3>
                        )}
                    />
                    <CardActions>
                        <div className={classes.headerActions}>
                            
                        </div>
                    </CardActions>
                </Card>

                <Card
                    className={classes.table}
                >
                    <div style={{ margin: '16px', marginLeft: '16px' }}>
                        Descrição sobre o módulo turmas...
                    </div>
                    <CardHeader
                        avatar={
                            <div>
                                <StudentClassToolbar
                                    onChangeSearch={handleMatriculatedSearch.bind(this)}
                                    searchText={matriculatedSearchText}
                                    onClickSearch={onMatriculatedClickSearch}
                                    handleStatusCallback={getStudentClasses}
                                    tabValue={tabValue}
                                />
                            </div>
                        }
                        action={
                            <TablePagination
                                component="div"
                                count={matriculatedTotal}
                                onChangePage={handleMatriculatedPageChange}
                                onChangeRowsPerPage={handleMatriculatedRowsPerPageChange}
                                page={matriculatedPage}
                                rowsPerPage={matriculatedRowsPerPage}
                                rowsPerPageOptions={[10]}
                            />
                        }
                    />
                    <CardContent>
                        {matriculatedStudentClasses == null ?
                            <LinearProgress color="secondary" />
                            : (
                                <Grid
                                    container
                                    spacing={1}
                                >
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <Table>
                                            <TableBody>
                                                {matriculatedStudentClasses.map((studentClass) => (
                                                    <StudentClassCard
                                                        key={studentClass.id}
                                                        id={studentClass.id}
                                                        classId={studentClass.id_class}
                                                        title={studentClass.description}
                                                        user={studentClass.user}
                                                        status={matriculatedStatus}
                                                        showUser
                                                        isOwner
                                                        toFileCallback={() => {
                                                            setRefresh(refresh + 1);
                                                        }}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </CardContent>
                    <CardActions className={classes.actions}>
                        <TablePagination
                            component="div"
                            count={matriculatedTotal}
                            onChangePage={handleMatriculatedPageChange}
                            onChangeRowsPerPage={handleMatriculatedRowsPerPageChange}
                            page={matriculatedPage}
                            rowsPerPage={matriculatedRowsPerPage}
                            rowsPerPageOptions={[10]}
                        />
                    </CardActions>
                </Card>
            </TabPanel>
        </div>
    );
}

export default StudentClass;
