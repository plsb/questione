import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    IconButton,
    MenuItem, Menu,
    CardContent,
    Typography,
    CardActions,
    Tooltip,
    Collapse,
    Paper,
    Chip,
    Switch, ListItem, ListItemText,
    List,
    Dialog, AppBar, Toolbar, Box, Divider, Link, CardActionArea
} from '@material-ui/core';
import {MoreVert, PlaylistAdd, ExpandMoreRounded, Edit} from '@material-ui/icons';
import {withRouter} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import api from "../../services/api";
import {DialogQuestione} from "../index";
import SubjectIcon from '@material-ui/icons/Subject';
import moment from "moment";
import CloseIcon from '@material-ui/icons/Close';
import { toast } from 'react-toastify';
import useStyles from "../../style/style";

const useStylesLocal = makeStyles(theme => ({
    textFoot: {
        color: '#000000', fontFamily: 'Verdana', fontSize: '12px', marginTop: '10px'
    },
    paper: {
        display: 'flex',
        marginBottom: 10,
        '& > *': {
            margin: theme.spacing(2),
        },
        margin: 3,
        padding: 8
    },
    paperCorrect: {
        backgroundColor: '#e2f2e7',
        color: '#212121',
    },
}));

const QuestionText = props => {
    const { className, history, question, ...rest } = props;
    const [alternativeLetters] = React.useState(['a', 'b', 'c', 'd', 'e']);
    const [showBaseText, setShowBaseText] = React.useState(false);

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    useEffect(() => {

    }, [showBaseText]);

    const changeShowBaseText = () => {
        setShowBaseText(!showBaseText);
    }

    return (
      <div className={classes.content}>
            <Link onClick={() => changeShowBaseText()}>
                <div className={classesGeneral.subtitles}>
                    <SubjectIcon />
                    {showBaseText ? "Ocultar texto associado a questão" : "Mostrar texto associado a questão"}
                </div>
            </Link>
            { showBaseText &&
                <div>
                    <div className={classesGeneral.subtitles}>
                        {"Texto base:"}
                    </div>
                    <div>
                        { ReactHtmlParser (question.base_text) }
                    </div>
                </div>}
             <div className={classesGeneral.subtitles}>
                {"Enunciado:"}
            </div>
            <div> { ReactHtmlParser (question.stem) } </div>
            {
                question.question_items.length > 0 &&
                <div className={classesGeneral.subtitles}>
                    {"Alternativas:"}
                </div>
            }
            {question.question_items.map((item, i) => (
                item.correct_item == 1 ?
                       <Box display="flex" flexDirection="row"  style={{ width: '100%' }}>
                           <Box style={{marginTop: '15px', marginRight: '5px'}} sx={{ flexShrink: 1 }}>
                               <Chip label={alternativeLetters[i]} style={{fontSize: '14px', fontWeight: 'bold', background:"#e2f2e7"}} size="small"/>
                           </Box>
                           <Box sx={{ width: '100%' }}>
                                <Paper className={clsx(classes.paper, classes.paperCorrect)} elevation={3} variant="outlined">
                                    {ReactHtmlParser (item.description)}
                                </Paper>
                           </Box>
                       </Box>
                    :
                    <Box display="flex" flexDirection="row" style={{ width: '100%' }}>
                        <Box style={{marginTop: '15px', marginRight: '5px'}}>
                            <Chip label={alternativeLetters[i]} style={{fontSize: '14px', fontWeight: 'bold', background:"#e1f5fe"}} size="small"/>
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <Paper className={clsx(classes.paper)} variant="outlined">
                                { ReactHtmlParser (item.description) }
                            </Paper>
                        </Box>
                    </Box>
            ))}

            <div style={{marginTop: '30px'}}></div>

            <div className={classes.textFoot}>
                { question.fk_user_id == localStorage.getItem("@Questione-id-user") &&
                    "Esta questão foi cadastrada por você"}
            </div>
            {
                question.skill  !== null ?
                    <div className={classes.textFoot}>
                        Competência: {" " + question.skill.description }
                    </div>
                    : null
            }
            { question.keywords[0] ?
                <div className={classes.textFoot}>
                    Palavra(s)-chave:
                    {" " + question.keywords.map(item => (
                        ReactHtmlParser (item.keyword) + '. '
                    ))}
                </div> : null}
            <Divider style={{padding: '2px', marginTop: '20px', marginBottom: '15px', backgroundColor: '#e1f5fe'}}/>
      </div>
    );
};

QuestionText.propTypes = {
    className: PropTypes.string,
    question: PropTypes.object,
};

export default withRouter(QuestionText);
