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
    Menu, Tooltip, Chip, colors
} from '@material-ui/core';
import { MoreVert, FileCopyOutlined } from '@material-ui/icons';
import moment from 'moment';
import api from "../../../../services/api";
import Swal from "sweetalert2";
import {withRouter} from "react-router-dom";
import {DialogQuestione} from "../../../../components";

const useStyles = makeStyles(() => ({
  root: {
    margin: 8,
  },
    head: {
        paddingBottom: 0,
        paddingTop: 6
    },
    chip:{
      backgroundColor: '#e57373',
      color: '#ffebee',
    },
  spacer: {
    flexGrow: 1
  },
}));

const EvaluationCard = props => {
  const { className, history, evaluation, ...rest } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);

  const classes = useStyles();

    //configuration alert
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    function loadAlert(icon, message) {
        Toast.fire({
            icon: icon,
            title: message
        });
    }

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const onEdit = () => {
      history.push('/evaluation-details/'+evaluation.id);
  }

  async function duplicate(){
      try {
          const response = await api.post('evaluation/duplicate/'+evaluation.id);
          if (response.status === 200) {
              loadAlert('success', 'Avaliação cadastrada(duplicada).');
              window.location.reload();
          } else {
              loadAlert('error', 'Erro ao mduar o status da avaliação.');
          }

      } catch (error) {
          console.log(error);
          loadAlert('error', 'Erro de conexão.');
      }
  }

  async function changeStatus(status) {
      try {
          const data = {
              status
          }
          const response = await api.put('evaluation/change-status/'+evaluation.id, data);
          if (response.status === 200) {
              if (status == 1){
                  loadAlert('success', 'Avaliação ativa.');
              } else {
                  loadAlert('success', 'Avaliação arquivada.');
              }
              window.location.reload();
          } else {
              loadAlert('error', 'Erro ao mduar o status da avaliação.');
          }

      } catch (error) {
          console.log(error);
          loadAlert('error', 'Erro de conexão.');
      }
  }

    const onClickOpenDialog = () => {
        setOpen(true);
    }

    const onClickCloseDialog = () => {
        setOpen(false);
    }

    async function onDelete(){
        try {
            let url = 'evaluation/'+evaluation.id;
            const response = await api.delete(url);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else {
                loadAlert('success', 'Avaliação excluída.');
                window.location.reload();
            }
        } catch (error) {
            loadAlert('error', 'Erro de conexão.');
        }
        setOpen(false);
    }

  return (
    <Card
      {...rest}
      className={classes.root}>
          <CardHeader
              className={classes.head}
              action={
                  <div>
                      <Tooltip title="Duplicar Avaliação">
                          <IconButton
                              aria-label="copy"
                              onClick={duplicate}>
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

              title={
                  evaluation.id < 10 ? '00000' + evaluation.id :
                      evaluation.id < 100 ? '0000' + evaluation.id :
                          evaluation.id < 1000 ? '000' + evaluation.id :
                              evaluation.id < 10000 ? '00' + evaluation.id :
                                  evaluation.id < 100000 ? '0' + evaluation.id :
                                      evaluation.id
              }/>
      <CardContent>
        <Typography variant="h4" color="textSecondary" component="h2">
            {'Descrição: '+evaluation.description}
        </Typography>
          <Typography color="textSecondary" variant="h6">
              {'Data de criação da avaliação: '+ moment(evaluation.created_at).format('DD/MM/YYYY')}
          </Typography>
          { evaluation.status == 2 ?
              <Chip label="Arquivada" className={clsx(classes.chip, className)} size="small"/> : null}
      </CardContent>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            { evaluation.status == 1 ? <MenuItem onClick={handleClose}>Aplicações</MenuItem> : null}
            { evaluation.status == 1 ? <MenuItem onClick={onEdit}>Editar</MenuItem> : null}
            { evaluation.status == 1 ? <MenuItem onClick={() => changeStatus(2) }>Arquivar</MenuItem> : null}
            { evaluation.status == 2 ? <MenuItem onClick={() => changeStatus(1) }>Ativar</MenuItem> : null}
            { evaluation.status == 2 ? <MenuItem onClick={onClickOpenDialog}>Deletar</MenuItem> : null}
        </Menu>
        <DialogQuestione handleClose={onClickCloseDialog}
                         open={open}
                         onClickAgree={onDelete}
                         onClickDisagree={onClickCloseDialog}
                         mesage={'Deseja excluir a avaliação selecionada?'}
                         title={'Excluir Avaliação'}/>
    </Card>
  );
};

EvaluationCard.propTypes = {
  className: PropTypes.string,
  evaluation: PropTypes.object,
    history: PropTypes.object
};

export default withRouter(EvaluationCard);
