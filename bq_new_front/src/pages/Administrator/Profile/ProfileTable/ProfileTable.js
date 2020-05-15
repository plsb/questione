import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination, Button
} from '@material-ui/core';
import api from '../../../../services/api';
import Swal from "sweetalert2";
import ProfileToolbar from "./components/ProfileToolbar";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import {DialogQuestione} from "../../../../components";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1)
  },
  headTable: {
    fontWeight: "bold"
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const ProfileTable = props => {
  const { className, history } = props;

  const [profiles, setProfiles] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = React.useState(false);
  const [idProfileDelete, setIdProfileDelete] = React.useState(0);

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

  async function loadProfile(page){
    try {
      let url = 'profile?page='+page;
      if(searchText!=0){
        url += '&fk_course_id='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setProfiles(response.data.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  useEffect(() => {
    loadProfile(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickOpenDialog = (id) => {
    setIdProfileDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdProfileDelete(0);
  }

  async function onDeleteProfile(){
    try {
      let url = 'profile/'+idProfileDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Perfil excluído.');
        loadProfile(page+1);
      }
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/profile-details/'+id);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadProfile(1);
  }

  const handlePageChange = (event, page) => {
    loadProfile(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <div className={classes.root}>
      <ProfileToolbar
          onChangeSearch={updateSearch.bind(this)}
          searchText={searchText}
          onClickSearch={onClickSearch}/>
      <div className={classes.content}>
        <Card
            className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.headTable}>Descrição</TableCell>
                      <TableCell className={classes.headTable}>Curso</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profiles.map(profile => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={profile.id}>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <Typography variant="body1">{profile.description}</Typography>
                            </div>
                          </TableCell>
                          <TableCell>{profile.course.description}</TableCell>
                          <TableCell className={classes.row}>
                            <Tooltip title="Deletar">
                              <Button
                                  className={classes.buttonDelete}
                                  onClick={() => onClickOpenDialog(profile.id)}>
                                <Delete fontSize="medium"/>
                              </Button>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <Button
                                className={classes.buttonEdit}
                                onClick={() => onClickEdit(profile.id)}>
                                <Edit fontSize="medium"/>
                              </Button>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </PerfectScrollbar>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
                component="div"
                count={total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
            />
          </CardActions>
        </Card>
      </div>
      <DialogQuestione handleClose={onClickCloseDialog}
                       open={open}
                       onClickAgree={onDeleteProfile}
                       onClickDisagree={onClickCloseDialog}
                       mesage={'Deseja excluir o perfil selecionado?'}
                       title={'Excluir Perfil'}/>
    </div>
  );
};

ProfileTable.propTypes = {
  history: PropTypes.object
};

export default ProfileTable;
