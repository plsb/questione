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
    Chip,
    AppBar,
    Toolbar,
    TextField,
    Button,
    Dialog,
    Grid
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from '@material-ui/styles';
import clsx from "clsx";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: 8,
    },
    chipgreen:{
        margin: 3,
        backgroundColor: '#009688',
        color: '#ffebee',
    },
    title: {
        marginLeft: 2,
        flex: 1,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    fieldsDialog: {
        marginTop: 20
    },
    appBar: {
        position: 'relative',
    },
    textDialog: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '19px'
    }

}));

const StudendClassCard = props => {
    const { className, id, title, classId, user, status, showUser, toFileCallback, isOwner,
        history, gamified_class, ...rest } = props;
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

    //dialog
    const [openGamification, setOpenGamification] = React.useState(false);

    const handleGamification = () => {
        setOpenGamification(true);
    };

    const handleGamificationExit = () => {
        setOpenGamification(false);
    }

    async function saveGamification(){
        /*try {
            if(descriptionNewApplication.length < 5){
                setOpenNewApplication(false);
                toast.error('Informe uma descrição com no mínimo 05 caracteres');
                return ;
            }
            if(classProfessorSelect == 0){
                setOpenNewApplication(false);
                toast.error('Informe a turma para a aplicação');
                return ;
            }
            const fk_evaluation_id = evaluation.id;
            const description = descriptionNewApplication;
            const fk_class_id = classProfessorSelect;
            const data = {
                description, fk_evaluation_id, fk_class_id
            }
            const response = await api.post('evaluation/add-application', data);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
                setOpenNewApplication(false);
            } else {
                toast.success('Nova aplicação cadastrada.');
                setDescriptionNewApplication('');
                //window.redirect = history.push("/evaluations");
                //setTabValue(1);
                setOpenNewApplication(false);
            }

        } catch (error) {

        }*/
    }


    return (
        <Card
            {...rest}
            className={classes.root}>
                <CardHeader
                    className={classes.head}
                    action={
                        <div>
                            {/*gamified_class === 1 && (
                                <Tooltip title="Configurações da turma gamificada">
                                    <IconButton
                                        aria-label="settings"
                                        onClick={handleGamification}>
                                        <SportsEsportsIcon />
                                    </IconButton>
                                </Tooltip>
                            )*/}

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
                            {/*<MenuItem onClick={() => toFile(2)}>Arquivar</MenuItem>*/}
                        </>
                    )}

                    {status === 2 && isOwner && (
                        <MenuItem onClick={() => toFile(1)}>Ativar</MenuItem>
                    )}
                </Menu>
            <Dialog fullScreen onClose={handleGamificationExit} aria-labelledby="simple-dialog-title" open={openGamification}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleGamificationExit} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h5" className={classes.title}>
                            Informe as configurações da turma gamificada
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={3}>
                    {/*<Grid item xs={2}>
                        <div className={classes.textDialog}>{"Descrição"}</div>
                        <Typography color="textSecondary" variant="h4">
                            Acertar cada questão do teste
                        </Typography>
                        <Typography color="textSecondary" variant="h4">
                            Acertar todas as questões de um simulado
                        </Typography>
                        <Typography color="textSecondary" variant="h4">
                            Conquistar emblema
                        </Typography>
                        <Typography color="textSecondary" variant="h4">
                            Finalizar um simulado
                        </Typography>
                        <Typography color="textSecondary" variant="h4">
                            Ingressar em uma Turma
                        </Typography>

                    </Grid>*/}
                    <Grid item xs={3}>
                        <div className={classes.textDialog}>{"XP"}</div>
                        <TextField
                            fullWidth
                            label="Acertar cada questão do teste"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Acertar todas as questões de um simulado"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Conquistar emblema"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Finalizar um simulado"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Ingressar em uma Turma"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <div className={classes.textDialog}>{"PR"}</div>
                        <TextField
                            fullWidth
                            label="Acertar cada questão do teste"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Acertar todas as questões de um simulado"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Conquistar emblema"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Acertar cada questão do teste"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Finalizar um simulado"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                        <TextField
                            fullWidth
                            label="Ingressar em uma Turma"
                            margin="dense"
                            name="description"
                            variant="outlined"

                            className={classes.fieldsDialog}
                        />
                    </Grid>

                </Grid>

                <Button
                    color="primary"
                    variant="outlined"
                    className={classes.fieldsDialog}
                    onClick={saveGamification}>
                    Salvar
                </Button>

            </Dialog>
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
