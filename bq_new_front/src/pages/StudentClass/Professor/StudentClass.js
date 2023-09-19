import React, { useEffect, useState } from 'react';

import api from "../../../services/api";

import {
    Card,
    CardHeader,
    CardActions,
    TablePagination,
    CardContent,
    LinearProgress,
    Grid,
    Table,
    TableBody,
} from '@material-ui/core';

import StudentClassCard from '../../../components/StudentClassCard';
import StudentClassToolbar from './components/StudentClassToolbar';
import {makeStyles} from "@material-ui/core/styles";
import useStyles from "../../../style/style";

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
    const [status, setStatus] = React.useState(1);

    const [refresh, setRefresh] = React.useState(1);

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    const getStudentClasses = async (page, status, description = '') => {
        try {
            const response = await api.get(`class/professor`, {
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
        <div className={classesGeneral.root}>
            <StudentClassToolbar
                onChangeSearch={handleSearch.bind(this)}
                searchText={searchText}
                onClickSearch={onClickSearch}
                handleStatusCallback={getStudentClasses}
                setStatus={setStatus}
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
                                                    status={status}
                                                    showUser
                                                    isOwner
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
            </div>
        </div>
    );
}

export default StudentClass;
