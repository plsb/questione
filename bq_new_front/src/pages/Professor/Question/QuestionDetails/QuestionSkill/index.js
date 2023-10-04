import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { uniqueId } from 'lodash';
import {
    MenuItem,
    TextField,
    Button, Grid, Tooltip, Divider
} from "@material-ui/core";
import api from "../../../../../services/api";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import clsx from "clsx";
import Save from "@material-ui/icons/Save";
import { toast } from 'react-toastify';

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
    const { className, idQuestion, history, tabValueChange, ...rest } = props;
    const [courses, setCourses] = useState([{ 'id': '0', 'description': 'Todas as áreas' }]);
    const [objects, setObjects] = useState([{ 'id': '0', 'description': 'Todos os conteúdos' }]);
    const [skills, setSkills] = useState([{ 'id': '0', 'description': 'Todas as competências' }]);
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
    const [objectLoading, setObjectLoading] = useState(false);

    const classes = useStyles();

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
        } catch (error) {

        }
    }

    async function loadObjectsSelectQuestion() {
        try {
            setObjectLoading(true);

            const response = await api.get('question/object-question/' + idQuestion);

            if (response.status === 200) {
                const values = [];
                if (response.data.length > 0) {

                    response.data.forEach(function logArrayElements(element, index, array) {
                        if (element.object.fk_regulation_id == courseSelect) {
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

            setObjectLoading(false);
        } catch (error) {
            setObjectLoading(false);
        }
    }

    async function loadObjects() {
        try {
            setObjectLoading(true);

            const response = await api.get('all/objects-by-regulation?fk_regulation_id=' + courseSelect);
            setObjects([{ 'id': '0', 'description': 'Todos os objetos' }, ...response.data]);
            //setObjectSelect(0);
            loadObjectsSelectQuestion();
            setObjectLoading(false);
        } catch (error) {
            setObjectLoading(false);
        }
    }

    async function loadSkills() {
        try {
            const response = await api.get('all/skills-by-regulation?fk_regulation_id=' + courseSelect);
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
        verifyToSave();
    }, [tabValueChange]);

    /*useEffect(() => {

        return () => {

            onClickSkill();
        }

    }, []);*/

    useEffect(() => {
        loadSkills();
        loadObjects();
    }, [courseSelect]);

    useEffect(() => {

    }, [inputObjects]);

    useEffect(() => {
        if(question.fk_regulation_id != null){
            setCourseSelect(question.fk_regulation_id);
        } else if (question.skill != null) {
            setCourseSelect(question.skill.fk_regulation_id);
        } else if(question.fk_course_id) {
            let id_regulation = 0;
            courses.forEach(
                function (element) {
                    if(element.id == question.fk_course_id) {

                        if (element.regulations) {
                            id_regulation = element.regulations[0].id;
                            return false;
                        }
                    }

                }
            );
            setCourseSelect(id_regulation);
        } else{
            setCourseSelect(0);
        }

    }, [courses]);

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

        values.push({ idItem: `knowledge-object-${uniqueId()}${Date.now()}`, objectSelected: 0 });
        setInputObjects(values);
    };

    const handleRemoveObjects = (idItem) => {
        const length = inputObjects.length;
        //se só tiver um elemento ele retorna pois não pode excluir
        if (length == 0) {
            return;
        }
        setObjectsDelete((lastObjectsDelete) => {
            lastObjectsDelete.push({ idItem });
            return lastObjectsDelete;
        });
        setInputObjects((lastObjects) => lastObjects.filter((object) => object.idItem !== idItem));

    };

    const handleInputChangeObject = (event, index) => {
        // const alreadyAdded = inputObjects.some((object) => object.objectSelected === event.target.value);
        // if (alreadyAdded) {
        //     return;
        // }

        const values = [...inputObjects];
        values[index].objectSelected = event.target.value;

        setInputObjects(values);
    };

    async function saveSkill() {
        try {
            const fk_regulation_id = courseSelect;
            let fk_skill_id = skillSelect;
            if (skillSelect == 0) {
                fk_skill_id = null;
            }
            const data = {
                fk_regulation_id, fk_skill_id
            }
            const response = await api.put('question/update-course-skill/' + idQuestion, data);
            if (response.status === 200) {
                toast.success('Área de conhecimento atualizada.');
            }
        } catch (error) {

        }
    }

    async function deleteObject(idObject) {
        try {
            setObjectLoading(true);
            const response = await api.delete('question/deleteobject/' + idObject);
            if (response.status === 200 || response.status === 201) {

            }
            setObjectLoading(false);
        } catch (error) {
            setObjectLoading(false);
        }
    }

    async function saveObject(element, index) {
        try {
            setObjectLoading(true);

            const fk_question_id = question.id;
            const fk_knowledge_object = element.objectSelected;
            const data = {
                fk_question_id, fk_knowledge_object
            }

            let response = {};
            if (element.idItem !== 0 && `${element.idItem}`.indexOf('knowledge-object-') === -1) {
                response = await api.put('question/update-object/' + element.idItem, data);
            } else {
                response = await api.post('question/addobject', data);
            }

            if (response.status === 200) {
                inputObjects[index].idItem = response.data[0].id;
                setInputObjects(inputObjects);
                //toast.success( 'Objetos de conhecimento atualizados.');
            }

            setObjectLoading(false);
        } catch (error) {
            setObjectLoading(false);
        }
    }

    const verifyToSave = () => {
        if (courseSelect == 0) {
            return 'Informe a área.';
        } else {
            saveSkill();
            objectsDelete.forEach(function logArrayElements(element, index, array) {
                deleteObject(element.idItem);
            });

            if (inputObjects.length > 0) {
                const reduced = [];

                inputObjects.forEach((item) => {
                    var duplicated  = reduced.findIndex(redItem => {
                        return item.objectSelected === redItem.objectSelected;
                    }) > -1;

                    if(!duplicated) {
                        reduced.push(item);
                    }
                });


                reduced.forEach(function logArrayElements(element, index, array) {
                    if (element.objectSelected != 0) {
                        saveObject(element, index);
                    } else {
                        deleteObject(element);
                    }
                });
            }
            return true;
        }

    }

    const onClickSkill = () => {
        let messageSaveItens = verifyToSave();
        if(messageSaveItens != true)
            toast.error(messageSaveItens);

    }

    const handleChangeCourse = (event) => {
        setCourseSelect(event.target.value);
    }

    return (
        <div>
            <div style={{ padding: "15px" }}>
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
                        option.id == 0 ?
                            <MenuItem key={option.id} value={option.id}>
                                {option.description}
                            </MenuItem>
                        :
                        option.regulations && option.regulations.map((regulation) => (
                                <MenuItem key={regulation.id} value={regulation.id}>
                                    {option.description+' ('+regulation.year+')'}
                                </MenuItem>
                            )

                        )

                    ))}
                </TextField>
            </div>

            <div style={{ padding: "15px" }}>
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
            <div style={{ padding: "15px" }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    <Tooltip title="A questão deverá ter no máximo 03 objetos de conhecimento.">
                        {btAddObject == true ?
                            <Button size="small" color="primary" onClick={handleAddObjects}>Adicionar Objeto</Button> :
                            <Button size="small" color="primary" disabled>Adicionar Objeto</Button>
                        }
                    </Tooltip>
                    {/* {btRemoveObject == true ?
                       <Button style={{marginLeft: "10px"}} className={clsx(classes.btRemove, className)} variant="outlined" onClick={() => handleRemoveObjects()}>Remover Objeto</Button> :
                       <Button style={{marginLeft: "10px"}} className={clsx(classes.btRemove, className)} variant="outlined" disabled>Remover Objeto</Button>
                   } */}
                </Grid>
            </div>
            {inputObjects.map((inputField, index) => (
                <div style={{ padding: "15px", display: 'flex', alignItems: 'center' }}>
                    <TextField
                        id={"obj" + index}
                        select
                        label="Selecione o conteúdo"
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
            <div style={{ marginTop: '16px' }}>
                <Divider /><br />
            </div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center" style={{padding: "15px"}}>
                <Button
                    color="primary"
                    variant="outlined"
                    className={classes.button}
                    disabled={objectLoading}
                    onClick={onClickSkill}>
                    Salvar área de conhecimento
                </Button>

            </Grid>
            {/*<Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={onClickSkill}
                    endIcon={<Save />}
                    style={{ marginTop: '20px' }}
                    disabled={objectLoading}>
                    Salvar
               </Button>
            </Grid>*/}
        </div>

    );
}

QuestionSkill.propTypes = {
    className: PropTypes.string,
    idQuestion: PropTypes.number,
};

export default withRouter(QuestionSkill);
