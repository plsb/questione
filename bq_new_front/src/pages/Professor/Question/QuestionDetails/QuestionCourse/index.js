import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {MenuItem,
    TextField,
    ButtonGroup,
    Button} from "@material-ui/core";
import api from "../../../../../services/api";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import Swal from "sweetalert2";
import clsx from "clsx";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    btRemove: {
        color: '#f44336',
        marginRight: 2
    }
});



const QuestionCourse = props => {
    const { className, history, ...rest } = props;

    const [courses, setCourses] = useState([{'id': '0', 'description': 'Todos as áreas'}]);
    const [objects, setObjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [courseSelect, setCourseSelect] = useState([]);
    const [objectSelect, setObjectSelect] = useState([]);
    const [skillSelect, setSkillSelect] = useState([]);
    const [inputObjects, setInputObjects] = useState([
        { objectSelected: 0 }
    ]);
    const [btAddObject, setBtAddObject] = useState(false);
    const [btRemoveObject, setBtRemoveObject] = useState(false);

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
            setObjectSelect(0)

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
            setSkillSelect(0);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const length = inputObjects.length;
        if(length == 1){
            setBtAddObject(true);
            setBtRemoveObject(false);
        } else if(length == 3){
            setBtAddObject(false);
            setBtRemoveObject(true);
        } else {
            setBtAddObject(true);
            setBtRemoveObject(true);
        }

    }, [inputObjects]);

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if(courseSelect != 0) {
            loadObjects();
            loadSkills();
        } else {
            setObjects([{'id': '0', 'description': 'Todos os objetos'}]);
            setObjectSelect(0);
            setSkills([{'id': '0', 'description': 'Todas as competências'}]);
            setSkillSelect(0);
        }
    }, [courseSelect]);

    const onChangeCourse = (e) =>{
        setCourseSelect(e.target.value);
    }

    const onChangeObject = (e) =>{
        setObjectSelect(e.target.value);
    }

    const onChangeSkill = (e) =>{
        setSkillSelect(e.target.value);
    }

    const handleAddObjects = () => {
        const values = [...inputObjects];
        const length = inputObjects.length;
        //o máximo são três objetos de conhecimento
        if(length == 3){
            return ;
        }
        values.push({ objectSelected: 0 });
        setInputObjects(values);
    };

    const handleRemoveObjects = () => {
        const values = [...inputObjects];
        const length = inputObjects.length;
        //se só tiver um elemento ele retorna pois não pode excluir
        if(length==1){
            return ;
        }
        values.splice(length-1, 1);
        setInputObjects(values);
        console.log(values);
    };

    const handleInputChangeObject = (event, index) => {
        console.log(event, index);
        const values = [...inputObjects];
        values[index].objectSelected = event.target.value;

        console.log(values);

        setInputObjects(values);
    };

    return (
       <div>

            <div style={{marginTop: "10px"}}>
                <TextField
                    id="filled-select-currency"
                    select
                    label="Selecione o área"
                    value={courseSelect}
                    onChange={onChangeCourse}
                    variant="outlined"
                    margin="dense"
                    style={{width: "100%"}}>
                    {courses.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.description}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <div style={{marginTop: "10px"}}>
                <TextField
                    id="filled-select-currency"
                    select
                    label="Selecione a competência"
                    value={skillSelect}
                    onChange={onChangeSkill}
                    variant="outlined"
                    margin="dense"
                    style={{width: "100%"}}>
                    {skills.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.description}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
           <div style={{marginTop: "20px"}}>
               { btAddObject == true ?
               <Button color="primary" onClick={handleAddObjects}>Adicionar Objeto</Button> :
                   <Button color="primary" disabled>Adicionar Objeto</Button>
               }
               {btRemoveObject == true ?
                   <Button className={clsx(classes.btRemove, className)} onClick={handleRemoveObjects}>Remover Objeto</Button> :
                   <Button className={clsx(classes.btRemove, className)} disabled>Remover Objeto</Button>
               }
           </div>
           {inputObjects.map((inputField, index) => (
                <div style={{marginTop: "10px"}}>
                        <TextField
                            id={"obj"+index}
                            select
                            label="Selecione o objeto de conhecimento"
                            value={inputObjects[index].objectSelected}
                            onChange={(event) => handleInputChangeObject(event, index)}
                            variant="outlined"
                            margin="dense"
                            style={{width: "100%"}}
                            name={'obj'+index}>
                            {objects.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.description}
                                </MenuItem>
                            ))}
                        </TextField>
                </div>
           ))}
       </div>

    );
}

QuestionCourse.propTypes = {
    className: PropTypes.string,
};

export default withRouter(QuestionCourse);
