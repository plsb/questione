import React from 'react';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
// import moment from 'moment';

// import api from "../../../../services/api";

import {
    Card,
    CardHeader,
    IconButton,
    Typography,
    CardContent,
    MenuItem,
    Menu,
    Tooltip,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import useStyles from './styles';

const StudendClassCard = props => {
    const { className, history, refresh, setRefresh, evaluation, setTabValue, ...rest } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // async function onDelete(){
    //     try {
    //         let url = 'evaluation/'+evaluation.id;
    //         const response = await api.delete(url);
    //         if (response.status === 202) {
    //             if(response.data.message){
    //                 toast.error(response.data.message);
    //             }
    //         } else {
    //             toast.success('Avaliação excluída.');
    //             setRefresh(refresh+1);
    //         }

    //         handleClose();
    //     } catch (error) {

    //     }
    //     setOpen(false);
    // }

    return (
        <Card
            {...rest}
            className={classes.root}>
                <CardHeader
                    className={classes.head}
                    action={
                        <div>
                            <Tooltip title="Opções da turma">
                                <IconButton
                                    aria-label="settings"
                                    onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                        </div>
                    }
                    title="Nome da turma"
                />

                <CardContent>
                    <Typography color="textSecondary" variant="h6">
                        {'As informações da turma vão aqui'}
                    </Typography>
                </CardContent>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => {}}>Opção 1</MenuItem>
                    <MenuItem onClick={() => {}}>Opção 2</MenuItem>
                </Menu>
                {/* <DialogQuestione
                    handleClose={onClickCloseDialog}
                    open={open}
                    onClickAgree={onDelete}
                    onClickDisagree={onClickCloseDialog}
                    mesage={'Deseja excluir a turma selecionada?'}
                    title={'Excluir Turma?'}
                /> */}
        </Card>
    );
};

StudendClassCard.propTypes = {
    className: PropTypes.string,
    evaluation: PropTypes.object,
    history: PropTypes.object,
    setRefresh: PropTypes.func,
    refresh: PropTypes.number
};

export default withRouter(StudendClassCard);
