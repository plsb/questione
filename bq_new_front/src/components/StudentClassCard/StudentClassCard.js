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
    Tooltip, Chip,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from '@material-ui/styles';
import clsx from "clsx";

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: 8,
    },
    chipgreen:{
        margin: 3,
        backgroundColor: '#009688',
        color: '#ffebee',
    },

}));

const StudendClassCard = props => {
    const { className, id, title, classId, user, status, showUser, toFileCallback, isOwner, history, gamified_class, ...rest } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickGamification = (event) => {

    }

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
                            {gamified_class === 1 && (
                                <Tooltip title="Configurações da turma gamificada">
                                    <IconButton
                                        aria-label="settings"
                                        onClick={handleClickGamification}>
                                        <SportsEsportsIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

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

                    {gamified_class === 1 && (
                        <Chip label="Gamificada" className={clsx(classes.chipgreen, className)} size="small"/>
                    )}
                </CardContent>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => history.push(`/student-class/${id}`)}>Acessar</MenuItem>
                    {status === 1 && isOwner && (
                        <>
                            <MenuItem onClick={() => history.push(`/student-class-details/${id}/professor`)}>Editar</MenuItem>
                            <MenuItem onClick={() => toFile(2)}>Arquivar</MenuItem>
                        </>
                    )}

                    {status === 2 && isOwner && (
                        <MenuItem onClick={() => toFile(1)}>Ativar</MenuItem>
                    )}
                </Menu>
        </Card>
    );
};

StudendClassCard.propTypes = {
    className: PropTypes.string,
    evaluation: PropTypes.object,
    gamified_class: PropTypes.object,
    history: PropTypes.object,
    setRefresh: PropTypes.func,
    refresh: PropTypes.number
};

export default withRouter(StudendClassCard);
