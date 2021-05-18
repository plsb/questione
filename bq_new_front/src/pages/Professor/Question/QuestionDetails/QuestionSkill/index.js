import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { uniqueId } from 'lodash';
import {
    MenuItem,
    TextField,
    Button, Grid, Tooltip
} from "@material-ui/core";
import api from "../../../../../services/api";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import clsx from "clsx";
import Save from "@material-ui/icons/Save";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    btRemove: {
        color: '#f44336',
        marginRight: 2
    }
});

const QuestionSkill = props => {
    const { className, idQuestion, history, ...rest } = props;
    const [courses, setCourses] = useState([{ 'id': '0', 'description': 'Todos as áreas' }]);
    const [objects, setObjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [courseSelect, setCourseSelect] = useState(0);
    const [objectSelect, setObjectSelect] = useState([]);
    const [skillSelect, setSkillSelect] = useState([]);
    const [inputObjects, setInputObjects] = useState([
        { idItem: 0, objectSelected: 0 }
    ]);
    const [btAddObject, setBtAddObject] = useState(false);
    const [btRemoveObject, setBtRemoveObject] = useState(false);
    const [question, setQuestion] = useState(false);
    const [objectsDelete, setObjectsDelete] = useState([]);

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

    async function loadQuestion() {
        try {
            const response = await api.get('question/show/' + idQuestion);
            if (response.status === 200) {
                setQuestion(response.data[0]);
            }
        } catch (error) {
        }
    }

    async function loadCourses() {
        try {
            const response = await api.get('all/courses-user');
            setCourses([{ 'id': '0', 'description': 'Todos as áreas' }, ...response.data]);
            setCourseSelect(0);
            if (question.fk_course_id != null) {
                setCourseSelect(question.fk_course_id);
            }

        } catch (error) {

        }
    }

    async function loadObjectsSelectQuestion() {
        try {
            const response = await api.get('question/object-question/' + idQuestion);

            if (response.status === 200) {
                const values = [];
                if (response.data.length > 0) {
                    response.data.forEach(function logArrayElements(element, index, array) {
                        if (element.object.fk_course_id == courseSelect) {
                            values.push({
                                idItem: response.data[index].id,
                                objectSelected: response.data[index].fk_knowledge_object,
                            });
                        } else {
                            deleteObject(element.id);
                        }

                    });

                    if (values[0]) {
                        setInputObjects(values);
                    } else {
                        setInputObjects([{ idItem: 0, objectSelected: 0 }]);
                    }
                }

            }
        } catch (error) {

        }
    }

    async function loadObjects() {
        try {
            const response = await api.get('all/objects?fk_course_id=' + courseSelect);
            setObjects([{ 'id': '0', 'description': 'Todos os objetos' }, ...response.data]);
            //setObjectSelect(0);
            loadObjectsSelectQuestion();

        } catch (error) {

        }
    }

    async function loadSkills() {
        try {
            const response = await api.get('all/skills?fk_course_id=' + courseSelect);
            if (response.status == 200) {
                setSkills([{ 'id': '0', 'description': 'Todas as competências' }, ...response.data]);
                setSkillSelect(0);
                if (question.fk_skill_id != null) {
                    response.data.forEach(function logArrayElements(element, index, array) {
                        if (element.id == question.fk_skill_id) {
                            setSkillSelect(question.fk_skill_id);
                        }
                    });
                }
            }


        } catch (error) {

        }
    }

    useEffect(() => {
        const length = inputObjects.length;
        if (length == 0) {
            setBtAddObject(true);
            setBtRemoveObject(false);
        } else if (length == 3) {
            setBtAddObject(false);
            setBtRemoveObject(true);
        } else {
            setBtAddObject(true);
            setBtRemoveObject(true);
        }

    }, [inputObjects]);

    useEffect(() => {
        if (idQuestion) {
            loadQuestion();
        } else {
            setObjects([{ 'id': '0', 'description': 'Todos os objetos' }]);
            setObjectSelect(0);
            setSkills([{ 'id': '0', 'description': 'Todas as competências' }]);
            setSkillSelect(0);
        }
    }, []);

    useEffect(() => {
        loadCourses();
    }, [question]);

    useEffect(() => {
        loadSkills();
        loadObjects();
    }, [courseSelect]);

    useEffect(() => {

    }, [inputObjects]);

    /*const onChangeObject = (e) =>{
        setObjectSelect(e.target.value);
    }*/

    const onChangeSkill = (e) => {
        setSkillSelect(e.target.value);
    }

    const handleAddObjects = () => {
        const values = [...inputObjects];
        const length = inputObjects.length;
        //o máximo são três objetos de conhecimento
        if (length == 3) {
            return;
        }
        values.push({ idItem: `${uniqueId()}${Date.now()}`, objectSelected: 0 });
        setInputObjects(values);
    };

    const handleRemoveObjects = (idItem) => {
        const values = [...inputObjects];
        const length = inputObjects.length;
        //se só tiver um elemento ele retorna pois não pode excluir
        if (length == 0) {
            return;
        }
        const element = values[length - 1];
        if (element.idItem > 0) {
            objectsDelete.push({ idItem: element.idItem })
        }
        //pega último elemtno antes de excluir
        // values.splice(length-1, 1);
        setInputObjects((lastObjects) => lastObjects.filter((object) => object.idItem !== idItem));

    };

    const handleInputChangeObject = (event, index) => {
        const values = [...inputObjects];
        values[index].objectSelected = event.target.value;

        setInputObjects(values);
    };

    async function saveSkill() {
        try {
            const fk_course_id = courseSelect;
            let fk_skill_id = skillSelect;
            if (skillSelect == 0) {
                fk_skill_id = null;
            }
            const data = {
                fk_course_id, fk_skill_id
            }
            const response = await api.put('question/update-course-skill/' + idQuestion, data);
            if (response.status === 200) {
                loadAlert('success', 'Questão atualizada.');
            }
        } catch (error) {

        }
    }

    async function deleteObject(idObject) {
        try {
            const response = await api.delete('question/deleteobject/' + idObject);
            if (response.status === 200 || response.status === 201) {

            }
        } catch (error) {

        }
    }

    async function saveObject(element, index) {
        try {
            const fk_question_id = question.id;
            const fk_knowledge_object = element.objectSelected;
            const data = {
                fk_question_id, fk_knowledge_object
            }

            let response = {};
            if (element.idItem > 0) {
                response = await api.put('question/update-object/' + element.idItem, data);
            } else {
                response = await api.post('question/addobject', data);
            }

            if (response.status === 200) {
                inputObjects[index].idItem = response.data.id;
                loadAlert('success', 'Objetos de conhecimento atualizados.');
            }
        } catch (error) {

        }
    }

    const onClickSkill = () => {

        if (courseSelect == 0) {
            loadAlert('error', 'Informe a área.');
            return;
        } else {
            saveSkill();
            objectsDelete.forEach(function logArrayElements(element, index, array) {
                deleteObject(element.idItem);
            });
            if (inputObjects.length > 0) {
                inputObjects.forEach(function logArrayElements(element, index, array) {
                    if (element.objectSelected != 0) {
                        saveObject(element, index);
                    } else {
                        deleteObject(element);
                    }
                });
            }
        }
    }

    const handleChangeCourse = (event) => {
        setCourseSelect(event.target.value);
    }

    return (
        <div>
            <div style={{ marginTop: "10px" }}>
                <TextField
                    key="area"
                    select
                    label="Selecione a área"
                    value={courseSelect}
                    onChange={handleChangeCourse}
                    variant="outlined"
                    margin="dense"
                    style={{ width: "100%" }}>
                    {courses.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.description}
                        </MenuItem>
                    ))}
                </TextField>
            </div>

            <div style={{ marginTop: "10px" }}>
                <TextField
                    id="filled-select-currency"
                    select
                    label="Selecione a competência"
                    value={skillSelect}
                    onChange={onChangeSkill}
                    variant="outlined"
                    margin="dense"
                    style={{ width: "100%" }}>
                    {skills.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.description}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            {inputObjects.map((inputField, index) => (
                <div style={{ marginTop: "10px", display: 'flex', alignItems: 'center' }}>
                    <TextField
                        id={"obj" + index}
                        select
                        label="Selecione o objeto de conhecimento"
                        value={inputObjects[index].objectSelected}
                        onChange={(event) => handleInputChangeObject(event, index)}
                        variant="outlined"
                        margin="dense"
                        style={{ width: "100%" }}
                        name={'obj' + index}>
                        {objects.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.description}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button style={{ marginLeft: "10px", marginTop: '2px', maxHeight: '38px' }} className={clsx(classes.btRemove, className)} variant="outlined" onClick={() => handleRemoveObjects(inputField.idItem)}>Remover</Button>
                </div>
            ))}
            <div style={{ margin: "20px 0px" }}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    <Tooltip title="A questão deverá ter no máximo 03 objetos de conhecimento.">
                        {btAddObject == true ?
                            <Button color="primary" variant="outlined" onClick={handleAddObjects}>Adicionar Objeto</Button> :
                            <Button color="primary" variant="outlined" disabled>Adicionar Objeto</Button>
                        }
                    </Tooltip>
                    {/* {btRemoveObject == true ?
                       <Button style={{marginLeft: "10px"}} className={clsx(classes.btRemove, className)} variant="outlined" onClick={() => handleRemoveObjects()}>Remover Objeto</Button> :
                       <Button style={{marginLeft: "10px"}} className={clsx(classes.btRemove, className)} variant="outlined" disabled>Remover Objeto</Button>
                   } */}
                </Grid>
            </div>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={onClickSkill}
                    endIcon={<Save />}
                    style={{ marginTop: '20px' }}>
                    Salvar
               </Button>
            </Grid>
        </div>

    );
}

QuestionSkill.propTypes = {
    className: PropTypes.string,
    idQuestion: PropTypes.number,
};

export default withRouter(QuestionSkill);
