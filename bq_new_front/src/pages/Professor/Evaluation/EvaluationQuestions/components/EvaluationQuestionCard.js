import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    IconButton,
    MenuItem, Menu,
    Typography,
    Tooltip,
    Paper, Box, Grid
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { withRouter } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import api from '../../../../../services/api';
import DialogQuestione from '../../../../../components/DialogQuestione';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 5,
        marginBottom: 10,
        marginRigth: 0,
        marginLeft: 5,
        width: '100%'
    },
    head: {
        paddingBottom: 0,
        paddingTop: 10
    },
    chipGreen: {
        backgroundColor: '#4db6ac',
        color: '#ffffff',
        marginRight: 2
    },
    chipRed: {
        backgroundColor: '#f44336',
        color: '#ffffff',
        marginRight: 2
    },
    spacer: {
        flexGrow: 1
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    paper: {
        display: 'flex',
        marginBottom: 10,
        '& > *': {
            margin: theme.spacing(2),
        },
    },
    paperWrong: {
        backgroundColor: '#ef9a9a',
        color: '#212121',
        margin: 3,
        padding: 8
    },
    paperRight: {
        backgroundColor: '#80cbc4',
        color: '#212121',
        margin: 3,
        padding: 8
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    labelRank: {
        textAlign: 'right'
    },
    lineQuestion: {
        marginLeft: 20,
    },
}));

const QuestionCard = props => {
    const { className, history, question, setRefresh, refresh, id_evaluation, data, ...rest } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openDeleteQuestionEvaluation, setOpenDeleteQuestionEvaluation] = React.useState(false);
    const [openDeleteQuestion, setOpenDeleteQuestion] = React.useState(false);

    const classes = useStyles();

    /* function loadRank(){
 
         if(question.rank_avg.length !== 0){
             setRank(question.rank_avg[0].rank_avg);
         }
         if(question.rank_by_user_active.length == 0 &&
             question.fk_user_id !== localStorage.getItem("@Questione-id-user")) {
             setRank(0)
         }
         setQtRank(question.rank_count);
     }*/

    // useEffect(() => {
    //     loadRank();
    // }, [question, rank]);

    useEffect(() => {

    }, [openDeleteQuestionEvaluation]);

    // useEffect(() => {
    //     loadRank();
    //     loadEvaluations();
    // }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClickOpenDialogQEvaluation = () => {
        setOpenDeleteQuestionEvaluation(true);
    }

    const onClickCloseDialogQEvaluation = () => {
        setOpenDeleteQuestionEvaluation(false);
    }

    const onClickOpenDialogQuestion = () => {
        setOpenDeleteQuestion(true);
    }

    // async function deleteQuestion() {
    //     setOpenDeleteQuestion(false);
    //     try {
    //         let url = 'question/' + question.id;

    //         const response = await api.delete(url);
    //         if (response.status === 202) {
    //             if (response.data.message) {
    //                 toast.error(response.data.message);
    //             }
    //         } else {
    //             toast.success('Questão excluída.');
    //             setRefresh(refresh + 1);
    //         }
    //     } catch (error) {

    //     }
    // }

    async function deleteQuestionEvaluation() {
        setOpenDeleteQuestionEvaluation(false);
        try {
            let url = 'evaluation/deletequestion/' + question.id + '+?fk_evaluation_id=' + id_evaluation;
            const fk_evaluation_id = id_evaluation;
            const data = {
                fk_evaluation_id
            }
            const response = await api.delete(url);
            if (response.status === 202) {
                if (response.data.message) {
                    toast.error(response.data.message);
                }
            } else {
                toast.success('Questão excluída da avaliação.');
                setRefresh(refresh + 1);
            }
        } catch (error) {

        }
    }

    return (
        <div className={classes.content}>
            <div className={classes.lineQuestion}>
                <div className={classes.questionActions}>
                    <Box display="flex" justifyContent="flex-end" p={1} m={1} bgcolor="background.paper">
                        <Tooltip title="Opções">
                            <Box flexDirection="row" alignSelf="flex-end">
                                <IconButton className={classes.labelRank} aria-label="settings"
                                    onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                            </Box>
                        </Tooltip>
                    </Box>

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={onClickOpenDialogQEvaluation}>Excluir da Avaliação</MenuItem>
                    </Menu>
                    <DialogQuestione
                        handleClose={onClickCloseDialogQEvaluation}
                        open={openDeleteQuestionEvaluation}
                        onClickAgree={deleteQuestionEvaluation}
                        onClickDisagree={onClickCloseDialogQEvaluation}
                        mesage={'Deseja excluir a questão selecionada da avaliação?'}
                        title={'Excluir Questão da Avaliaçao'}
                    />
                </div>

                {data.skill ?
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <Typography align="center"
                            variant="body2" color="textPrimary"
                            style={{ fontWeight: 'bold', marginRight: '5px' }} >
                            Competência:
                        </Typography>
                        <Typography align="center"
                            variant="body2" color="textPrimary" >
                            {data.skill.description}
                        </Typography>
                    </Grid>
                    : null}
                {data.objects ?
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <Typography align="center"
                            variant="body2" color="textPrimary"
                            style={{ fontWeight: 'bold', marginRight: '5px' }} >
                            Objeto(s) de Conhecimento:
                        </Typography>
                        <Typography align="center"
                            variant="body2" color="textPrimary" >
                            {data.objects.map(item => (
                                item.object.description + '; '
                            ))}
                        </Typography>
                    </Grid>
                    : null}
                <Typography variant="button" color="textSecondary" component="p">
                    Texto base:
                </Typography>
                <div> {ReactHtmlParser(data.question.base_text)} </div>
                <br />
                <Typography variant="button" color="textSecondary" component="p">
                    Enunciado:
                </Typography>
                <div> {ReactHtmlParser(data.question.stem)} </div>
                <br />
                <Typography variant="button" color="textSecondary" component="p">
                    Alternativas:
                </Typography>
                <br />
                {data.question.question_items.map(item => (
                    <div>
                        <Paper className={clsx(classes.paper)} variant="outlined"> {ReactHtmlParser(item.description)} </Paper>
                    </div>
                ))}
            </div>
        </div>
    );
};

QuestionCard.propTypes = {
    className: PropTypes.string,
    question: PropTypes.object,
    id_evaluation: PropTypes.object,
    evaluations: PropTypes.object,
    history: PropTypes.object,
    setRefresh: PropTypes.func,
    refresh: PropTypes.number,

};

export default withRouter(QuestionCard);
