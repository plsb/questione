import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent, Fab, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography,
} from '@material-ui/core';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Delete from "@material-ui/icons/Delete";
import {DialogQuestione} from "../../../components";


export function FormkitCheck(props) {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1.19em" height="1em" viewBox="0 0 32 27" {...props}><path fill="currentColor" d="M26.99 0L10.13 17.17l-5.44-5.54L0 16.41L10.4 27l4.65-4.73l.04.04L32 5.1L26.99 0z"></path></svg>
  )
}

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
  headTable: {
    fontWeight: "bold"
  },
  tree: {
    fontSize: 40
  },
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  buttonRemove:{
    backgroundColor: '#e57373',
    color: '#ffebee',
  },
}));

const ObjectSuggestionTable = props => {
  const { className } = props;
  const history = useHistory();
  const [open, setOpen] = React.useState(false);


  const classes = useStyles();
  const [courses, setCourses] = useState([{'id': '0', 'description': '- Escolha um curso -'}]);
  const [objsRelated, setObjsRelated] = useState(null);
  const [courseSelect, setCourseSelect] = useState([{'id': '0', 'description': '- Escolha um curso -'}]);

  const [obj1Selected, setObj1Selected] = useState(null);
  const [obj2Selected, setObj2Selected] = useState(null);



  async function loadCourses(){
    try {

      const response = await api.get('all/courses');

      if (response.status == 200) {
        setCourses([...courses, ...response.data]);

      } else {
        setCourses([]);
      }

    } catch (error) {

    }
  }


  useEffect(() => {
    loadCourses();

  }, []);

  async function searchObjectsRelated(){
    try {

      const response = await api.get('object/relate/search-objects-related?fk_course_id='+courseSelect);

      if (response.status == 200) {
        setObjsRelated(response.data);

      } else {
        if (response.status === 202) {
          if(response.data.message){
            toast.error(response.data.message);
          }
        }
        setObjsRelated([]);
      }
    } catch (error) {

    }
  }

  const handleChangeCourse = event => {
    let id = event.target.value;
    setCourseSelect(id);
    loadCourses();
  };

  async function onRelatedObject() {
    try {
      try {
        const fk_obj1_id = obj1Selected;
        const fk_obj2_id = obj2Selected;

        const data = {
          fk_obj1_id, fk_obj2_id
        }
        let response= {};
        let acao = "";

        response = await api.post('object/relate', data);
        acao = "cadastrada";

        if (response.status === 202) {
          if(response.data.message){
            toast.error(response.data.message);
          } else if(response.data.errors[0].fk_obj1_id){
            toast.error(response.data.errors[0].fk_obj1_id);
          } if(response.data.errors[0].fk_obj2_id){
            toast.error(response.data.errors[0].fk_obj2_id);
          }
        } else if (response.status === 200) {
          toast.success('Relação de conteúdo '+acao+'.');
          //window.location.reload();
          searchObjectsRelated();
        }

      } catch (error) {

      }
    } catch (error) {

    }
    setOpen(false);
  }

  const onClickRelateObject = (id1, id2) => {
    setObj1Selected(id1);
    setObj2Selected(id2);
    setOpen(true);
  }

  return (
    <div>
      <div className={classes.root}>
        <Card
            className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
            <div className={classes.content} style={{marginTop: '40px', marginLeft: '10px'}}>
              <Grid container spacing={10}>
                <Grid container item xs={6} spacing={3}>
                  <TextField
                      fullWidth
                      label=""
                      margin="dense"
                      name="regulationsSelected1"
                      onChange={handleChangeCourse}
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}
                      value={courseSelect}
                      variant="outlined">
                    {courses && courses.map(course => (
                        <option
                            key={course.id}
                            value={course.id}>
                          {course.description}
                        </option>
                    ))}
                  </TextField>
                  <Button
                      color="primary"
                      variant="outlined"
                      onClick={searchObjectsRelated}
                      disabled={false} >
                    Buscar relações
                  </Button>
                </Grid>

              </Grid>

            </div>

            <div className={classes.content} style={{marginTop: '50px'}}>
              <PerfectScrollbar>
                <div className={classes.inner}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.headTable}>Conteúdo 1</TableCell>
                        <TableCell className={classes.headTable}>Curso 1</TableCell>
                        <TableCell className={classes.headTable}>Conteúdo 2</TableCell>
                        <TableCell className={classes.headTable}>Curso 2</TableCell>
                        <TableCell className={classes.headTable}>Porcentagem</TableCell>
                        <TableCell className={classes.headTable}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {objsRelated && objsRelated.map((obj, i) => (
                          <TableRow
                              className={classes.tableRow}
                              hover
                              key={i}>
                            <TableCell>{obj.year_1 ? obj.description_1+' ('+obj.year_1+')' : obj.description_1}</TableCell>
                            <TableCell>{obj.course_1}</TableCell>
                            <TableCell>{obj.year_2 ? obj.description_2+' ('+obj.year_2+')' : obj.description_2}</TableCell>
                            <TableCell>{obj.course_2}</TableCell>
                            <TableCell>{Math.round(obj.cost)+'%'}</TableCell>
                            <TableCell>
                              <Tooltip title="Relacionar">
                                <Button
                                    className={classes.buttonDelete}
                                    onClick={()=> onClickRelateObject(obj.id_1, obj.id_2)}>
                                  <FormkitCheck />
                                </Button>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </PerfectScrollbar>
            </div>

          </CardContent>

        </Card>
        <DialogQuestione handleClose={() => setOpen(false)}
                         open={open}
                         onClickAgree={onRelatedObject}
                         onClickDisagree={() => setOpen(false)}
                         mesage={'Deseja relacionar os conteúdos?'}
                         title={'Relacionar conteúdos'}/>

    </div>
    </div>
  );
};

ObjectSuggestionTable.propTypes = {
  history: PropTypes.object
};

export default ObjectSuggestionTable;
