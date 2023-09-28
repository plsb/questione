import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Switch,
    FormControlLabel,
    Tooltip, Grid, Divider
} from "@material-ui/core";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import clsx from "clsx";
import { Editor } from "@tinymce/tinymce-react";
import api from "../../../../../services/api";
import Save from "@material-ui/icons/Save";
import { toast } from 'react-toastify';
import useStyles from "../../../../../style/style";

const useStylesLocal = makeStyles({
    root: {
        flexGrow: 1,
    },
    btRemove: {
        color: '#f44336',
        marginRight: 2,
    },
    btnRemoveWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
    }
});



const QuestionItens = props => {
    const { className, history, idQuestion, imageUploadHandler, question_validated, tabValueChange, ...rest } = props;
    const [inputItens, setInputItens] = useState([
        { idItem: 0, description: '', correct: 0 },
        { idItem: 0, description: '', correct: 0 }
    ]);
    const [btAddItem, setBtAddItem] = useState(false);
    const [btRemoveItem, setBtRemoveItem] = useState(false);
    const [itemDelete, setItensDelete] = useState([]);
    const timer = React.useRef();


    const classes = useStylesLocal();
    const classesGeneral = useStyles();

    useEffect(() => {
        const length = inputItens.length;
        if (length == 2) {
            setBtAddItem(true);
            setBtRemoveItem(false);
        } else if (length == 5) {
            setBtAddItem(false);
            setBtRemoveItem(true);
        } else {
            setBtAddItem(true);
            setBtRemoveItem(true);
        }

    }, [inputItens]);

    async function loadItens() {
        try {
            const response = await api.get('questionitem?fk_question_id=' + idQuestion);
            if (response.status === 200) {
                const values = [];
                if (response.data.length > 0) {
                    response.data.forEach(function logArrayElements(element, index, array) {
                        values.push({
                            idItem: response.data[index].id,
                            description: response.data[index].description,
                            correct: response.data[index].correct_item
                        });

                    });
                    setInputItens(values);
                }

            }
        } catch (error) {

        }
    }

    useEffect(() => {
        loadItens()
    }, []);

    useEffect(() => {
        if(question_validated == 0){
            verifyToSave();
        }
    }, [tabValueChange]);

    const handleAddItem = () => {
        const values = [...inputItens];
        const length = inputItens.length;
        //o máximo são três objetos de conhecimento
        if (length == 5) {
            return;
        }
        values.push({ idItem: 0, description: '', correct: 0 });
        setInputItens(values);

    };

    const handleRemoveItem = () => {
        const values = [...inputItens];
        const length = inputItens.length;
        //se só tiver um elemento ele retorna pois não pode excluir
        if (length == 2) {
            return;
        }
        const element = values[length - 1];
        if (element.idItem > 0) {
            itemDelete.push({ idItem: element.idItem })
        }
        values.splice(length - 1, 1);
        setInputItens(values);
    };

    const handleChangeCorrect = (event, indexCorrect) => {
        const values = [...inputItens];
        values[indexCorrect].correct = 1;
        values.forEach(function logArrayElements(element, index, array) {
            if (index == indexCorrect) {
            } else {
                values[index].correct = 0;
            }
        });
        setInputItens(values);
    }

    async function deleteItem(element) {
        try {
            const response = await api.delete('questionitem/' + element.idItem);
            if (response.status == 200 || response.status == 201) {

            } else {

            }
        } catch (error) {

        }
    }

    async function saveItem(elements) {
        try {
            //elements.forEach(async function logArrayElements(element, index, array) {
            for (var i = 0; i < elements.length; i++) {
                let element = elements[i];
                let response = {};
                const description = element.description;
                const fk_question_id = idQuestion;
                const correct_item = element.correct;

                const data = {
                    description, fk_question_id, correct_item
                }

                //return ;
                const id = element.idItem;
                let acao = "";

                if (id === 0) {
                    response = await api.post('questionitem', data);
                    acao = "cadastrada";
                } else {
                    response = await api.put('questionitem/' + id, data);
                    acao = "atualizada";
                }
                if (response.status == 200 || response.status == 201) {
                    inputItens[i].idItem = response.data.id;
                    if(i == 0){
                        toast.success('Alternativas da questão ' + acao + '.');
                    }

                } else {
                    toast.error( 'Erro ao inserir alternativa.');
                }
            }

        } catch (error) {

        }
    }

    const verifyToSave = () => {
        let correct = false;
        let text = true;

        inputItens.forEach(function logArrayElements(element, index, array) {
            if (inputItens[index].description === '') {
                text = false;
            }
            if (inputItens[index].correct === 1) {
                correct = true;
            }
        });
        //verifica se faltou alguma descrição
        if (text === false) {
            return 'Informe a descrição de todas as alternativas';;
        }
        //verifica se marcou algum item como correto
        if (correct === false) {
            return 'Informe a alternativa correta';
        }
        itemDelete.forEach(function logArrayElements(element, index, array) {
            deleteItem(element);
        });

        saveItem(inputItens, 0);
        return true;
    }

    const onClickItens = () => {
        let messageSaveItens = verifyToSave();
        if(messageSaveItens != true)
            toast.error(messageSaveItens);

    }

    const handleChangeItem = (e, indexEdit) => {
        const values = [...inputItens];
        values.forEach(function logArrayElements(element, index, array) {
            if (index == indexEdit) {
                values[index].description = e;
            }
        });
        setInputItens(values);
    }

    return (
        <div>
            {question_validated == 1 && <font style={{ padding: "15px" }} color="#FF0000">As alternativas não podem ser editadas (a questão foi habilitada).</font>}
            <div style={{ margin: "20px 0px", paddingLeft: '15px'}} >
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start">
                    <Tooltip title="A questão deverá ter no mínimo 02 e no máximo 05 alternativas, sendo apenas UMA correta.">
                        {btAddItem == true ?
                            <Button color="primary" size="small" disabled={question_validated == 1} onClick={handleAddItem}>Adicionar Alternativa</Button> :
                            <Button color="primary" size="small" disabled>Adicionar Alternativa</Button>
                        }
                    </Tooltip>
                    {/* <Tooltip title="A questão deverá ter no mínimo 02 e no máximo 05 alternativas, sendo apenas UMA correta.">
                       {btRemoveItem == true ?
                           <Button style={{marginLeft: "10px"}} className={clsx(classes.btRemove, className)} variant="outlined"  onClick={handleRemoveItem}>Remover Alternativa</Button> :
                           <Button style={{marginLeft: "10px"}} className={clsx(classes.btRemove, className)} variant="outlined"  disabled>Remover Alternativa</Button>
                       }
                   </Tooltip> */}
                </Grid>
            </div>
            {inputItens.map((inputField, index) => (
                <div style={{ padding: "15px" }}>
                    <div className={classes.btnRemoveWrapper}>
                        <b className={classesGeneral.paperTitleTextBold}>Alternativa de resposta {index + 1} *:</b>
                        {(index > 1 && inputItens.length === index + 1) && (
                            <Button style={{ marginLeft: "10px" }}
                                    className={clsx(classes.btRemove, className)}
                                    disabled={question_validated == 1}
                                    size="small" onClick={handleRemoveItem}>Remover alternativa</Button>
                        )}
                    </div>
                    <Editor
                        disabled={question_validated == 1}
                        key={"item" + index}
                        apiKey="ndvo85oqtt9mclsdb6g3jc5inqot9gxupxd0scnyypzakm18"
                        init={{
                            height: 150,
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
                                'insertfile undo redo | fontselect fontsizeselect | bold italic underline superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image table print preview FMathEditor  charmap'
                        }}
                        name={"item" + index}
                        value={inputItens[index].description}
                        onEditorChange={(e) => handleChangeItem(e, index)} />
                    <FormControlLabel
                        disabled={question_validated == 1}
                        className={classesGeneral.paperTitleText}
                        control={
                            <Tooltip title="Se marcado, indica que o item está correto">
                                <Switch
                                    id={'sw' + index}
                                    onChange={(event) => handleChangeCorrect(event, index)}
                                    checked={inputItens[index].correct}
                                    name={"checked" + index}
                                    color="primary"
                                    label
                                />
                            </Tooltip>
                        }
                        label="É correto?"
                    />

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
                    disabled={question_validated == 1}
                    color="primary"
                    variant="outlined"
                    className={classes.button}
                    onClick={onClickItens}>
                    Salvar alternativas
                </Button>

            </Grid>
        </div>

    );
}

QuestionItens.propTypes = {
    className: PropTypes.string,
    idQuestion: PropTypes.number,
    question_validated: PropTypes.number,
    indexTab: PropTypes.number,
};

export default withRouter(QuestionItens);
