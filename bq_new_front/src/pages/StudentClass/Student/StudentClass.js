import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import api from "../../../services/api";

import {
    TablePagination,
    LinearProgress,
    Grid,
    Table,
    TableBody,
} from '@material-ui/core';

import StudentClassCard from '../../../components/StudentClassCard';
import DialogStudentClassRegister from '../../../components/DialogStudentClassRegister';
import StudentClassToolbar from './components/StudentClassToolbar';
import {makeStyles} from "@material-ui/core/styles";
import useStyles from "../../../style/style";
import clsx from "clsx";

const useStylesLocal = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    content: {
        padding: 0,
        marginTop: theme.spacing(1)
    },
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 8px 16px 0px',
    },
}));

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

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

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

            } else {
                setStudentClasses([]);
            }
        } catch (e) {

        }
    };

    const registerInStudentClasses = async (studentClassCode) => {
        if(!studentClassCode){
            toast.error('Informe o código da turma.');
        }

        setRegisterLoading(true);

        try {
            const response = await api.post('class/student?id_class='+studentClassCode);
            console.log(studentClassCode);

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
        <div className={classesGeneral.root}>
            <StudentClassToolbar
                onChangeSearch={handleSearch.bind(this)}
                searchText={searchText}
                onClickSearch={onClickSearch}
                handleStatusCallback={getStudentClasses}
                setShowRegisterDialog={setShowRegisterDialog}
            />

            <div className={classesGeneral.content}>
                <TablePagination
                    component="div"
                    count={total}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
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
                                            <div style={{marginBottom: '20px'}}>
                                                <StudentClassCard
                                                    key={studentClass.id}
                                                    id={studentClass.id}
                                                    class_student={studentClass}
                                                    class_student_student={studentClass.class_student && studentClass.class_student[0]}
                                                    showUser
                                                    isOwner={false}
                                                    setRefresh={setRefresh}
                                                    refresh={refresh}
                                                    toFileCallback={() => {
                                                        setRefresh(refresh + 1);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    )
                }
                <TablePagination
                    component="div"
                    count={total}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />

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
