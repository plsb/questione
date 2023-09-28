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
    MenuItem, Typography, FormControlLabel, Switch, Tooltip, Box, Breadcrumbs, Link
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {withStyles} from "@material-ui/core/styles";
import useStylesLocal from "./styles";
import useStyles from "../../../../style/style";
import {CharmHome} from "../../../../icons/Icons";

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

const TooltipCustomized = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

const StudentClassDetails = props => {
    const { className, history, ...rest } = props;
    const { studentClassId } = props.match.params;

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
    });

    const [courseList, setCourseList] = useState([]);
    const [courseSelectIsOpen, setCourseSelectIsOpen] = useState(false);
    const [checkedGamified, setCheckedGamified] = React.useState(false);

    const handleChangeGamified = event => {
        setCheckedGamified(event.target.checked);
    }
    
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
                gamified_class: checkedGamified,
            }

            let response = {};
            let acao = "";

            if (!studentClassId) {
                response = await api.post('class/professor', data);
                acao = "cadastrada";
            } else {
                response = await api.put('class/professor/' + studentClassId, data);
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
                history.push('/student-class/professor');
            }
        } catch (error) {

        }
    }

    async function showStudentClass() {
        try {
            const response = await api.get('class/professor/show/' + studentClassId);

            if (response.status === 202) {
                if (response.data.message) {
                    toast.error(response.data.message);
                }
            } else {
                setFormState(formState => ({
                    values: {
                        'description': response.data.description,
                        'course': response.data.course.id,
                    },
                    touched: {
                        ...formState.touched,
                    }
                }));
                setCheckedGamified(response.data.gamified_class);
            }
        } catch (error) {

        }
    }

    async function getCourses() {
        try {
          const response = await api.get(`/class/professor/courses`);
          if (response) {
            setCourseList(response.data);
          }
        } catch (error) {
          setCourseList([]);
        }
    }

    const handleChange = event => {
        let valores = {};

        setFormState({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.value,
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
        <div className={classesGeneral.root}>
            <Box display="flex">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/">
                        <Box display="flex">
                            <Box style={{marginTop: '2px', marginRight: '5px'}}>
                                <CharmHome/>
                            </Box>
                            <Box>
                                Início
                            </Box>
                        </Box>
                    </Link>
                    <Link color="inherit" onClick={() => history.goBack()}>
                        {localStorage.getItem('@Questione-acess-level-user') === "2" ? 'Turmas' : 'Minhas turmas'}
                    </Link>
                    <div color="inherit">
                        {studentClassId ? 'Editar turma' : 'Nova turma'}
                    </div>
                </Breadcrumbs>
            </Box>
            <Card
                {...rest}
                className={clsx(classes.root, className)}>
                <form
                    autoComplete="off">

                    <CardHeader
                        subheader={<div className={classesGeneral.subtitleList}>{studentClassId ? 'Editar turma' : 'Nova turma'}</div>}
                        title={<div className={classesGeneral.titleList}>{'Turma'}</div>}
                    />
                    <Divider />
                    <CardContent>
                        <Grid
                            container
                            spacing={1}>
                            <Grid
                                item
                                md={12}
                                xs={12}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                    {/* GET  */}
                                    {/* No body do request o attr vai ser  */}

                                    <TextField
                                        fullWidth
                                        error={hasError('course')}
                                        helperText={
                                            hasError('course') ? formState.errors.course[0] : null
                                        }
                                        label="Curso"
                                        margin="dense"
                                        name="course"
                                        onChange={handleChange}
                                        select
                                        // eslint-disable-next-line react/jsx-sort-props
                                        value={formState.values.course || 'select'}
                                        variant="outlined">
                                        <MenuItem value="select">Selecione o curso</MenuItem>
                                        {courseList.map((course) => (
                                            <MenuItem key={course.id} value={course.id}>{course.description}</MenuItem>
                                        ))}
                                    </TextField>

                                    {/*<Select
                                        label="course-label"
                                        id="course"
                                        name="course"
                                        open={courseSelectIsOpen}
                                        onClose={handleCourseSelectClose}
                                        onOpen={handleCourseSelectOpen}
                                        value={formState.values.course || 'select'}
                                        onChange={handleChange}
                                        className={classes.root}
                                        variant="outlined"
                                        margin="dense"
                                        style={{ width: '400px' }}
                                        error={hasError('course')}
                                        helperText={
                                            hasError('course') ? formState.errors.course[0] : null
                                        }>
                                        <MenuItem value="select">Selecione</MenuItem>
                                        {courseList.map((course) => (
                                            <MenuItem key={course.id} value={course.id}>{course.description}</MenuItem>
                                        ))}
                                    </Select>*/}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
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
                                        variant="outlined"/>
                                </div>

                                {/*<div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                    <TooltipCustomized
                                        title={
                                            <React.Fragment>
                                                <p>
                                                    <Typography color="textPrimary" variant="body2">
                                                        {'Caso esta opção esteja habilitada, será habilitado o módulo de ' +
                                                            ' gamificação para esta turma.'}
                                                    </Typography>
                                                </p>
                                            </React.Fragment>
                                        }>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={checkedGamified}
                                                    onChange={handleChangeGamified}
                                                    name="gamified_class"
                                                    color="primary"
                                                />
                                            }
                                            label="Turma gamificada"
                                        />
                                    </TooltipCustomized>
                                </div>*/}
                                <Divider /><br />
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        disabled={!formState.isValid}
                                        onClick={saveStudentClass}>
                                        Salvar
                                    </Button>
                                </Box>
                            </Grid>
                            <Divider />
                        </Grid>
                    </CardContent>
                    <Divider />
                </form>
            </Card>
        </div>
    );
};

StudentClassDetails.propTypes = {
    className: PropTypes.string,
};

export default StudentClassDetails;
