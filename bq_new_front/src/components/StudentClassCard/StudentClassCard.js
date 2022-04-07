import React from 'react';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
// import moment from 'moment';

import api from "../../services/api";

import {
    Card,
    CardHeader,
    IconButton,
    Typography,
    CardContent,
    MenuItem,
    Menu,
    Tooltip,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import useStyles from './styles';

const StudendClassCard = props => {
    const { id, title, classId, user, status, showUser, toFileCallback, isOwner, history, ...rest } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toFile = async (newStatus) => {
        try {
            const response = await api.put(`class/change-status/${id}`, {
                status: newStatus,
            });

            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
            } else {
                toast.success(newStatus === 2 ? 'Avaliação arquivada.' : 'Avaliação ativada.');
                toFileCallback();
            }

            handleClose();
        } catch (error) {

        }
    };

    return (
        <Card
            {...rest}
            className={classes.root}>
                <CardHeader
                    className={classes.head}
                    action={
                        <div>
                            <Tooltip title="Opções da turma">
                                <IconButton
                                    aria-label="settings"
                                    onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                        </div>
                    }
                    title={title}
                />

                <CardContent>
                    <Typography color="textSecondary" variant="h6">
                        <span>Código da turma:</span> {classId}
                    </Typography>
                    <Typography color="textSecondary" variant="h6">
                        {showUser && user.name}
                    </Typography>
                </CardContent>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {status === 1 && isOwner && (
                        <>
                            <MenuItem onClick={() => history.push(`/student-class-details/${id}`)}>Editar</MenuItem>
                            <MenuItem onClick={() => toFile(2)}>Arquivar</MenuItem>
                        </>
                    )}

                    {status === 2 && isOwner && (
                        <MenuItem onClick={() => toFile(1)}>Ativar</MenuItem>
                    )}

                    {!isOwner && (
                        <MenuItem onClick={() => {}}>Acessar</MenuItem>
                    )}
                </Menu>
        </Card>
    );
};

StudendClassCard.propTypes = {
    className: PropTypes.string,
    evaluation: PropTypes.object,
    history: PropTypes.object,
    setRefresh: PropTypes.func,
    refresh: PropTypes.number
};

export default withRouter(StudendClassCard);
