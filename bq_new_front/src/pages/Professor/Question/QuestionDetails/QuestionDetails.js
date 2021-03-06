import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    Box, Grid, IconButton, TextField, Typography,
    Button, Tooltip
} from "@material-ui/core";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import QuestionItens from "./QuestionItens";
import { Editor } from '@tinymce/tinymce-react';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Save from "@material-ui/icons/Save";
import api from "../../../../services/api";
import Swal from "sweetalert2";
import QuestionSkill from "./QuestionSkill";
import QuestionKeywords from "./QuestionKeywords";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
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

    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    //visibilidade das abas
    const [tabItens, setTabItens] = React.useState(false);
    const [tabSkill, setTabSkill] = React.useState(false);
    //campos
    const [baseText, setBaseText] = React.useState('');
    const [stem, setStem] = React.useState('');
    const [reference, setReference] = React.useState('');
    const [validated, setValidated] = React.useState(0);
    //utilizado pra quando for nova questão
    const [idQuestionNew, setIdQuestionNew] = React.useState(0);

    const timer = React.useRef();

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

  const handleChangeTab = (event, newValue) => {
      timer.current = setTimeout(() => {
          setValue(newValue);
      }, 400);

  };

    const handleBack = () => {
        history.goBack();
    };

    async function saveQuestion(){
        try {
            const base_text = baseText;
            const data = {
                base_text, stem, reference
            }
            let response = {};
            let acao = "";
            if(!idQuestion){
                response= await api.post('question', data);
                acao = "cadastrada";
            } else {
                response= await api.put('question/'+idQuestion, data);
                acao = "atualizada";
            }

            if(response.status === 200){
                loadAlert('success', 'Questão '+acao+'.');
                setIdQuestionNew(response.data[0].id);
            } else if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                } else if(response.data.errors[0].description){
                    loadAlert('error', response.data.errors[0].description);
                }
            }
        } catch (error) {
        }
    }

    const onClickTab1 = () => {
        if(baseText === ''){
            loadAlert('error', 'Informe o texto base.');
            return ;
        } else if(stem === ''){
            loadAlert('error', 'Informe o enunciado.');
            return ;
        }
        saveQuestion();
        if(idQuestion){

        } else {
            timer.current = setTimeout(() => {
                history.push('/questions');
            }, 500);
        }

    }

    async function findAQuestion(id){
        try {
            const response = await api.get('question/show/'+id);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else {
                setValidated(response.data[0].validated)
                setReference(response.data[0].reference);
                setBaseText(response.data[0].base_text);
                setStem(response.data[0].stem);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        if(idQuestion){
            findAQuestion(idQuestion);
            setTabItens(true);
            setTabSkill(true);
        }
    }, []);

    useEffect(() => {
        if(validated == 1){
            setValue(2);
        }
    }, [validated]);

    useEffect(() => {

    }, [tabItens, value, idQuestionNew]);

    const handleChangeReference = (event) =>{
        setReference(event.target.value);
    }

    const handleChangeBaseText = (event) => {
        setBaseText(event);
    };

    const handleChangeStem = (event) => {
        setStem(event);
    };

  return (
      <Paper className={classes.root}>
          <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                  <ArrowBackIcon />
              </IconButton>
          </div>
          <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChangeTab}
              aria-label="nav tabs example">
              { validated != 1 ?
              <LinkTab label="Texto base & Enunciado" href="/drafts" {...a11yProps(0)} />
                : <LinkTab label="Texto base & Enunciado" disabled href="/drafts" {...a11yProps(0)} />
              }
              { validated == 1 ?
                  <LinkTab label="Alternativas" disabled href="#"  {...a11yProps(1)} />
                  : tabItens == true ?
                      <LinkTab label="Alternativas" href="#"  {...a11yProps(1)} />
                           : null  }
              { tabSkill==true ?
              <LinkTab label="Área de Conhecimento" href="#" {...a11yProps(2)} />
                    :  null }
              { tabSkill==true ?
                  <LinkTab label="Palavras-chave" href="#" {...a11yProps(3)} />
                  :  null }
          </Tabs>
          {/*texto base e enunciado*/}
          <TabPanel value={value} index={0}>
              <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center">
                  <Tooltip title="Caso a questão tenha sido construída baseada em alguma já aplicada, você pode informar no campo referência. Ex: ENADE 2020, ENEM 2020, etc.">
                      <TextField
                          key="reference"
                          fullWidth
                          label="Referência"
                          margin="dense"
                          name="reference"
                          variant="outlined"
                          value={reference}
                          onChange={handleChangeReference}
                          style={{width: '90%', justifyContent: 'center'}}
                      />
                  </Tooltip>
              </Grid>
              <div style={{padding: "30px"}}>
                  <b className="item1">Texto base</b>
                      <Editor
                          apiKey="viwc1vmqpf6f7ozb7m90ayace892e32hsg99bhpo06p6bz3d"
                          init={{
                              height: 200,
                              menubar: false,
                              file_picker_types: 'image',
                              images_upload_url: 'postAcceptor.php',
                              automatic_uploads: false,
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
              </div>
              <div style={{padding: "30px"}}>
                  <b className="item1">Enunciado</b>
                  <Editor
                      apiKey="ndvo85oqtt9mclsdb6g3jc5inqot9gxupxd0scnyypzakm18"
                      init={{
                          height: 200,
                          menubar: false,
                          file_picker_types: 'image',
                          images_upload_url: 'postAcceptor.php',
                          automatic_uploads: false,
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
                          endIcon={<Save/>}
                            onClick={onClickTab1}>
                          Salvar
                      </Button>
              </Grid>

          </TabPanel>
          {/* INTES */}
          <TabPanel value={value} index={1}>
                <QuestionItens idQuestion={idQuestion}/>

          </TabPanel>
          {/* CURSO E COMPETÊNCIA*/}
          <TabPanel value={value} index={2}>
            <QuestionSkill idQuestion={idQuestion}/>

          </TabPanel>
          {/* PALAVRAS-CHAVE*/}
          <TabPanel value={value} index={3}>
                <QuestionKeywords idQuestion={idQuestion}/>

          </TabPanel>

      </Paper>
  );
}

QuestionDetails.propTypes = {
    className: PropTypes.string,
};

export default withRouter(QuestionDetails);
