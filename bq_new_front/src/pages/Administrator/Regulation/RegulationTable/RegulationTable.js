import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination, Tooltip, Button
} from '@material-ui/core';
import api from '../../../../services/api';
import { toast } from 'react-toastify';
import SkillToolbar from "./components/RegulationToolbar";
import PropTypes from "prop-types";
import {DialogQuestione} from "../../../../components";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";

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
  headTable: {
    fontWeight: "bold"
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1)
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

const RegulationTable = props => {
  const { className, history } = props;

  const [regulations, setRegulations] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [IdRegulationDelete, setIdRegulationDelete] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  async function loadRegulations(page, course){
    try {
      let url = 'regulation?page='+page;
      if (course != null)
        url += '&fk_course_id='+course;
      /*if(searchText!=0){
        url += '&fk_course_id='+searchText;
      }*/
      const response = await api.get(url);
      if(response.status == 200) {
        setTotal(response.data.total);
        setRegulations(response.data.data);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    let courseSelected = localStorage.getItem('@Questione-course-selected');
    if(courseSelected != null) setSearchText(courseSelected);

    loadRegulations(1, courseSelected);
  }, []);

  /*useEffect(() => {
    loadRegulations(1);
  }, [searchText]);*/

  const updateSearch = (e) => {
    setSearchText(e.target.value);
    localStorage.setItem('@Questione-course-selected', e.target.value);
  }

  const onClickOpenDialog = (id) => {
    setIdRegulationDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdRegulationDelete(0);
  }

  async function onDeleteRegulation(){
    try {
      let url = 'regulation/' + IdRegulationDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        toast.success('Portaria excluída.');
        loadRegulations(page+1, searchText);
      }
    } catch (error) {

    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/regulation-details/'+id);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadRegulations(1, searchText);
  }

  const handlePageChange = (event, page) => {
    loadRegulations(page+1, searchText)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <div className={classes.root}>
      <SkillToolbar
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
                      <TableCell className={classes.headTable}>Ano</TableCell>
                      <TableCell className={classes.headTable}>Curso</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regulations.map(regulation => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={regulation.id}>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <Typography variant="body1">{regulation.description}</Typography>
                            </div>
                          </TableCell>
                          <TableCell>{regulation.year}</TableCell>
                          <TableCell>{regulation.course.description}</TableCell>
                          <TableCell className={classes.row}>
                            <Tooltip title="Deletar">
                              <Button
                                  className={classes.buttonDelete}
                                  onClick={() => onClickOpenDialog(regulation.id)}>
                                <Delete fontSize="medium"/>
                              </Button>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <Button
                                  className={classes.buttonEdit}
                                  onClick={() => onClickEdit(regulation.id)}>
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
                       onClickAgree={onDeleteRegulation}
                       onClickDisagree={onClickCloseDialog}
                       mesage={'Deseja excluir a portaria selecionada?'}
                       title={'Excluir Portaria'}/>
    </div>
  );
};

RegulationTable.propTypes = {
  history: PropTypes.object
};

export default RegulationTable;
