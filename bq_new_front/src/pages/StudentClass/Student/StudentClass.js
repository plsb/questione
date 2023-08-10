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

    const [refresh, setRefresh] = React.useState(1);
    const [showRegisterDialog, setShowRegisterDialog] = React.useState(false);
    const [registerLoading, setRegisterLoading] = React.useState(false);

    const classes = useStyles();

    const getStudentClasses = async (page, description = '') => {
        try {
            const response = await api.get(`class/student`, {
                params: {
                    page,
                    description,
                },
            });

            if (response.status == 200) {
                setTotal(response.data.total);
                setStudentClasses(response.data.data);
                console.log("verifica", response.data);
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
                window.location.reload(true);
            }
        } catch (e) {

        }
    };

    const handlePageChange = (event, page) => {
        getStudentClasses(page + 1, searchText);
        setPage(page);
    };

    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const onClickSearch = (e) => {
        getStudentClasses(1, searchText);
    };

    useEffect(() => {
        getStudentClasses(page, searchText);
    }, [refresh]);

    return (
        <div className={classes.root}>
            <StudentClassToolbar
                onChangeSearch={handleSearch.bind(this)}
                searchText={searchText}
                onClickSearch={onClickSearch}
                handleStatusCallback={getStudentClasses}
                setShowRegisterDialog={setShowRegisterDialog}
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
                                                        showUser
                                                        isOwner={false}
                                                        setRefresh={setRefresh}
                                                        refresh={refresh}
                                                        gamified_class={studentClass.gamified_class}
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
        </div>
    );
}

export default StudentClass;
