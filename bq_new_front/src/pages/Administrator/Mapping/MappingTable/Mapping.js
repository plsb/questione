import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent, Fab, Grid, TextField, Typography,
} from '@material-ui/core';
import {
  TreeView,
  TreeItem,
} from '@material-ui/lab';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import api from '../../../../services/api';
import { toast } from 'react-toastify';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {DialogQuestione} from "../../../../components";
import PropTypes from "prop-types";
import {REGULATION_MAPPING_SELECTED_1, REGULATION_MAPPING_SELECTED_2} from "../../../../services/auth";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  headTable: {
    fontWeight: "bold"
  },
  tree: {
    fontSize: 40
  },
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  buttonRemove:{
    backgroundColor: '#e57373',
    color: '#ffebee',
  },
}));

const Mapping = props => {
  const { className } = props;
  const history = useHistory();


  const classes = useStyles();
  const [regulations1, setRegulations1] = useState([{'id': '0', 'description': '- Escolha uma portaria -'}]);
  const [regulations2, setRegulations2] = useState([{'id': '0', 'description': '- Escolha uma portaria -'}]);

  const [regulationsSelected1, setRegulationsSelected1] = useState(0);
  const [regulationsObjectSelected1, setRegulationsObjectSelected1] = useState(0);
  const [knowledgeObjectSelected1, setKnowledgeObjectSelected1] = useState(0);

  const [regulationsSelected2, setRegulationsSelected2] = useState(0);
  const [regulationsObjectSelected2, setRegulationsObjectSelected2] = useState(0);
  const [knowledgeObjectSelected2, setKnowledgeObjectSelected2] = useState(0);

  const [open, setOpen] = React.useState(false);
  const [idRelatedDelete1, setIdRelatedDelete1] = React.useState(0);
  const [idRelatedDelete2, setIdRelatedDelete2] = React.useState(0);


  async function loadRegulations(){
    try {

      const response = await api.get('regulation/all');

      if (response.status == 200) {
        setRegulations1([...regulations1, ...response.data]);
        setRegulations2([...regulations2, ...response.data]);
      } else {
        setRegulations1([]);
        setRegulations2([]);
      }

    } catch (error) {

    }
  }

  async function loadRegulations1Id(id){
    try {

      const response = await api.get('regulation/show/'+id);

      if (response.status == 200) {

        setRegulationsObjectSelected1(response.data);
      }

    } catch (error) {

    }
  }

  async function loadRegulations2Id(id){
    try {

      const response = await api.get('regulation/show/'+id);


      if (response.status == 200) {
        setRegulationsObjectSelected2(response.data);
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    loadRegulations();

    let regulationMappingSelected_1 = localStorage.getItem(REGULATION_MAPPING_SELECTED_1);
    let regulationMappingSelected_2 = localStorage.getItem(REGULATION_MAPPING_SELECTED_2);
    if(regulationMappingSelected_1 != null) {
      setRegulationsSelected1(regulationMappingSelected_1);
      loadRegulations1Id(regulationMappingSelected_1);
    }
    if(regulationMappingSelected_2 != null) {
      setRegulationsSelected2(regulationMappingSelected_2);
      loadRegulations2Id(regulationMappingSelected_2);

    }


  }, []);

  const handleChangeRegulations1 = event => {
    let id = event.target.value;
    setRegulationsSelected1(id);
    loadRegulations1Id(id);
    localStorage.setItem(REGULATION_MAPPING_SELECTED_1, id);
  };

  const handleChangeRegulations2 = event => {
    let id = event.target.value;
    setRegulationsSelected2(id);
    loadRegulations2Id(id);
    localStorage.setItem(REGULATION_MAPPING_SELECTED_2, id);
  };

  const actionRegulationsSelected1 = (event, nodeId, key) => {
    setKnowledgeObjectSelected1(nodeId);
  };

  const actionRegulationsSelected2 = (event, nodeId, key) => {
    setKnowledgeObjectSelected2(nodeId);
  };

  function suggestionsObjects(){
    history.push('/object-suggestion');
  }

  async function saveObjects(){

    try {
      const fk_obj1_id = knowledgeObjectSelected1;
      const fk_obj2_id = knowledgeObjectSelected2;

      const data = {
        fk_obj1_id, fk_obj2_id
      }
      let response= {};
      let acao = "";

      response = await api.post('object/relate', data);
      acao = "cadastrado";

      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        } else if(response.data.errors[0].description){
          toast.error(response.data.errors[0].description);
        } if(response.data.errors[0].fk_regulation_id){
          toast.error(response.data.errors[0].fk_regulation_id);
        }
      } else if (response.status === 200) {
        toast.success('Relação de conteúdo '+acao+'.');
        //window.location.reload();
        loadRegulations1Id(regulationsSelected1);
        loadRegulations2Id(regulationsSelected2);
      }

    } catch (error) {

    }

  }

  async function onDeleteObjectRelated(){
    try {
      let url = 'object/relate/'+idRelatedDelete1+'?fk_obj2_id='+idRelatedDelete2;

      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          toast.error(response.data.message);
        }
      } else {
        toast.success('Relação excluída.');
        //window.location.reload();
        loadRegulations1Id(regulationsSelected1);
        loadRegulations2Id(regulationsSelected2);
        setOpen(false);
      }
    } catch (error) {

    }
  }

  const onClickOpenDialog = (id1, id2) => {
    setIdRelatedDelete1(id1);
    setIdRelatedDelete2(id2);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdRelatedDelete1(0);
    setIdRelatedDelete2(0);
  }


  return (
    <div>
      <div className={classes.root}>
        <Card
            className={clsx(classes.root, className)}>
          <CardContent>
            <div className={classes.content}>
              <Grid container spacing={10}>
                <Grid container item xs={6} spacing={3}>
                  <TextField
                      fullWidth
                      label=""
                      margin="dense"
                      name="regulationsSelected1"
                      onChange={handleChangeRegulations1}
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}
                      value={regulationsSelected1}
                      variant="outlined">
                    {regulations1 && regulations1.map(regulation => (
                        <option
                            key={regulation.id}
                            value={regulation.id}>
                          {regulation.course ? regulation.description+" de "+regulation.year+" | "+ regulation.course
                              : regulation.description}
                        </option>
                    ))}
                  </TextField>

                  { regulationsObjectSelected1 ?
                      <TreeView
                          className={classes.root}
                          defaultCollapseIcon={<ExpandMoreIcon />}
                          defaultExpandIcon={<ChevronRightIcon />}
                          onNodeSelect={actionRegulationsSelected1}>
                          <TreeItem nodeId='regulation1' label={regulationsObjectSelected1 &&
                              regulationsObjectSelected1.description+" de "+regulationsObjectSelected1.year}>

                            {regulationsObjectSelected1.knowledge_object.map(knowledge_object => (
                                <TreeItem key={String(knowledge_object.id)} nodeId={knowledge_object.id} label={knowledge_object.description}>

                                  {knowledge_object.related && knowledge_object.related.map(related =>(
                                      <TreeItem key={String(related.id)}
                                                nodeId={'related'+related.id}
                                                label={
                                                  <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ marginLeft: '5px'}}>
                                                      {related.description+' ('+related.course.description+' de '+related.regulation.year+')'}
                                                    </Typography>
                                                    <Button className={clsx(classes.buttonRemove, className)}
                                                            onClick={() => onClickOpenDialog(knowledge_object.id, related.id)}>
                                                      <DeleteForeverIcon />
                                                    </Button>

                                                  </Box>
                                                }
                                      />
                                  ))}


                                </TreeItem>
                            ))}
                          </TreeItem>

                      </TreeView>
                      : null }

                </Grid>
                <Grid container item xs={6} spacing={3}>
                  <TextField
                      fullWidth
                      label=""
                      margin="dense"
                      name="regulationsSelected2"
                      onChange={handleChangeRegulations2}
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}
                      value={regulationsSelected2}
                      variant="outlined">
                    {regulations2 && regulations2.map(regulation => (
                        <option
                            key={regulation.id}
                            value={regulation.id}>
                          {regulation.course ? regulation.description+" de "+regulation.year+" | "+ regulation.course
                              : regulation.description}
                        </option>
                    ))}
                  </TextField>

                  { regulationsObjectSelected2 ?
                      <TreeView
                          className={classes.root}
                          defaultCollapseIcon={<ExpandMoreIcon />}
                          defaultExpandIcon={<ChevronRightIcon />}
                          onNodeSelect={actionRegulationsSelected2}>
                        <TreeItem nodeId='regulation2' label={regulationsObjectSelected2 &&
                            regulationsObjectSelected2.description+" de "+regulationsObjectSelected2.year}>

                          {regulationsObjectSelected2.knowledge_object.map(knowledge_object => (
                              <TreeItem className={classes.tree} key={String(knowledge_object.id)} nodeId={knowledge_object.id} label={knowledge_object.description}>

                                {knowledge_object.related && knowledge_object.related.map(related =>(
                                        <TreeItem key={String(related.id)}
                                                  nodeId={'related'+related.id}
                                                  label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                                      <Typography
                                                          variant="body2"
                                                          sx={{ marginLeft: '5px'}}>
                                                        {related.regulation ? related.description+' ('+related.course.description+' de '+related.regulation.year+')'
                                                            : related.description+' ('+related.course.description+')'}
                                                      </Typography>
                                                      <Button className={clsx(classes.buttonRemove, className)}
                                                              onClick={() => onClickOpenDialog(knowledge_object.id, related.id)}>
                                                        <DeleteForeverIcon />
                                                      </Button>

                                                    </Box>
                                                  }
                                        />
                                ))}



                              </TreeItem>
                          ))}
                        </TreeItem>

                      </TreeView>
                      : null }

                </Grid>

              </Grid>

            </div>

          </CardContent>
          <CardActions>
            <Button
                color="primary"
                variant="outlined"
                onClick={saveObjects}
                disabled={false} >
              Salvar
            </Button>
            <Button
                color="primary"
                variant="text"
                onClick={suggestionsObjects}
                disabled={false} >
              Lista de sugestões
            </Button>
          </CardActions>

        </Card>
        <DialogQuestione handleClose={onClickCloseDialog}
                         open={open}
                         onClickAgree={onDeleteObjectRelated}
                         onClickDisagree={onClickCloseDialog}
                         mesage={'Deseja excluir relação de conteúdos?'}
                         title={'Excluir Conteúdos Relacionados'}/>

    </div>
    </div>
  );
};

Mapping.propTypes = {
  history: PropTypes.object
};

export default Mapping;
