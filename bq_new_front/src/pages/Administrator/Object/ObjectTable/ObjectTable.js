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
import ObjectToolbar from "./components/ObjectToolbar";
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
  headTable: {
    fontWeight: "bold"
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

const ObjectTable = props => {
  const { className, history } = props;

  const [objects, setObjects] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTextCourse, setSearchTextCourse] = useState('');
  const [searchTextRegulation, setSearchTextRegulation] = useState('');
  const [open, setOpen] = React.useState(false);
  const [idObjectDelete, setIdObjectDelete] = React.useState(0);

  const COURSE_SELECTED = '@Questione-course-selected';
  const REGULATION_SELECTED = '@Questione-regulation-selected';

  async function loadObject(page, course, regulation){
    try {
      let url = 'object?page='+page;
      if(course!=null){
        if(course > 0)
          url += '&fk_course_id='+course;
      }
      if(regulation!=null){
        if(regulation > 0)
          url += '&fk_regulation_id='+regulation;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setObjects(response.data.data);
    } catch (error) {

    }
  }

  useEffect(() => {
    let courseSelected = localStorage.getItem(COURSE_SELECTED);
    if (courseSelected != null) setSearchTextCourse(courseSelected);

    let regulationSelected = localStorage.getItem(REGULATION_SELECTED);

    if (regulationSelected != null)
      setSearchTextRegulation(regulationSelected);
    else setSearchTextRegulation(0);

    loadObject(1, courseSelected, regulationSelected);
  }, []);

  const onClickOpenDialog = (id) => {
    setIdObjectDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdObjectDelete(0);
  }

  async function onDeleteObject(){
    try {
      let url = 'object/'+idObjectDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        toast.success('Conteúdo.');
        loadObject(page+1);
      }
    } catch (error) {

    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/object-details/'+id);
  }

  const updateSearchCourse = (e) => {
    setSearchTextCourse(e.target.value);
    localStorage.setItem(COURSE_SELECTED, e.target.value);
  }

  const updateSearchRegulation = (e) => {
    setSearchTextRegulation(e.target.value);
    localStorage.setItem(REGULATION_SELECTED, e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadObject(1, searchTextCourse, searchTextRegulation);
  }

  const handlePageChange = (event, page) => {
    loadObject(page+1, searchTextCourse, searchTextRegulation)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <div className={classes.root}>
      <ObjectToolbar
          onChangeSearchCourse={updateSearchCourse.bind(this)}
          onChangeSearchRegulation={updateSearchRegulation.bind(this)}
          searchTextCourse={searchTextCourse}
          searchTextRegulation={searchTextRegulation}
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
                      <TableCell className={classes.headTable}>Portaria</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {objects.map(object => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={object.id}>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <Typography variant="body1">{object.description}</Typography>
                            </div>
                          </TableCell>
                          <TableCell>{object.regulation ?
                              object.regulation.description+" de "+object.regulation.year+" | "+object.course.description
                              : object.course.description}</TableCell>
                          <TableCell className={classes.row}>
                            <Tooltip title="Deletar">
                              <Button
                                  className={classes.buttonDelete}
                                  onClick={() => onClickOpenDialog(object.id)}>
                                <Delete fontSize="medium"/>
                              </Button>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <Button
                                  className={classes.buttonEdit}
                                  onClick={() => onClickEdit(object.id)}>
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
                       onClickAgree={onDeleteObject}
                       onClickDisagree={onClickCloseDialog}
                       mesage={'Deseja excluir o conteúdo selecionado?'}
                       title={'Excluir conteúdo'}/>
    </div>
  );
};

ObjectTable.propTypes = {
  history: PropTypes.object
};

export default ObjectTable;
