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
    Grid, Box, Paper, CardActionArea, Link
} from '@material-ui/core';
import {Edit, MoreVert} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "../../style/style";
import moment from "moment/moment";

export function EntypoEye(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" {...props}><path fill="currentColor" d="M10 4.4C3.439 4.4 0 9.232 0 10c0 .766 3.439 5.6 10 5.6c6.56 0 10-4.834 10-5.6c0-.768-3.44-5.6-10-5.6zm0 9.907c-2.455 0-4.445-1.928-4.445-4.307c0-2.379 1.99-4.309 4.445-4.309s4.444 1.93 4.444 4.309c0 2.379-1.989 4.307-4.444 4.307zM10 10c-.407-.447.663-2.154 0-2.154c-1.228 0-2.223.965-2.223 2.154s.995 2.154 2.223 2.154c1.227 0 2.223-.965 2.223-2.154c0-.547-1.877.379-2.223 0z"></path></svg>
    )
}


export function EntypoEyeWithLine(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" {...props}><path fill="currentColor" d="M18.521 1.478a1 1 0 0 0-1.414 0L1.48 17.107a1 1 0 1 0 1.414 1.414L18.52 2.892a1 1 0 0 0 0-1.414zM3.108 13.498l2.56-2.56A4.18 4.18 0 0 1 5.555 10c0-2.379 1.99-4.309 4.445-4.309c.286 0 .564.032.835.082l1.203-1.202A12.645 12.645 0 0 0 10 4.401C3.44 4.4 0 9.231 0 10c0 .423 1.057 2.09 3.108 3.497zm13.787-6.993l-2.562 2.56c.069.302.111.613.111.935c0 2.379-1.989 4.307-4.444 4.307c-.284 0-.56-.032-.829-.081l-1.204 1.203c.642.104 1.316.17 2.033.17c6.56 0 10-4.833 10-5.599c0-.424-1.056-2.09-3.105-3.495z"></path></svg>
    )
}

const useStylesLocal = makeStyles(() => ({
    root: {
        marginBottom: 8,
    },
    chipgreen:{
        margin: 3,
        backgroundColor: '#009688',
        color: '#ffebee',
    },
    chipblue:{
        backgroundColor: 'primary',
        color: '#ffebee',
    },
    chipred:{
        backgroundColor: '#e57373',
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
        background: '#2196f3'
    },
    textDialog: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '19px'
    }

}));

const StudendClassCard = props => {
    const { className, id, status, showUser, toFileCallback, isOwner,
        history, class_student, class_student_student, ...rest } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toFile = async (newStatus) => {
        try {
            const response = await api.put(`class/professor/change-status/${id}`, {
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
            <div>
                    <Paper className={classesGeneral.paperTitle} style={{background: class_student_student && class_student_student.active == 0 && '#ffcdd2'}}>
                        <Box display="flex">
                            <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-start">
                                <div className={classesGeneral.paperTitleText}>
                                    {class_student.id_class}
                                </div>
                                { status == 2 &&
                                    <div className={classesGeneral.textRedInfo} style={{marginLeft: '15px', marginTop: '4px'}}>
                                        {'Arquivada'}
                                    </div>}
                                <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '15px'}}>
                                    {class_student.description}
                                </div>
                                {class_student.gamified_class === 1 && (
                                    <div className={classesGeneral.textGreeInfo} style={{marginLeft: '15px'}}>
                                        {'(Gamificada)'}
                                    </div>
                                )}
                            </Box>
                            <Box display="flex" justifyContent="flex-end">
                                <Box display="flex">
                                    {/*gamified_class === 1 && (
                                        <Tooltip title="Configurações da turma gamificada">
                                            <IconButton
                                                aria-label="settings"
                                                onClick={handleGamification}>
                                                <SportsEsportsIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )*/}
                                    <div className={classesGeneral.paperTitleText}>
                                        {class_student.class_student_all && class_student.class_student_all.length + ' estudante(s)'}
                                    </div>

                                    {
                                        <IconButton
                                            aria-label="settings"
                                            onClick={() => history.push(`/student-class/${id}`)}
                                            size="small"
                                            style={{marginLeft: '20px'}}
                                            disabled={class_student_student && class_student_student.active == 0}>
                                            {class_student_student && class_student_student.active == 0 ? <EntypoEyeWithLine /> : <EntypoEye /> }
                                        </IconButton>

                                    }

                                    { isOwner && <Tooltip title="Opções da turma">
                                        <IconButton
                                            aria-label="settings"
                                            onClick={handleClick}
                                            size="small"
                                            style={{marginLeft: '20px'}}>
                                            <MoreVert />
                                        </IconButton>
                                    </Tooltip> }

                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                    <Paper className={classesGeneral.paperSubtitle}>
                        <Box display="flex">
                            {class_student.course &&
                                <div className={classesGeneral.paperTitleText}>
                                    {'Curso: '+class_student.course.description}
                                </div> }

                        </Box>
                    </Paper>

                    <CardContent>

                        {class_student.user &&
                            <div className={classesGeneral.paperTitleText} style={{fontWeight: 'bold'}}>
                                {'Professor: '+ class_student.user.name}
                            </div> }
                        <div className={classesGeneral.paperTitleText}>
                            {'Esta turma foi criada em: '+ moment(class_student.created_at).format('DD/MM/YYYY')+'.'}
                        </div>

                        {class_student_student && class_student_student.active == 0 &&
                            <div className={classesGeneral.textRedInfo} style={{marginTop: '10px'}}>
                                {'Você está desabailitado nesta turma. Entre em contato com o seu professor.'}
                            </div>}

                    </CardContent>
            </div>


            { isOwner &&
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    {status === 1 && isOwner && (
                        <>
                            <MenuItem onClick={() => history.push(`/student-class-details/${id}/professor`)}>Editar</MenuItem>
                            <MenuItem onClick={() => toFile(2)}>Arquivar</MenuItem>
                        </>
                    )}

                    {status === 2 && isOwner && (
                        <MenuItem onClick={() => toFile(1)}>Ativar</MenuItem>
                    )}
                </Menu> }
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
    class_student: PropTypes.object,
    history: PropTypes.object,
    setRefresh: PropTypes.func,
    refresh: PropTypes.number
};

export default withRouter(StudendClassCard);
