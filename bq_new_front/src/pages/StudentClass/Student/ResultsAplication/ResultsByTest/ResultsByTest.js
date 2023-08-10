import React, { useEffect, useState } from 'react';
import api from "../../../../../services/api";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
    Grid,
    Table,
    TableBody,
    LinearProgress,
    Card,
    CardHeader,
    CardContent,
    Tooltip,
    IconButton,
    Typography,
    Chip,
    Link
} from '@material-ui/core';
import {ToastContainer} from "react-toastify";
import {PlayArrow} from "@material-ui/icons";
import moment from "moment/moment";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        margin: 8,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
    labelRed: {
        backgroundColor: '#daa520',
        display: 'block',
        margin: '2px',
        padding: '3px',
        textAlign: 'center',
        color: '#fff',
        borderRadius: 4
    },
    chipblue: {
        margin: 3,
        marginTop: '16px',
        backgroundColor: '#2196f3',
        color: '#fff',
    },
    chippurple: {
        margin: 3,
        marginTop: '16px',
        backgroundColor: '#4a148c',
        color: '#fff',
    },
    chipred: {
        margin: 3,
        marginTop: '16px',
        backgroundColor: '#d2691e',
        color: '#fff',
    },
    chipgreen: {
        margin: 3,
        marginTop: '16px',
        backgroundColor: '#6b8e23',
        color: '#fff',
    },
    dFlex: {
        display: 'flex',
    },
    releaseResultsMessage: {
        position: 'absolute',
        top: '16px',
        left: '16px',
    },
    link: {
        marginLeft: 10,
        marginTop: 12,
        fontSize: 14,
    }
}));

const ResultsByTest = props =>{

    const classes = useStyles();
    let history = useHistory();

   const { className, studentClassId, ...rest } = props;
    
    const [headEvaluations, setHeadEvaluations] = useState(null);


    async function loadHeadEvaluations(){
        try {
          let url = `/evaluation/student/result/evaluations?fk_class_id=${studentClassId}`;
          
          const response = await api.get(url);
          
          if(response.status == 200) {
              setHeadEvaluations(response.data);
              console.log('head', response.data);
          } else {
              setHeadEvaluations([]);
          }

        } catch (error) {

        }
      }

    useEffect(() => {
        loadHeadEvaluations();
      }, []);


    const results = (idHead) => {
        history.push('/student/result-evaluations/details/'+idHead);
    }


    return(
        <div className={classes.root}>
            <ToastContainer autoClose={10000} position="bottom-center"/>
            <div className={classes.content}>
                {headEvaluations == null ?
                    <LinearProgress color="secondary"    />
                    :
                    <Grid
                        container
                        spacing={1}>
                        <Grid
                            item
                            md={12}
                            xs={12}>
                            <Table>
                                <TableBody>
                                    {headEvaluations.map((application, i) => (
                                        <div key={application.id}>
                                            <Card
                                                {...rest}
                                                className={classes.root}>
                                                <CardHeader
                                                    className={classes.head}
                                                    title={'Simulado: '+ (headEvaluations.length-i)}/>

                                                <CardContent>
                                                    <div>
                                                        <Typography variant="h5" color="textSecondary" component="h2">
                                                            {application.evaluation_application.description }
                                                        </Typography>
                                                        <Typography variant="body1" color="textSecondary" component="h2">
                                                            {'Avaliação: '+application.evaluation_application.evaluation.description}
                                                        </Typography>

                                                        {application.finalized_at && (
                                                            <Typography variant="body1" color="textSecondary" component="h2">
                                                                {'Finalizado em: '+moment(application.finalized_at).format('DD/MM/YYYY H:mm') }
                                                            </Typography>
                                                        )}

                                                        {application.evaluation_application.evaluation.practice === 1 && (
                                                            <Chip label="Pratique" className={clsx(classes.chippurple, className)} size="small"/>
                                                        )}

                                                        {application.finalized_at && application.finished_automatically === 0 && (
                                                            <Chip label="Finalizado" className={clsx(classes.chipred, className)} size="small"/>
                                                        )}

                                                        {application.finalized_at && application.finished_automatically === 1 && (
                                                            <Chip label="Finalizado automaticamente" className={clsx(classes.chipred, className)} size="small"/>
                                                        )}

                                                        {!application.finalized_at && application.finished_automatically === 0 && (
                                                            <Chip label="Iniciado" className={clsx(classes.chipgreen, className)} size="small"/>
                                                        )}

                                                        { application.evaluation_application.show_results == 1 &&
                                                            application.evaluation_application.canShowResults == 1 && application.finalized_at ?
                                                           <Link
                                                                component="button"
                                                                variant="body2"
                                                                onClick={() => {
                                                                    results(application.id)
                                                                }}
                                                                className={clsx(classes.link, className)}>
                                                                Visualizar Resultado
                                                            </Link>
                                                            :
                                                            application.evaluation_application.canShowResults == 0 && application.evaluation_application.show_results == 1
                                                                ?
                                                                <Chip label={'Resultado em: '+moment(`${application.evaluation_application.date_release_results} ${application.evaluation_application.time_release_results}`).format('DD/MM/YYYY H:mm')} className={clsx(classes.chipred, className)} size="small"/>
                                                                :
                                                                application.evaluation_application.show_results == 0 && application.finalized_at && <Chip label="Resultado indisponível." className={clsx(classes.chipred, className)} size="small"/>
                                                        }

                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid> }
            </div>
        </div>
    );
}

export default ResultsByTest;
