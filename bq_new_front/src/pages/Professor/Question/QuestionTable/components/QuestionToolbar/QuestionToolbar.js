import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio, Tooltip, Card, CardActions, CardContent, Collapse,
  IconButton} from '@material-ui/core';
import FindInPage from '@material-ui/icons/SearchSharp';
import {withRouter} from "react-router-dom";
import api from "../../../../../../services/api";
import {SearchInput} from "../../../../../../components";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  title: {
    fontWeight: 'bold'
  },
  textField: {
    marginLeft: theme.spacing(3),
  }
}));

const QuestionToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, history, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': 'Todos as áreas'}]);
  const [objects, setObjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [courseSelect, setCourseSelect] = useState([]);
  const [objectSelect, setObjectSelect] = useState([]);
  const [skillSelect, setSkillSelect] = useState([]);
  const [textBaseSelect, setTextBaseSelect] = useState('');
  /* S - suas questões
     T - todas as questões
   */
  const [valueSelect, setValueSelect] = React.useState('S');

  const classes = useStyles();


  const onClickNewCourse = e => {
    history.push('/question-details');
  }

  const onChangeCourse = (e) =>{
    setCourseSelect(e.target.value);
    searchText[1] = {"fk_course_id" : e.target.value};
    searchText[2] = {"fk_object_id" : 0};
  }

  const onChangeObject = (e) =>{
    setObjectSelect(e.target.value);
    searchText[2] = {"fk_object_id" : e.target.value};
  }

  const onChangeSkill = (e) =>{
    setSkillSelect(e.target.value);
    searchText[3] = {"fk_skill_id" : e.target.value};
  }

  const onChangeTextBase = (e) =>{
    setTextBaseSelect(e.target.value);
    searchText[4] = {"base_text" : e.target.value};
  }

  async function loadCourses(){
    try {
      const response = await api.get('all/courses-user');
      setCourses([...courses, ...response.data]);

    } catch (error) {
      console.log(error);
    }
  }

  async function loadObjects(){
    try {
      const fk_course_id = courseSelect;
      const data = {
        fk_course_id
      }
      const response = await api.get('all/objects?fk_course_id='+courseSelect);
      console.log(response);
      setObjects([{'id': '0', 'description': 'Todos os objetos'}, ...response.data]);

    } catch (error) {
      console.log(error);
    }
  }

  async function loadSkills(){
    try {
      const fk_course_id = courseSelect;
      const data = {
        fk_course_id
      }
      const response = await api.get('all/skills?fk_course_id='+courseSelect);
      console.log(response);
      setSkills([{'id': '0', 'description': 'Todas as competências'}, ...response.data]);

    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSelect = (e) => {
    setValueSelect(e.target.value);
    searchText[0] = {"value" : e.target.value};
  };

  useEffect(() => {
    loadCourses();
    searchText[0] = {"value" : "S"};
    searchText[1] = {"fk_course_id" : 0};
    searchText[2] = {"fk_object_id" : 0};
    searchText[3] = {"fk_skill_id" : 0};
    searchText[4] = {"base_text" : ''};
  }, []);

  useEffect(() => {
    if(courseSelect != 0) {
      loadObjects();
      loadSkills();
    } else {
      setObjects([{'id': '0', 'description': 'Todos os objetos'}]);
      setSkills([{'id': '0', 'description': 'Todas as competências'}]);
    }
  }, [courseSelect]);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
      <div
          {...rest}
          className={clsx(classes.root, className)}>
        <div className={classes.row}>
          <Typography variant="h3" className={classes.title}>{'Questões'}</Typography>
          <span className={classes.spacer} />
          <Button
              color="primary"
              variant="contained"
              onClick={onClickNewCourse}>
            Nova Questão
          </Button>
        </div>
        <Card className={classes.root}>
          <CardContent>
              <FormControl component="fieldset">
                <RadioGroup aria-label="gender" name="gender1" value={valueSelect} onChange={handleChangeSelect}>
                  <FormControlLabel value="S" control={<Radio />} label="Listar apenas suas questões." />
                  <FormControlLabel value="T" control={<Radio />} label="Listar questões de todos os usuários." />
                </RadioGroup>
              </FormControl>
              <Tooltip title="Clique para pesquisar">
                <Button
                    onClick={onClickSearch}>
                  <FindInPage fontSize="large"/>
                </Button>
              </Tooltip>

          </CardContent>
          <CardActions disableSpacing>
            <Tooltip title="Clique para mais opções de pesquisa">
              <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more">
                <ExpandMoreIcon />
              </IconButton>
              </Tooltip>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <div className={classes.row}>
                <TextField
                    id="filled-select-currency"
                    select
                    label="Selecione o área"
                    value={courseSelect}
                    onChange={onChangeCourse}
                    helperText="Selecione o área que deseja pesquisar."
                    variant="outlined"
                    margin="dense">
                  {courses.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.description}
                      </MenuItem>
                  ))}
                </TextField>
                <TextField
                    className={classes.textField}
                    id="filled-select-currency"
                    select
                    label="Selecione a competência"
                    value={skillSelect}
                    onChange={onChangeSkill}
                    helperText="Selecione a competência que deseja pesquisar."
                    variant="outlined"
                    margin="dense">
                  {skills.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.description}
                      </MenuItem>
                  ))}
                </TextField>

              </div>
              <div className={classes.row}>
                <TextField
                    id="filled-select-currency"
                    select
                    label="Selecione o objeto de conhecimento"
                    value={objectSelect}
                    onChange={onChangeObject}
                    helperText="Selecione o objeto de conhecimento que deseja pesquisar."
                    variant="outlined"
                    margin="dense">
                  {objects.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.description}
                      </MenuItem>
                  ))}
                </TextField>
                <SearchInput
                    className={classes.textField}
                    placeholder="Pesquisar no texto base"
                    onChange={onChangeTextBase}
                    value={textBaseSelect}
                />

              </div>

            </CardContent>
          </Collapse>
        </Card>

    </div>
  );
};

QuestionToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(QuestionToolbar);
