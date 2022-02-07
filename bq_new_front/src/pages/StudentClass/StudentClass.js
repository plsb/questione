import React from 'react';

import {
    Card,
    CardHeader,
    CardActions,
    Button,
    // Menu,
    // MenuItem,
} from '@material-ui/core';

import useStyles from './styles';

function StudentClass() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Card className={classes.header}>
                <CardHeader
                    avatar={(
                        <h3>Turmas</h3>
                    )}
                />
                <CardActions>
                    <div className="">
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {}}
                        >
                        Nova turma
                        </Button>
                    </div>
                </CardActions>
            </Card>

            {/* <Menu
                id="simple-menu"
                anchorEl={true}
                keepMounted
                open={true}
                onClose={() => {}}
            >
                <MenuItem onClick={() => {}}>Participar de uma turma</MenuItem>
                <MenuItem onClick={() => {}}>Criar nova turma</MenuItem>
            </Menu> */}

        </div>
    );
}

export default StudentClass;
