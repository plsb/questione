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
import SkillToolbar from "./components/SkillToolbar";
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

const SkillTable = props => {
  const { className, history } = props;

  const [skills, setSkills] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTextCourse, setSearchTextCourse] = useState(0);
  const [searchTextRegulation, setSearchTextRegulation] = useState(0);
  const [idSkillDelete, setIdSkillDelete] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const COURSE_SELECTED = '@Questione-course-selected';
  const REGULATION_SELECTED = '@Questione-regulation-selected';

  async function loadSkill(page, course, regulation){
    try {
      let url = 'skill?page='+page;
      if(course!=null){
        if(course > 0)
          url += '&fk_course_id='+course;
      }
      if(regulation!=null){
        if(regulation > 0)
          url += '&fk_regulation_id='+regulation;
      }
      const response = await api.get(url);
      if(response.status == 200) {
        setTotal(response.data.total);
        setSkills(response.data.data);
      }
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

    loadSkill(1, courseSelected, regulationSelected);
  }, []);

  const updateSearchCourse = (e) => {
    setSearchTextCourse(e.target.value);
    localStorage.setItem(COURSE_SELECTED, e.target.value);
  }

  const updateSearchRegulation = (e) => {
    setSearchTextRegulation(e.target.value);
    localStorage.setItem(REGULATION_SELECTED, e.target.value);
  }

  const onClickOpenDialog = (id) => {
    setIdSkillDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdSkillDelete(0);
  }

  async function onDeleteSkill(){
    try {
      let url = 'skill/'+idSkillDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        toast.success('Competência excluída.');
        loadSkill(page+1, searchTextCourse, searchTextRegulation);
      }
    } catch (error) {

    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/skill-details/'+id);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadSkill(1, searchTextCourse, searchTextRegulation);
  }

  const handlePageChange = (event, page) => {
    loadSkill(page+1, searchTextCourse, searchTextRegulation)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <div className={classes.root}>
      <SkillToolbar
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
                    {skills.map(skill => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={skill.id}>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <Typography variant="body1">{skill.description}</Typography>
                            </div>
                          </TableCell>
                          <TableCell>{skill.regulation ?
                              skill.regulation.description+" de "+skill.regulation.year+" | "+skill.course.description
                                : skill.course.description}</TableCell>
                          <TableCell className={classes.row}>
                            <Tooltip title="Deletar">
                              <Button
                                  className={classes.buttonDelete}
                                  onClick={() => onClickOpenDialog(skill.id)}>
                                <Delete fontSize="medium"/>
                              </Button>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <Button
                                  className={classes.buttonEdit}
                                  onClick={() => onClickEdit(skill.id)}>
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
                       onClickAgree={onDeleteSkill}
                       onClickDisagree={onClickCloseDialog}
                       mesage={'Deseja excluir a competência selecionada?'}
                       title={'Excluir Competência'}/>
    </div>
  );
};

SkillTable.propTypes = {
  history: PropTypes.object
};

export default SkillTable;
