import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction
  } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import InfoIcon from '@material-ui/icons/Info';
import api from "../../../../services/api";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.primary.dark
  },
  differenceValue: {
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(1)
  }
}));

const NextEvaluations = props => {
  const { className, ...rest } = props;
  let history = useHistory();
  const [nextEvaluations, setNextEvaluations] = useState(null);

  const classes = useStyles();

  async function loadNextEvaluations(){
    try {
      let url = 'class/student/next-evaluations';

      const response = await api.get(url);
      console.log('aplicacao student', response.data);
      if(response.status == 200) {
        setNextEvaluations(response.data);

      } else {
        setNextEvaluations([]);
      }

    } catch (error) {

    }
  }


  useEffect(() => {
    loadNextEvaluations();
  }, []);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}>
      <CardContent>
        <Grid
          container
          justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              PRÓXIMAS AVALIAÇÕES
            </Typography>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Lista das avaliações não finalizadas ou não iniciadas
                  </ListSubheader>
                }
                className={classes.root}>

              {nextEvaluations && nextEvaluations.map((evaluations, i) => (
                  <ListItem button>
                    <ListItemText primary={'Simulado: '+evaluations.description}
                                  secondary={
                                    <React.Fragment>
                                      <Typography
                                          component="span"
                                          variant="body2"
                                          className={classes.inline}
                                          color="textPrimary">
                                        {'Turma: '+evaluations.class.id_class+' - '+ evaluations.class.description}
                                      </Typography>
                                      {" (Professor: "+evaluations.class.user.name+")"}
                                    </React.Fragment>}/>
                    <ListItemSecondaryAction>
                      <IconButton
                          aria-label="comments"
                          onClick={() => history.push(`/code/${evaluations.id_application}`)}>
                        <PlayArrow />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>

              ))}


            </List>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InfoIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>

        </div>
      </CardContent>
    </Card>
  );
};

NextEvaluations.propTypes = {
  className: PropTypes.string
};

export default NextEvaluations;
