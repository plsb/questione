import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio, Card, CardContent, Box, Tooltip, Divider
} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import api from "../../../../../../services/api";
import useStyles from "../../../../../../style/style";

const useStylesLocal = makeStyles(theme => ({
  root: {
  },
  textField: {
    marginLeft: theme.spacing(1),
  },
  subtitle: {
    padding: '16px',
    fontSize: '15px',
  },
}));

const QuestionToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, onClickCleanSearch,
                        history, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': 'Todos as áreas'}]);
  const [objects, setObjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [courseSelect, setCourseSelect] = useState([]);
  const [objectSelect, setObjectSelect] = useState([]);
  const [skillSelect, setSkillSelect] = useState([]);
  const [idSelect, setIdSelect] = useState('');
  const [keywordsAll, setKeywordsAll] = useState([]);
  /* S - suas questões
     T - todas as questões
   */
  const [valueSelect, setValueSelect] = React.useState('S');

  const classes = useStylesLocal();
  const classesGeneral = useStyles();


  const onClickNewCourse = e => {
    history.push('/question-details');
  }

  const onChangeCourse = (e) =>{
    setCourseSelect(e.target.value);
    searchText[1] = {"fk_course_id" : e.target.value};
    searchText[2] = {"fk_object_id" : 0};
    searchText[3] = {"fk_skill_id" : 0};
  }

  const onClean = () =>{
    setCourseSelect(0);
    searchText[1] = {"fk_course_id" : 0};
    searchText[2] = {"fk_object_id" : 0};
    searchText[3] = {"fk_skill_id" : 0};
    onClickCleanSearch();
  }

  const onChangeObject = (e) =>{
    setObjectSelect(e.target.value);
    searchText[2] = {"fk_object_id" : e.target.value};
  }

  const onChangeId = (e) =>{
    setIdSelect(e.target.value);
    searchText[5] = {"id" : e.target.value};
  }

  const onChangeSkill = (e) =>{
    setSkillSelect(e.target.value);
    searchText[3] = {"fk_skill_id" : e.target.value};
  }

  async function loadCourses(){
    try {
      const response = await api.get('all/courses-user');
      setCourses([...courses, ...response.data]);

    } catch (error) {

    }
  }

  async function loadObjects(){
    try {
      const fk_course_id = courseSelect;
      const data = {
        fk_course_id
      }
      const response = await api.get('all/objects?fk_course_id='+courseSelect);

      setObjects([{'id': '0', 'description': 'Todos os conteúdos'}, ...response.data]);

    } catch (error) {

    }
  }

  async function loadSkills(){
    try {
      const fk_course_id = courseSelect;
      const data = {
        fk_course_id
      }
      const response = await api.get('all/skills?fk_course_id='+courseSelect);

      setSkills([{'id': '0', 'description': 'Todas as competências'}, ...response.data]);

    } catch (error) {

    }
  }

  async function loadKeywordsAll(){
    try {
      const response = await api.get('all/keywords');
      if(response.status === 200){
        setKeywordsAll(response.data);
      }
    } catch (error) {
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
    searchText[4] = {"keyword" : ''};
    searchText[5] = {"id" : ''};
    loadObjects();
  }, []);

  useEffect(() => {
    if(localStorage.getItem('@Questione-search-course') != null){
      setCourseSelect(localStorage.getItem('@Questione-search-course'));
    }
    loadObjects();
  }, [courses]);

  useEffect(() => {
    loadKeywordsAll();
    if(courseSelect != 0) {
      loadObjects();
      loadSkills();
    } else {
      setObjects([{'id': '0', 'description': 'Todos os conteúdos'}]);
      setSkills([{'id': '0', 'description': 'Todas as competências'}]);
    }

  }, [courseSelect]);


  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const selectKeyWord = (event, newValue) => {
    if(newValue!=null){
      searchText[4].keyword = newValue.keyword;
    } else {
      searchText[4].keyword = '';
    }
  }

  return (
      <div
          {...rest}
          className={clsx(classes.root, className)}>
        <div className={classesGeneral.row}>
          <div style={{ flex: 1 }}>

            {/*<div className={classes.subtitle}>
              Para mais informações sobre o módulo questões,&nbsp;
              <a href="https://docs.google.com/document/d/1JzpLbCMDaOQbGubzB6l1KDBaPjGro10-x2OHxdFLtqU/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer">
                clique aqui
              </a>.
            </div>*/}
          </div>
        </div>
        <Card className={classes.root}>
          {/*<CardContent>
              <Tooltip title="Clique para buscar">
                <Button
                    onClick={onClickSearch}>
                  <FcSearch size="30"/>
                </Button>
              </Tooltip>
            <Tooltip title="Clique para limpar o filtro da busca">
              <Button
                  onClick={onClickCleanSearch}>
                <FcClearFilters size="30"/>
              </Button>
            </Tooltip>
          </CardContent>*/}

          <CardContent>
            <Box display="flex">
              <Box display="flex" justifyContent="flex-start">
                <div className={classesGeneral.titleList}>{'Questões'}</div>
              </Box>
              <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-end">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onClickNewCourse}
                    className={classesGeneral.buttons}>
                  Nova Questão
                </Button>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-start" style={{marginTop: '25px'}}>
              {/* <TextField
                  label="Código"
                  helperText="Código da Questão"
                  margin="dense"
                  onChange={onChangeId}
                  value={searchText[5] != null  ? searchText[5].id : ""}
                  style={{width: '140px'}}
                  variant="outlined"
              />*/}
              <TextField
                  id="filled-select-currency"
                  select
                  label="Área"
                  value={searchText[1] ? searchText[1].fk_course_id : 0}
                  onChange={onChangeCourse}
                  helperText="Selecione a àrea."
                  variant="outlined"
                  margin="dense"
                 style={{width: '300px'}}>
                {courses.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                ))}
              </TextField>
              {/*<TextField
                  className={classes.textField}
                  id="filled-select-currency"
                  select
                  label="Competência"
                  value={searchText[3] ? searchText[3].fk_skill_id : 0}
                  onChange={onChangeSkill}
                  helperText="Selecione a competência."
                  variant="outlined"
                  margin="dense"
                  style={{width: '300px'}}>
                {skills.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                ))}
              </TextField>*/}
              <TextField
                  className={classes.textField}
                  id="filled-select-currency"
                  select
                  label="Conteúdo"
                  value={searchText[2] ? searchText[2].fk_object_id : 0}
                  onChange={onChangeObject}
                  helperText="Selecione o conteúdo."
                  variant="outlined"
                  margin="dense"
                  style={{width: '300px'}}>
                {objects.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                ))}
              </TextField>
            </Box>


            {/*<div className={classes.row}>

              <Autocomplete
                  id="keywords"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  inputValue={searchText[4] ? searchText[4].keyword : inputValue}
                  onInputChange={(event, newInputValue) => {
                    searchText[4].keyword = newInputValue;
                    setInputValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={keywordsAll}
                  getOptionLabel={(option) => option.keyword}
                  style={{ marginLeft: '10px', width: '200px' }}
                  renderInput={(params) => <TextField {...params} label="Palavra-chave" variant="outlined" />}
              />
            </div>*/}

              <Box display="flex" justifyContent="flex-start">
                  <FormControl component="fieldset">
                    <RadioGroup row={true} aria-label="opcao" name="opcao" value={searchText[0] ? searchText[0].value : 'T'} onChange={handleChangeSelect}>
                      <Tooltip title="Apresenta apenas as questões do usuário ativo que não foram finalizadas.">
                        <FormControlLabel value="N" control={<Radio />} label="Não finalizadas" />
                      </Tooltip>
                      <Tooltip title="Apresenta apenas as questões do usuário ativo que estão habilitadas.">
                        <FormControlLabel value="S" control={<Radio />} label="Suas questões" />
                      </Tooltip>
                      <Tooltip title="Apresenta as questões de todos os usuários que estejam habilitadas.">
                        <FormControlLabel value="T" control={<Radio />} label="Todas as questões" />
                      </Tooltip>
                    </RadioGroup>
                  </FormControl>
              </Box>

              <Box display="flex" justifyContent="flex-start">

                  <Button variant="contained" color="primary" className={classesGeneral.buttons} onClick={onClickSearch}>
                    Filtrar questões
                  </Button>
                <div style={{marginLeft: '10px'}}>
                  <Button variant="contained"className={classesGeneral.buttons} onClick={onClean}>
                    Limpar Filtro
                  </Button>
                </div>
              </Box>

          </CardContent>
        </Card>
    </div>
  );
};

QuestionToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  onClickCleanSearch: PropTypes.func,
  searchText: PropTypes.array,
  history: PropTypes.object
};

export default withRouter(QuestionToolbar);
