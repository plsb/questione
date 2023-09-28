import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    IconButton,
    MenuItem, Menu,
    Typography,
    Tooltip,
    Paper, Box, Grid, Button, Chip, Switch, CardHeader, Card, CardContent, Divider, Hidden
} from '@material-ui/core';
import {MoreVert, Delete as DeleteIcon, PlaylistAdd, Edit} from '@material-ui/icons';
import { withRouter } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import api from '../../../../../services/api';
import DialogQuestione from '../../../../../components/DialogQuestione';
import { toast } from 'react-toastify';
import QuestionText from "../../../../../components/QuestionText";
import useStyles from "../../../../../style/style";

const useStylesLocal = makeStyles(theme => ({
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
    content: {
        width: '100%',
    },
    questionActions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    deleteButton: {
        padding: '0px',
        width: '32px',
        minWidth: '32px',
        height: '32px',
        color: '#ff6333'
    },
    correct: {
        backgroundColor: '#80cbc4',
    },
    btRemove: {
        color: '#f44336',
        marginRight: 2,
    },
}));

const QuestionCard = props => {
    const {
        className,
        history,
        question,
        setRefresh,
        refresh,
        id_evaluation,
        data,
        setQuestions,
        hasApplication,
        ...rest
     } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openDeleteQuestionEvaluation, setOpenDeleteQuestionEvaluation] = React.useState(false);
    const [openDeleteQuestion, setOpenDeleteQuestion] = React.useState(false);
    const [difficultyList] = React.useState(['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil']);

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    useEffect(() => {

    }, [openDeleteQuestionEvaluation]);

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
                setRefresh();
                toast.success('Questão excluída da avaliação.');
                setQuestions((lastQuestions) => lastQuestions.filter((currentQuestion) => currentQuestion.id !== question.id));
                setRefresh(Date.now());
            }
        } catch (error) {

        }
    }

    return (
        <div className={classes.content}>
            <Card>
                <Paper className={classesGeneral.paperTitle}>
                    <Box display="flex">
                        <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-start">
                            <div className={classesGeneral.paperTitleText}>
                                {
                                    question.id < 10 ? 'Q00000' + question.id :
                                        question.id < 100 ? 'Q0000' + question.id :
                                            question.id < 1000 ? 'Q000' + question.id :
                                                question.id < 10000 ? 'Q00' + question.id :
                                                    question.id < 100000 ? 'Q0' + question.id :
                                                        question.id
                                }
                            </div>
                            { question.validated != 1 &&
                                (<div className={classesGeneral.textRedInfo} style={{marginTop: '4px', marginLeft: '5px'}}>
                                    {"(Questão não finalizada)"}
                                </div>)}
                            { question.course &&
                                (<Box display="flex">
                                    <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                        { 'Área: '}
                                    </div>
                                    <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '5px'}}>
                                        {question.course.description}
                                    </div>
                                </Box>)
                            }

                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                            {hasApplication == '0' && (
                                <Tooltip title="Excluir questão da avaliação">
                                    <Button variant="text" style={{ marginLeft: "10px" }}
                                            className={clsx(classes.btRemove, className)}
                                            size="small" onClick={onClickOpenDialogQEvaluation}>Remover Questão</Button>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>

                </Paper>
                <Paper className={classesGeneral.paperSubtitle}>
                    <Box display="flex">
                        <Hidden xsDown>
                            {question.year !== '' && question.year !== null &&
                                <div className={classesGeneral.paperTitleText}>
                                    {"Ano: " +question.year}
                                </div>
                            }
                        </Hidden>
                        <Hidden smDown>
                            { question.type_of_evaluation !== null &&
                                <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                    {'Prova: '+question.type_of_evaluation.description}
                                </div>
                            }
                        </Hidden>
                        <Hidden smDown>
                            { question.initial_difficulty !== null &&
                                <Box display="flex">
                                    <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                        {'Dificuldade: '}
                                    </div>
                                    <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '5px'}}>
                                        {difficultyList[question.initial_difficulty-1]}
                                    </div>
                                </Box>
                            }
                        </Hidden>
                        { question.knowledge_objects[0] &&
                            <Box display="flex">
                                <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                    {'Conteúdo(s):'}
                                </div>
                                <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '5px'}}>
                                    {question.knowledge_objects.map(item => (
                                        ReactHtmlParser (item.description)+'. '
                                    ))}
                                </div>
                            </Box>

                        }

                    </Box>

                </Paper>
                <CardContent>
                    <QuestionText question={question}/>
                </CardContent>

                <DialogQuestione
                    handleClose={onClickCloseDialogQEvaluation}
                    open={openDeleteQuestionEvaluation}
                    onClickAgree={deleteQuestionEvaluation}
                    onClickDisagree={onClickCloseDialogQEvaluation}
                    mesage={
                        <div className={classesGeneral.messageDialog}>
                            {'Deseja excluir a questão Q'+question.id+' da avaliação?'}
                        </div>}
                    title={
                        <div className={classesGeneral.titleDialog}>
                            {'Excluir Questão da Avaliação'}
                        </div>}
                />
            </Card>
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
