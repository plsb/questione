import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    CardContent, Chip, Switch, Tooltip
} from '@material-ui/core';
import moment from 'moment';
import { toast } from 'react-toastify';
import { withRouter } from "react-router-dom";
import api from "../../../../services/api";
import { Edit, FormatListBulleted, MoreVert, PlayArrow } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
    root: {
        margin: 8,
    },
    head: {
        paddingBottom: 0,
        paddingTop: 6
    },
    chipred: {
        margin: 3,
        backgroundColor: '#e57373',
        color: '#ffebee',
    },
    chipgreen: {
        margin: 3,
        backgroundColor: '#009688',
        color: '#ffebee',
    },
    chipyellow: {
        margin: 3,
        backgroundColor: '#fff176',
        color: '#212121',
    },
    chipblue: {
        margin: 3,
        backgroundColor: '#2196f3',
        color: '#fff',
    },
    spacer: {
        flexGrow: 1
    },
}));

const EvaluationApplicationCard = props => {
    const { className, history, application, idApplication, ...rest } = props;

    const [state, setState] = useState(0);
    const [evaluationApplication, setEvaluationApplication] = useState({});
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [status, setStatus] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();

    useEffect(() => {

    }, [evaluationApplication]);

    useEffect(() => {
        setEvaluationApplication(application);

    }, []);

    const onEdit = (id) => {
        history.push(`/evaluation-practice/${idApplication}/applications-evaluation/details/${id}`);
    }

    const results = (id) => {
        history.push('/evaluation-practice/applications-evaluation/details/' + id);
    }

    // async function onClickOpenDialogEnableApplication() {
    //     try {
    //         let url = 'evaluation/change-status-application/' + evaluationApplication.id;
    //         const response = await api.put(url);
    //         if (response.status === 202) {
    //             if (response.data.message) {
    //                 loadAlert('error', response.data.message);
    //             }
    //         } else {
    //             const new_evaluation = response.data;
    //             setEvaluationApplication(new_evaluation);

    //             loadAlert('success', 'Modificado o status da aplicação.');
    //         }
    //         //window.location.reload();
    //     } catch (error) {

    //     }
    //     setState(state + 1);
    // }

    async function loadStatus() {
        try {
            let url = 'evaluation/practice/applications/status/' + application.id;
            const response = await api.get(url);
            if (response.status === 202) {
                if (response.data.message) {
                    toast.error(response.data.message);
                }
            } else {
                const responseStatus = response.data;
                setStatus(responseStatus);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        if (!status) {
            loadStatus();
        }
    }, []);

    return (
        <div>
            { evaluationApplication.id ?
                <Card
                    {...rest}
                    className={classes.root}>
                    <CardHeader
                        className={classes.head}
                        action={
                            <div>

                                {/* {evaluationApplication.evaluation.status == 1 ?
                          <Tooltip title="Habilite a questão para aplicações">
                              <Switch
                                  checked={evaluationApplication.status}
                                  onChange={onClickOpenDialogEnableApplication}
                                  color="primary"
                                  name="checkedB"
                                  inputProps={{ 'aria-label': 'primary checkbox' }}
                              />
                          </Tooltip> : null } */}
                                {status === 3 && (
                                    <Tooltip title="Visualizar resultados">
                                        <IconButton
                                            aria-label="copy"
                                            onClick={() => results(evaluationApplication.id)}>
                                            <FormatListBulleted />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {evaluationApplication.evaluation.status == 1 ?
                                    <Tooltip title="Clique para editar">
                                        <IconButton
                                            aria-label="copy"
                                            onClick={() => onEdit(evaluationApplication.id)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip> : null}

                                    {status !== 3 && (
                                        <Tooltip title="Realizar avaliação">
                                            <IconButton
                                                aria-label="settings"
                                                onClick={() => history.push(`/code/${application.id_application}`)}>
                                                <PlayArrow />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                            </div>
                        }
                        title={'Código: ' + evaluationApplication.id_application} />

                    <CardContent>

                        <Typography variant="h5" color="textSecondary" component="h2">
                            {'Descrição da aplicação: ' + evaluationApplication.description}
                        </Typography>
                        {evaluationApplication.evaluation.status == 1 ?
                            <Typography variant="body1" color="textSecondary" component="h2">
                                {'Avaliação: ' + evaluationApplication.evaluation.id + ' - ' + evaluationApplication.evaluation.description}
                            </Typography> :
                            <Typography variant="body1" color="textSecondary" component="h2">
                                {'ARQUIVADA - Avaliação: ' + evaluationApplication.evaluation.id + ' - ' + evaluationApplication.evaluation.description}
                            </Typography>}


                        <Typography color="body2" variant="h6">
                            {'Data de criação da aplicação: ' + moment(evaluationApplication.created_at).format('DD/MM/YYYY')}
                        </Typography>
                        {/* { evaluationApplication.evaluation.status == 2 ?
                      <Chip label="Avaliação Arquivada" className={clsx(classes.chipred, className)} size="small"/> :
                      evaluationApplication.status == 1 ?
                          <Chip label="Ativada" className={clsx(classes.chipgreen, className)} size="small"/> :
                            <Chip label="Desativada" className={clsx(classes.chipred, className)} size="small"/>

                  } */}
                        {status === 1 && (
                            <Chip label="Não iniciada" className={clsx(classes.chipyellow, className)} size="small"/>
                        )}

                        {status === 2 && (
                            <Chip label="Iniciada" className={clsx(classes.chipblue, className)} size="small"/>
                        )}

                        {status === 3 && (
                            <Chip label="Finalizada" className={clsx(classes.chipgreen, className)} size="small"/>
                        )}

                        {/* { evaluationApplication.show_results == 1 ?
                            <Chip label="Resultados Liberados" className={clsx(classes.chipblue, className)} size="small"/> :
                            null
                        } */}



                    </CardContent>
                </Card>
                : null}

        </div>



    );
};

EvaluationApplicationCard.propTypes = {
    className: PropTypes.string,
    application: PropTypes.object,
    history: PropTypes.object
};

export default withRouter(EvaluationApplicationCard);
