import React from 'react';
import { makeStyles } from '@material-ui/styles';

import {
    Card,
    CardContent,
    Typography,
    Paper,
} from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';

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
      chipGreen:{
        backgroundColor: '#4db6ac',
        color: '#ffffff',
          marginRight: 2
      },
      chipRed:{
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
      questionInfo: {
          skill: {
              display: 'flex',
          }
      }
  }));

// import { Container } from './styles';

function QuestionItem({ question, index }) {
    const classes = useStyles();

    console.log(question)

    return (
        <Card>
            <CardContent className={classes.lineQuestion}>
                <Typography variant="h5" color="textSecondary" component="h2">
                    QUESTÃO - {index + 1}
                </Typography>

                <div className={classes.questionInfo}>
                    {question.question_with_skill_and_objects.skill  !== null ?
                        <div className={classes.questionInfo.skill} style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="button" color="textSecondary" component="p">
                                Competência:
                            </Typography>
                            <div style={{ marginLeft: '8px' }}> { question.question_with_skill_and_objects.skill.description } </div>
                        </div>
                        : null}
                    {question.question_with_skill_and_objects.knowledge_objects[0] ?
                        <div>
                            <Typography variant="button" color="textSecondary" component="p">
                                Objeto(s) de conhecimento:
                            </Typography>
                            {question.question_with_skill_and_objects.knowledge_objects.map(item => (
                                <div> { ReactHtmlParser (item.description) } </div>
                            ))}
                        </div>
                        : null}
                </div>
            </CardContent>
        </Card>
    );
}

export default QuestionItem;