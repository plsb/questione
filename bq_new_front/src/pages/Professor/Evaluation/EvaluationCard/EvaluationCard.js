import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    IconButton,
    Typography,
    CardContent,
    MenuItem,
    Menu, Tooltip
} from '@material-ui/core';
import { MoreVert, FileCopyOutlined } from '@material-ui/icons';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  root: {
    margin: 10
  },
  spacer: {
    flexGrow: 1
  },
}));

const EvaluationCard = props => {
  const { className, history, evaluation, ...rest } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}>
          <CardHeader
              action={
                  <div>
                      <Tooltip title="Duplicar Avaliação">
                          <IconButton
                              aria-label="copy"
                              onClick={handleClick}>
                              <FileCopyOutlined />
                          </IconButton>
                      </Tooltip>
                      <Tooltip title="Opções da Avaliação">
                          <IconButton
                                aria-label="settings"
                                onClick={handleClick}>
                              <MoreVert />
                            </IconButton>
                      </Tooltip>
                  </div>
              }
              subheader={'Descrição: '+evaluation.description}
              title={'Código: '+evaluation.id_evaluation}/>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
            Data de criação da avaliação: {moment(evaluation.created_at).format('DD/MM/YYYY')}
        </Typography>
      </CardContent>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <MenuItem onClick={handleClose}>Aplicações</MenuItem>
            <MenuItem onClick={handleClose}>Editar</MenuItem>
            <MenuItem onClick={handleClose}>Arquivar</MenuItem>
        </Menu>
    </Card>
  );
};

EvaluationCard.propTypes = {
  className: PropTypes.string,
  evaluation: PropTypes.object
};

export default EvaluationCard;
