import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import api from "../../services/api";

import {
    Card,
    CardHeader,
    CardActions,
    TablePagination,
    CardContent,
    LinearProgress,
    Grid,
    Table,
    TableBody
} from '@material-ui/core';

import StudentClassCard from '../../components/StudentClassCard';
import StudentClassToolbar from './components/StudentClassToolbar';
import {makeStyles} from "@material-ui/core/styles";
import useStyles from "../../style/style";

const useStylesLocal = makeStyles({
    root: {

    },
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0px 8px 0px 0px',
    },
});

function StudentClassroom({ history }) {
    const [studentClasses, setStudentClasses] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [searchText, setSearchText] = React.useState('');
    const [status, setStatus] = React.useState(1);
    const [refresh, setRefresh] = React.useState(1);

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    const getStudentClassrooms = async (page, status, description = '') => {
        try {
            const response = await api.get(`class/student/`, {
                params: {
                    status,
                    page,
                    description,
                },
            });
            if (response.status === 202) {
                if (response.data.message) {
                    toast.error(response.data.message);
                }
            } else {
                setStudentClasses(response.data.data);
                setTotal(response.data.total);
                setPage(page);
                setStatus(status);
            }
        } catch (e) {

        }
    };

    const handlePageChange = (event, page) => {
        getStudentClassrooms(page + 1, 1, searchText);
        setPage(page);
    };
    
    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    }

    const onClickSearch = (e) => {
        getStudentClassrooms(1, status, searchText);
    };

    useEffect(() => {
        getStudentClassrooms(page, status, searchText);
    }, [refresh]);

    return (
        <div className={classesGeneral.root}>
            <Card >
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
                    Aqui são listadas as turmas em que estou matriculado.
                </div>
                <CardHeader
                    avatar={
                        <div>
                             <StudentClassToolbar
                                onChangeSearch={handleSearch.bind(this)}
                                searchText={searchText}
                                onClickSearch={onClickSearch}
                                handleStatusCallback={getStudentClassrooms}
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
        </div>
    );
}

export default StudentClassroom;
