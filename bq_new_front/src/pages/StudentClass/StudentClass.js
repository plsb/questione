import React, { useEffect } from 'react';
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
    TableBody
} from '@material-ui/core';

import StudentClassCard from '../../components/StudentClassCard';
import StudentClassToolbar from './components/StudentClassToolbar';

import useStyles from './styles';

function StudentClass({ history }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [studentClasses, setStudentClasses] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [searchText, setSearchText] = React.useState('');
    const [status, setStatus] = React.useState(1);

    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getStudentClasses = async (page, status, description = '') => {
        try {
            const response = await api.get(`class/`, {
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
        getStudentClasses(page + 1, 1);
        setPage(page);
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

    useEffect(() => {
        getStudentClasses(1, 1);
    }, []);

    return (
        <div className={classes.root}>
            <Card className={classes.header}>
                <CardHeader
                    avatar={(
                        <h3>Turmas</h3>
                    )}
                />
                <CardActions>
                    <div className={classes.headerActions}>
                        <Button aria-controls="simple-menu" aria-haspopup="true" color="primary" variant="contained" onClick={handleClick}>
                            Nova turma
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => {}}>Participar de uma turma</MenuItem>
                            <MenuItem onClick={() => history.push('/student-class-details')}>Criar nova turma</MenuItem>
                        </Menu>
                    </div>
                </CardActions>
            </Card>

            <Card
                className={classes.table}
            >
                {/* <div style={{ margin: '16px', marginLeft: '48px' }}>
                    Descrição sobre o módulo turmas
                </div> */}
                <CardHeader
                    avatar={
                        <div>
                             <StudentClassToolbar
                                onChangeSearch={handleSearch.bind(this)}
                                searchText={searchText}
                                onClickSearch={onClickSearch}
                                handleStatusCallback={getStudentClasses}
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
                                                    showUser
                                                    toFileCallback={() => getStudentClasses(1)}
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

export default StudentClass;
