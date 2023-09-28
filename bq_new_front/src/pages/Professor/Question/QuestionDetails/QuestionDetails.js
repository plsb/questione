import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    Box, Grid, IconButton, TextField, Typography,
    Button, Tooltip, Select, MenuItem, CardHeader, Divider, Card, CardContent, Breadcrumbs, Link
} from "@material-ui/core";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import QuestionItens from "./QuestionItens";
import { Editor } from '@tinymce/tinymce-react';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Save from "@material-ui/icons/Save";
import api from "../../../../services/api";
import QuestionSkill from "./QuestionSkill";
import QuestionKeywords from "./QuestionKeywords";
import useTypeOfEvaluations from '../../../../hooks/useTypeOfEvaluations';
import { EXTERNAL_QUESTION } from '../../../../services/auth';
import { toast } from 'react-toastify';
import clsx from "clsx";
import useStyles from "../../../../style/style";
import {CharmHome} from "../../../../icons/Icons";
import DecreaseStringSize from "../../../../components/DecreaseStringSize";
import TooltipQuestione from "../../../../components/TooltipQuestione";

const useStylesLocal = makeStyles({
  root: {
    flexGrow: 1,
  },
  selectGroup: {
    width: '100%',
    paddingLeft: '15px',
    display: 'flex',
  }
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}>
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    };
}

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const QuestionDetails = props => {
    const { className, history, ...rest } = props;
    const { idQuestion } = props.match.params;

    // lista de referencias (tipos de avaliação)
    const typeOfEvaluationList = useTypeOfEvaluations();

    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    const [value, setValue] = React.useState(0);
    //visibilidade das abas
    const [tabItens, setTabItens] = React.useState(false);
    const [tabSkill, setTabSkill] = React.useState(false);

    // controlador de abertua do select
    const [openReference, setReferenceOpen] = React.useState(false);
    const [openYear, setYearOpen] = React.useState(false);

    //campos
    const [baseText, setBaseText] = React.useState('');
    const [stem, setStem] = React.useState('');
    const [reference, setReference] = React.useState('select'); // type of evaluation
    const [year, setYear] = React.useState('year');
    const [difficulty, setDifficulty] = React.useState('select');
    const [yearList, setYearList] = React.useState([]);
    const [difficultyList, setDifficultyList] = React.useState([
        {id: 1, description: 'Muito fácil'},
        {id: 2, description: 'Fácil'},
        {id: 3, description: 'Médio'},
        {id: 4, description: 'Difícil'},
        {id: 5, description: 'Muito difícil'},]);
    const [validated, setValidated] = React.useState(0);

    //variável utilizada para informar para a aba alternativas e área de conhecimento a necessidade de salvar os dados
    const [tabValueChange, setTabValueChange] = React.useState(null);

    const timer = React.useRef();

    const handleChangeTab = (event, newValue) => {
        setTabValueChange(Date.now());

        timer.current = setTimeout(() => {
            setValue(newValue);
        }, 300);
    };

    const handleBack = () => {
        setTabValueChange(Date.now());
        timer.current = setTimeout(() => {
            history.push('/questions');
        }, 300);

    };

    async function imageUploadHandler (blobInfo, success, failure, progress) {
        try {
            let formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());

            if (blobInfo.blob().size > 150000) {
                failure('A imagem deve ter no máximo 150kb');
                return;
            }

            const response = await api.post('question/upload-image', formData);

            if(response.status === 200){
                success(response.data.url_image);
            } else if (response.status === 202) {
                failure('Ocorreu um erro ao realizar o upload');
            }
        } catch (error) {
            failure('Ocorreu um erro ao realizar o upload');
        }
    };

    async function saveQuestion(){
        try {
            const base_text = baseText;
            const data = {
                base_text,
                stem,
                year: year === 'year' ? yearList[0] : year,
            }

            if (reference !== 'select') {
                data.fk_type_of_evaluation_id = reference;
            }

            if (difficulty !== 'select') {
                data.initial_difficulty = difficulty;
            }

            let response = {};
            let acao = "";
            if(!idQuestion){
                response= await api.post('question', data);
                acao = "cadastrados";
            } else {
                response= await api.put('question/'+idQuestion, data);
                acao = "atualizados";
            }

            if(response.status === 200){
                toast.success( 'Texto base e enunciado '+acao+'.');
                history.push('/question-details/' + response.data[0].id);
            } else if (response.status === 202) {
                if(response.data.message){
                    toast.error( response.data.message);
                } else if(response.data.errors[0].description){
                    toast.error(response.data.errors[0].description);
                }
            }
        } catch (error) {
        }
    }

    const verifyToSave = () => {
        if(baseText === ''){
            return 'Informe o texto base.';
        } else if(stem === ''){
            return 'Informe o enunciado.';
        }
        saveQuestion();
        return true;
    }

    const onClickTab1 = () => {
        let messageSaveItens = verifyToSave();
        if(messageSaveItens != true)
            toast.error(messageSaveItens);

    }

    // const loadEvaluationTypes = useCallback(async () => {
    //     try {

    //     } catch (error) {

    //     }
    // });

    async function findAQuestion(id){
        try {
            const response = await api.get('question/show/'+id);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error( response.data.message);
                }
            } else {
                setValidated(response.data[0].validated)
                setReference(response.data[0].fk_type_of_evaluation_id);
                setBaseText(response.data[0].base_text);
                setYear(response.data[0].year);
                setStem(response.data[0].stem);
                setDifficulty(response.data[0].initial_difficulty);
            }
        } catch (error) {

        }
    }

    const getYearList = useCallback(() => {
        const currentYear = parseInt(new Date().getFullYear());
        const yearList = [];

        for (let i = currentYear; i > currentYear - 52; i -= 1) {
            yearList.push(i);
        }

        setYearList(yearList);
    });

    useEffect(() => {
        if(idQuestion){
            findAQuestion(idQuestion);
        }

        getYearList();
    }, []);

    useEffect(() => {
        if(validated == 1){
            setValue(2);
        }
    }, [validated]);

    useEffect(() => {

    }, [tabItens, value]);

    useEffect(() => {
        if((value == 0) && validated == 0){
            verifyToSave();
        }
    }, [tabValueChange]);

    const handleChangeReference = (event) =>{
        setReference(event.target.value);
    }

    const handleChangeBaseText = (event) => {
        setBaseText(event);
    };

    const handleChangeStem = (event) => {
        setStem(event);
    };

    // const handleChangeReference = (event) => {
    //     setReference(event.target.value);
    // };

    const handleReferenceClose = () => {
        setReferenceOpen(false);
    };

    const handleReferenceOpen = () => {
        setReferenceOpen(true);
    };

    const handleChangeYear = (event) => {
        setYear(event.target.value);
    };

    const handleChangeDifficulty = (event) => {
        setDifficulty(event.target.value);
    };

    const handleYearClose = () => {
        setYearOpen(false);
    };

    const handleYearOpen = () => {
        setYearOpen(true);
    };

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
                  <Link color="inherit" onClick={() => history.push('/questions')}>
                      {'Questões'}
                  </Link>
                  <div>
                      {idQuestion ? 'Editar questão de código '+idQuestion : 'Nova questão'}
                  </div>
              </Breadcrumbs>
          </Box>
          <Card
              {...rest}
              className={clsx(classes.root, className)}>
              <CardHeader
                  subheader={
                  <div className={classesGeneral.subtitleList}>{idQuestion ? 'Editar questão' : 'Nova questão'}</div>}
                  title={
                  <div className={classesGeneral.titleList}>{'Questão'}</div>}/>
              <Divider />

              <CardContent>
                  <Tabs
                      variant="fullWidth"
                      value={value}
                      onChange={handleChangeTab}
                      aria-label="nav tabs example">
                      <LinkTab label={<DecreaseStringSize string={"Texto base & Enunciado"} large={0.5}/>} href="/drafts" {...a11yProps(0)} />
                      { idQuestion ?
                          <LinkTab label="Alternativas" href="#" {...a11yProps(1)} />
                          : null }

                      {/* validated == 1 ?
                            <LinkTab label="Alternativas" disabled href="#"  {...a11yProps(1)} />
                                : tabItens == true ?
                                      <LinkTab label="Alternativas" href="#"  {...a11yProps(1)} />
                                            : null  */}

                      { idQuestion ?
                          <LinkTab label={<DecreaseStringSize string={"Área de Conhecimento"} large={0.4}/>} href="#" {...a11yProps(2)} />
                                :  null }
                      {/* tabSkill==true ?
                          <LinkTab label="Palavras-chave" href="#" {...a11yProps(3)} />
                          :  null */}
                  </Tabs>
                  {/*texto base e enunciado*/}
                  <TabPanel value={value} index={0}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center">
                            {
                                localStorage.getItem(EXTERNAL_QUESTION) == 1 && (
                                <>
                                    <div className={classes.selectGroup}>
                                        <TooltipQuestione description={"Caso a questão tenha sido construída baseada em alguma já aplicada, você pode selecionar no campo tipo de avaliação."} position={'bottom'} content={

                                            <TextField
                                                id="type-of-evaluation"
                                                select
                                                label="Tipo de Avaliação"
                                                value={reference}
                                                onChange={handleChangeReference}
                                                helperText="Selecione o tipo de avaliação."
                                                variant="outlined"
                                                margin="dense"
                                                style={{width: '200px'}}>
                                                <MenuItem value="select">Selecione</MenuItem>
                                                {typeOfEvaluationList && typeOfEvaluationList.map((type) => (
                                                    <MenuItem value={type.id}>{type.description}</MenuItem>
                                                ))}
                                            </TextField>

                                        }/>
                                        <div style={{paddingLeft: '10px'}}>
                                            <TooltipQuestione description={"Caso a questão tenha sido construída baseada em alguma já aplicada, você pode selecionar o ano da questão."} position={'bottom'} content={
                                                <TextField
                                                    id="year"
                                                    select
                                                    label="Ano"
                                                    value={year}
                                                    onChange={handleChangeYear}
                                                    helperText="Selecione o ano da questão."
                                                    variant="outlined"
                                                    margin="dense"
                                                    style={{width: '150px'}}>
                                                    <MenuItem value="year">Selecione</MenuItem>
                                                    {yearList && yearList.map((year) => (
                                                        <MenuItem value={year}>{year}</MenuItem>
                                                    ))}
                                                </TextField>
                                            }/>
                                        </div>
                                    </div>
                                    <div className={classes.selectGroup}>
                                            <TextField
                                                id="difficulty"
                                                select
                                                label="Dificuldade"
                                                value={difficulty}
                                                onChange={handleChangeDifficulty}
                                                helperText="Selecione a dificuldade da questão."
                                                variant="outlined"
                                                margin="dense"
                                                style={{width: '200'}}>
                                                <MenuItem value="select">Selecione</MenuItem>
                                                {difficultyList && difficultyList.map((item) => (
                                                    <MenuItem value={item.id}>{item.description}</MenuItem>
                                                ))}
                                            </TextField>

                                    </div>
                                </>
                            )}
                      </Grid>
                      <div style={{padding: "15px"}}>
                          <b className={classesGeneral.paperTitleTextBold}>Texto base *</b>
                              <Editor
                                  disabled={validated == 1}
                                  apiKey="viwc1vmqpf6f7ozb7m90ayace892e32hsg99bhpo06p6bz3d"
                                  init={{
                                      height: 200,
                                      menubar: false,
                                      file_picker_types: 'image',
                                      images_upload_url: 'postAcceptor.php',
                                      images_upload_handler: imageUploadHandler,
                                      automatic_uploads: true,
                                      plugins: [
                                          'textpattern advlist autolink lists link image charmap print',
                                          ' preview hr anchor pagebreak code media save',
                                          'table contextmenu charmap'
                                      ],
                                      toolbar:
                                          'insertfile undo redo | fontselect fontsizeselect | bold italic underline superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image table print preview  charmap'
                                  }}
                                  value={baseText}
                                  onEditorChange={handleChangeBaseText}
                                  name="base_text"
                                  key="base_text"/>
                          {validated == 1 && <font color="#FF0000">Texto base não pode ser editado (a questão foi habilitada).</font>}
                      </div>
                      <div style={{padding: "15px"}}>
                          <b className={classesGeneral.paperTitleTextBold}>Enunciado *</b>
                          <Editor
                              disabled={validated == 1}
                              apiKey="ndvo85oqtt9mclsdb6g3jc5inqot9gxupxd0scnyypzakm18"
                              init={{
                                  height: 200,
                                  menubar: false,
                                  file_picker_types: 'image',
                                  images_upload_url: 'postAcceptor.php',
                                  images_upload_handler: imageUploadHandler,
                                  automatic_uploads: true,
                                  plugins: [
                                      'textpattern advlist autolink lists link image charmap print',
                                      ' preview hr anchor pagebreak code media save',
                                      'table contextmenu charmap'
                                  ],
                                  toolbar:
                                      'insertfile undo redo | fontselect fontsizeselect | bold italic underline superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image table print preview  charmap'
                              }}
                              value={stem}
                              onEditorChange={handleChangeStem}
                              name="stem"
                              key="stem"/>
                          {validated == 1 && <font color="#FF0000">Enunciado não pode ser editado (a questão foi habilitada).</font>}
                      </div>
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
                              onClick={onClickTab1}>
                              Salvar texto base
                          </Button>

                      </Grid>

                  </TabPanel>
                  {/* INTES */}
                  <TabPanel value={value} index={1}>
                        <QuestionItens idQuestion={idQuestion} question_validated={validated} tabValueChange={tabValueChange} imageUploadHandler={imageUploadHandler} />

                  </TabPanel>
                  {/* CURSO E COMPETÊNCIA*/}
                  <TabPanel value={value} index={2}>
                    <QuestionSkill idQuestion={idQuestion} tabValueChange={tabValueChange}/>

                  </TabPanel>
                  {/* PALAVRAS-CHAVE*/}
                  <TabPanel value={value} index={3}>
                        <QuestionKeywords idQuestion={idQuestion}/>

                  </TabPanel>
              </CardContent>
          </Card>
      </div>
  );
}

QuestionDetails.propTypes = {
    className: PropTypes.string,
};

export default withRouter(QuestionDetails);
