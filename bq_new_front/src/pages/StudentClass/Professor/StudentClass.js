import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import api from "../../../services/api";

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

import StudentClassCard from '../../../components/StudentClassCard';
import DialogStudentClassRegister from '../../../components/DialogStudentClassRegister';
import StudentClassToolbar from './components/StudentClassToolbar';

import useStyles from './styles';

function StudentClass({ history }) {
    // Salas criadas
    const [studentClasses, setStudentClasses] = React.useState(null);

    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = useState(0);
    const [total, setTotal] = React.useState(0);
    const [searchText, setSearchText] = React.useState('');
    const [status, setStatus] = React.useState(1);

    const [refresh, setRefresh] = React.useState(1);
    const [showRegisterDialog, setShowRegisterDialog] = React.useState(false);
    const [registerLoading, setRegisterLoading] = React.useState(false);
    const [tabValue, setTabValue] = useState(0);

    const classes = useStyles();

    const getStudentClasses = async (page, status, description = '') => {
        try {
            const response = await api.get(`class/`, {
                params: {
                    status,
                    page,
                    description,
                },
            });

            if (response.status == 200) {
                setTotal(response.data[0].total);
                setStudentClasses(response.data[0].data);
            } else {
                setStudentClasses([]);
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

    const handlePageChange = (event, page) => {
        getStudentClasses(page + 1, 1, searchText);
        setPage(page);
    };

    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const onClickSearch = (e) => {
        getStudentClasses(1, status, searchText);
    };

    useEffect(() => {
        getStudentClasses(page, status, searchText);
    }, [refresh]);

    return (
        <div className={classes.root}>
            <StudentClassToolbar
                onChangeSearch={handleSearch.bind(this)}
                searchText={searchText}
                onClickSearch={onClickSearch}
                handleStatusCallback={getStudentClasses}
                tabValue={tabValue}
            />

            <div className={classes.content}>
                <Card
                    className={clsx(classes.root)}>
                    <CardHeader
                        avatar={
                            <div>

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
                        {studentClasses == null
                            ? (
                                <LinearProgress color="secondary" />
                            )
                            : (
                                <Grid
                                    container
                                    spacing={1}>
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}>
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
                                                        setRefresh={setRefresh}
                                                        refresh={refresh}
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
            </div>

            {/* <Card className={classes.header}>
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

             */}
        </div>
    );
}

export default StudentClass;
