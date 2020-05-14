import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {MenuItem,
    TextField,
    ButtonGroup,
    Button,
    Switch,
    FormControlLabel,
    Tooltip} from "@material-ui/core";
import api from "../../../../../services/api";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import Swal from "sweetalert2";
import clsx from "clsx";
import {TinyMCE} from "../../../../../components";
import {Editor} from "@tinymce/tinymce-react";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    btRemove: {
        color: '#f44336',
        marginRight: 2
    }
});



const QuestionItens = props => {
    const { className, history, ...rest } = props;
    const [inputItens, setInputItens] = useState([
        { text: '', correct: false },
        { text: '', correct: false }
    ]);
    const [btAddItem, setBtAddItem] = useState(false);
    const [btRemoveItem, setBtRemoveItem] = useState(false);


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

    useEffect(() => {
        const length = inputItens.length;
        if(length == 2){
            setBtAddItem(true);
            setBtRemoveItem(false);
        } else if(length == 5){
            setBtAddItem(false);
            setBtRemoveItem(true);
        } else {
            setBtAddItem(true);
            setBtRemoveItem(true);
        }

    }, [inputItens]);

    useEffect(() => {

    }, []);

    const handleAddItem = () => {
        const values = [...inputItens];
        const length = inputItens.length;
        //o máximo são três objetos de conhecimento
        if(length == 5){
            return ;
        }
        values.push({ text: '', correct: 0 });
        setInputItens(values);
    };

    const handleRemoveItem = () => {
        const values = [...inputItens];
        const length = inputItens.length;
        //se só tiver um elemento ele retorna pois não pode excluir
        if(length==2){
            return ;
        }
        values.splice(length-1, 1);
        setInputItens(values);
    };

    const handleChangeCorrect = (event, indexCorrect) => {
        const values = [...inputItens];
        values[indexCorrect].correct = true;
        console.log(values);
        values.forEach(function logArrayElements(element, index, array) {
            if(index == indexCorrect){
                console.log("correct a[" + index + "] "+indexCorrect+"= " + event.target.valueOf());
            } else {
                values[index].correct = false;
                console.log("incorrect a[" + index + "] "+indexCorrect+"= " + event.target.valueOf());
            }

        });
        setInputItens(values);
    }


    return (
       <div>
           <div style={{marginTop: "20px"}}>
               { btAddItem == true ?
                   <Button color="primary" onClick={handleAddItem}>Adicionar Item</Button> :
                   <Button color="primary" disabled>Adicionar Item</Button>
               }
               {btRemoveItem == true ?
                   <Button className={clsx(classes.btRemove, className)} onClick={handleRemoveItem}>Remover Item</Button> :
                   <Button className={clsx(classes.btRemove, className)} disabled>Remover Item</Button>
               }
           </div>
           {inputItens.map((inputField, index) => (
               <div style={{padding: "30px"}}>
                   <b className="item1">Item {index+1}:</b>
                   <Editor
                       apiKey="ndvo85oqtt9mclsdb6g3jc5inqot9gxupxd0scnyypzakm18"
                       init={{
                           height: 150,
                           menubar: false,
                           file_picker_types: 'image',
                           images_upload_url: 'postAcceptor.php',
                           automatic_uploads: false,
                           plugins: [
                               'textpattern advlist autolink lists link image charmap print',
                               ' preview hr anchor pagebreak code media save',
                               'table contextmenu FMathEditor charmap'
                           ],
                           toolbar:
                               'insertfile undo redo | fontselect fontsizeselect | bold italic superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image table print preview FMathEditor  charmap'
                       }}
                       name={"item"+index}/>
                       <FormControlLabel
                           control={
                               <Tooltip title="Se marcado, indica que o item está correto">
                                   <Switch
                                       id={'sw'+index}
                                       onChange={(event) => handleChangeCorrect(event, index)}
                                       checked={inputItens[index].correct}
                                       name={"checked"+index}
                                       color="primary"
                                       label
                                   />
                               </Tooltip>
                           }
                           label="É correto?"
                       />

               </div>
           ))}
       </div>

    );
}

QuestionItens.propTypes = {
    className: PropTypes.string,
};

export default withRouter(QuestionItens);
