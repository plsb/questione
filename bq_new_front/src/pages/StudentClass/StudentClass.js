import React from 'react';

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

import useStyles from './styles';

function StudentClass() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [studentClasses] = React.useState([]);

    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                            <MenuItem onClick={() => {}}>Criar nova turma</MenuItem>
                        </Menu>
                    </div>
                </CardActions>
            </Card>

            <Card
                className={classes.table}
            >
                <div style={{ margin: '16px', marginLeft: '48px' }}>
                    Descrição sobre o módulo turmas
                </div>
                <CardHeader
                    avatar={
                        <div>

                        </div>
                    }
                    action={
                        <TablePagination
                            component="div"
                            count={0}
                            onChangePage={() => {}}
                            onChangeRowsPerPage={() => {}}
                            page={1}
                            rowsPerPage={3}
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
                                            <StudentClassCard />
                                            <StudentClassCard />
                                            <StudentClassCard />
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
                        count={0}
                        onChangePage={() => {}}
                        onChangeRowsPerPage={() => {}}
                        page={1}
                        rowsPerPage={3}
                        rowsPerPageOptions={[10]}
                    />
                </CardActions>
          </Card>
        </div>
    );
}

export default StudentClass;
