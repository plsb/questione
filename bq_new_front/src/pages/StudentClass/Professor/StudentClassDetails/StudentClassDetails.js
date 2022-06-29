import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import validate from "validate.js";

import api from "../../../../services/api";

import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Button,
    TextField,
    IconButton,
    Select,
    MenuItem
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import useStyles from './styles';

const schema = {
    description: {
        presence: { allowEmpty: false, message: 'A descrição é obrigatória.' },
        length: {
            minimum: 4,
            maximum: 300,
            message: 'A descrição deve conter no mínimo 4 e no máximo 300 caracteres.'
        }
    },
    course: {
        presence: { allowEmpty: false, message: 'Você deve selecionar o curso' },
    }
};

const StudentClassDetails = props => {
    const { className, history, ...rest } = props;
    const { studentClassId } = props.match.params;

    const classes = useStyles();

    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
    });

    const [courseList, setCourseList] = useState([]);
    const [courseSelectIsOpen, setCourseSelectIsOpen] = useState(false);
    
    const handleCourseSelectClose = () => {
        setCourseSelectIsOpen(false);
    };

    const handleCourseSelectOpen = () => {
        setCourseSelectIsOpen(true);
    };

    const handleBack = () => {
        history.goBack();
    };

    async function saveStudentClass() {
        try {
            const { description, course } = formState.values;
            const data = {
                description,
                fk_course_id: course,
            }

            let response = {};
            let acao = "";

            if (!studentClassId) {
                response = await api.post('class/', data);
                acao = "cadastrada";
            } else {
                response = await api.put('class/' + studentClassId, data);
                acao = "atualizada";
            }

            if (response.status === 202) {
                if (response.data.message) {
                    toast.error(response.data.message);
                } else if (response.data.errors[0].description) {
                    toast.error(response.data.errors[0].description);
                }
            } else {
                toast.success('Turma ' + acao + '.');
                history.push('/student-class');
            }
        } catch (error) {

        }
    }

    async function showStudentClass() {
        try {
            const response = await api.get('class/show/' + studentClassId);
            if (response.status === 202) {
                if (response.data.message) {
                    toast.error(response.data.message);
                }
            } else {
                setFormState(formState => ({
                    values: {
                        'description': response.data[0].description,
                        'course': response.data[0].course.id,
                    },
                    touched: {
                        ...formState.touched,
                    }
                }));
            }
        } catch (error) {

        }
    }

    async function getCourses() {
        try {
          const response = await api.get(`/class/courses`);
          if (response) {
            setCourseList(response.data);
          }
        } catch (error) {
          setCourseList([]);
        }
    }

    const handleChange = event => {
        setFormState({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.value
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true
            }
        });
    };

    const hasError = field =>
        formState.touched[field] && formState.errors[field] ? true : false;

    useEffect(() => {
        const errors = validate(formState.values, schema);
        setFormState(formState => ({
            ...formState,
            isValid: (errors || formState.values.course === 0) ? false : true,
            errors: errors || {}
        }));
    }, [formState.values]);

    useEffect(() => {
        getCourses();
        if (studentClassId) {
            showStudentClass(studentClassId);
        }
    }, [studentClassId]);

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}>
            <form
                autoComplete="off"
            >
                <div className={classes.contentHeader}>
                    <IconButton onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>

                <CardHeader
                    subheader="Descrição da página de cadastro/edição da turma"
                    title="Turma"
                />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={1}
                    >
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                <p className="item1" style={{ marginRight: '16px' }}>Curso</p>
                                {/* GET  */}
                                {/* No body do request o attr vai ser  */}

                                <Select
                                    labelId="course-label"
                                    id="course"
                                    name="course"
                                    open={courseSelectIsOpen}
                                    onClose={handleCourseSelectClose}
                                    onOpen={handleCourseSelectOpen}
                                    value={formState.values.course || 'select'}
                                    onChange={handleChange}
                                    className={classes.root}
                                    error={hasError('course')}
                                    helperText={
                                        hasError('course') ? formState.errors.course[0] : null
                                    }
                                >
                                    <MenuItem value="select">Selecione</MenuItem>
                                    {courseList.map((course) => (
                                        <MenuItem key={course.id} value={course.id}>{course.description}</MenuItem>
                                    ))}
                                </Select>
                            </div>

                            <TextField
                                fullWidth
                                error={hasError('description')}
                                helperText={
                                    hasError('description') ? formState.errors.description[0] : null
                                }
                                label="Descrição"
                                margin="dense"
                                name="description"
                                onChange={handleChange}
                                value={formState.values.description || ''}
                                variant="outlined"
                            />
                            <Button
                                color="primary"
                                variant="outlined"
                                disabled={!formState.isValid}
                                onClick={saveStudentClass}>
                                Salvar
                            </Button>
                        </Grid>
                        <Divider />
                    </Grid>
                </CardContent>
                <Divider />
            </form>
        </Card>
    );
};

StudentClassDetails.propTypes = {
    className: PropTypes.string,
};

export default StudentClassDetails;
