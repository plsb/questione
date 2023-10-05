import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery
} from '@material-ui/core';
import Tour from 'reactour';

import { Sidebar, Topbar, Footer } from './components';
import {login, TOKEN_KEY, updateShowTour} from "../../services/auth";
import api from "../../services/api";
import Pusher from "pusher-js";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import useStyles from "../../style/style";
import {toast} from "react-toastify";
import {Alert} from "reactstrap";
import {callback} from "chart.js/helpers";

const useStylesLocal = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%',
  }
}));

const Main = props => {
    const { children } = props;

    const classesGeneral = useStyles();

    var pusher = new Pusher('316c686785e75771d79c', {
        cluster: 'sa1'
    });
    const [openDialog, setOpenDialog] = React.useState(null);
    const [messages, setMessages] = React.useState([]);

    const [isTourOpen, setIsTourOpen] =
                useState(localStorage.getItem('@Questione-acess-show-tour') == 1);

    const classes = useStylesLocal();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
    });

    const [openSidebar, setOpenSidebar] = useState(false);

    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setMessages([]);
    };

    useEffect(() => {
        var channel = pusher.subscribe('my-channel');
        setMessages([]);
        let array = [];
        channel.bind('my-event', function(data, i) {
            if (data.message.fk_user_id == localStorage.getItem("@Questione-id-user")) {
                array.push(data.message);

            }
        });
        const minhaPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                setMessages(array);
            }, 10000);
        });

    }, []);

    useEffect(() => {
        if(messages.length > 0)
            setOpenDialog(true);
    }, [messages]);


    const shouldOpenSidebar = isDesktop ? true : openSidebar;

    async function setShowTourFalseAPI() {
        try {
            const response = await api.post('all/set-show-tour-false');

        } catch (error) {

        }
    }

    const closeTour = () => {
        setIsTourOpen(false);
        if(localStorage.getItem('@Questione-acess-show-tour') == 1){
            setShowTourFalseAPI();
        }
        updateShowTour(0);
    }

    const openTour = () => {
        setIsTourOpen(true);
    }

    return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}>
        <Tour
            steps={ localStorage.getItem("@Questione-acess-level-user") == 2 ? stepsProfessor :
                        localStorage.getItem("@Questione-acess-level-user") == 0 ? stepsStudent : null}
            isOpen={isTourOpen}
            onRequestClose={closeTour} />
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
        openTour={openTour}
      />
      <main className={classes.content}>
        {children}
      </main>
      <Footer />

        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {<div className={classesGeneral.titleDialog}>
                    {"Bravo, Emblema(s) Novinho(s) em Folha! 🌟 " +
                        "Seu empenho está rendendo resultados incríveis. " +
                        "Continue brilhando e colecionando emblemas na sua jornada no Questione!"}
                </div>}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">
                                    {<div className={classesGeneral.paperTitleText}>
                                        Nova conquista
                                    </div>}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages && messages.length>0 ?
                                messages.map((badge, i) => (
                                    <TableRow key={1}>
                                        <TableCell align="left">
                                            <Box display={'flex'}>
                                                <div className={classesGeneral.messageDialog} style={{color: '#3a7cf7', fontWeight: 'bold', fontSize: '18px', marginTop: '8px', marginRight: '5px'}}>
                                                    {1+'x '}
                                                </div>
                                                <div>
                                                    <img
                                                        src={badge.badges_settings.image ? "/images/medals/"+badge.badges_settings.image : "/images/404.png"}
                                                        style={{marginRight: '5px', width:'40px'}}/>
                                                </div>
                                                <div className={classesGeneral.messageDialog} style={{marginTop: '8px', marginLeft: '5px'}}>
                                                    {'('+badge.badges_settings.description+')'}
                                                </div>
                                                <div className={classesGeneral.messageDialog} style={{marginTop: '8px', marginLeft: '5px'}}>
                                                    {'Na turma '+badge.class_questione.id_class+' - '+badge.class_questione.description}
                                                </div>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )) : null}

                        </TableBody>
                    </Table>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCloseDialog} color="primary" autoFocus>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>

    </div>
    );
};

const stepsGeneral = [
    /*{
        selector: '.practice',
        content: 'O módulo Pratique permite que o usuário gere avaliações por área e competência para testar seus conhecimentos.',
    },
    {
        selector: '.start-evaluation-card',
        content: 'Para responder uma avaliação é necessário que você informe o código da aplicação neste card fornecido por um professor.' +
            ' Uma aplicação só poderá ser respondida se ela estiver ativa e não estiver arquivada.',
    },
    {
        selector: '.total-question',
        content: 'Nest card é possível visualizar o total de questões cadastradas no sistema Questione.',
    },
    {
        selector: '.total-student',
        content: 'Nest card é possível visualizar o total de estudantes cadastrados no sistema Questione.',
    },
    {
        selector: '.total-professor',
        content: 'Nest card é possível visualizar o total de professores cadastrados no sistema Questione.',
    },
    {
        selector: '.total-evaluation',
        content: 'Nest card é possível visualizar o total de avaliações cadastradas no sistema Questione.',
    },
    {
        selector: '.leds',
        content: 'O projeto Laboratório de Engenharia e Desenvolvimento de Software - LEDS, é um projeto de cunho educacional ' +
            'que buscar fornecer um espaço para a prática e o aprendizado de engenharia de software e desenvolvimento de ' +
            'sistemas (web, desktop e mobile) para os alunos dos cursos de Bacharelado em Sistemas de Informação, ' +
            'Integrado de Informática e Tecnologia Mecatrônica Industrial. O LEDS funciona no Instituto Federal do Ceará - campus Cedro.',
    },
    {
        selector: '.gipea',
        content: 'O Grupo Interdisciplinar de Pesquisa em Ensino e Aprendizagem, atua nas linhas de pesquisa: Políticas, práticas ' +
            'institucionais, inclusão e aprendizagem de pessoas com necessidades especiais; Práticas de ensino e aprendizagem em Ciências e ' +
            'Matemática; Tecnologia da informação e comunicação; e Trabalho docente, formação de professores e políticas educacionais. O GIPEA ' +
            'possui suas atividades no Instituto Federal do Ceará - campus Cedro.',
    },
    {
        selector: '.update-profile',
        content: 'Ao clicar em atualização de perfil, você poderá alterar seu nome e caso seja professor de qualquer Institução ' +
            ' de ensino, poderá solicitar acesso ao banco de questões de um ou mais cursos. Para solicitar acesso aos cursos, basta enviar um comprovante' +
            ' que comprove que você é professor de um determinado curso.',
    },
    {
        selector: '.tour-questione',
        content: 'Clique aqui para rever o tour quantas vezes quiser.',
    },
    {
        selector: '.exit',
        content: 'Clique aqui para sair do sistema.',
    }*/
];


const stepsProfessor = [
    {
        selector: '.question-professor',
        content: 'Na opção Questões, você poderá inserir, editar, excluir, duplicar e classificar suas questões.' +
            ' Você também poderá buscar suas questões ou questões de outros usuários já validadas. A busca pode ser' +
            ' realizada por curso, competência, objetos de conhecimento ou palavra-chave. É através desta opção que você poderá' +
            ' escolher quais questões irão compor determinada avaliação. Você só poderá aplicar em uma avaliação, questões que já foram validadas. Depois ' +
            ' de validar uma questão, o sistema não irá mais permitir que você edite o texto-base, enunciado e alternativas.',
    },
    {
        selector: '.evaluation-professor',
        content: 'Na opção Avaliações, você poderá criar, arquivar ou excluir avaliações. Uma avaliação só poderá ser excluída caso não tenha' +
            ' nenhuma aplicação cadastrada. As questões só poderão ser adicionadas à avaliação pelo menu Questões. Mas as questões da avaliação podem' +
            ' ser visualizadas na opção Ver questões. Aqui também é possível cadastrar novas aplicações para avaliações no menu Novo Simulado. Uma mesma' +
            ' avaliação poderá ser aplicada várias vezes.'+
            ' Por meio do menu também é possível duplicar uma avalição e arquivar uma avaliação.',
    },
    /*{
        selector: '.applications-professor',
        content: 'Na opção Aplicações, você poderá editar e ativar aplicações de uma avaliação. Uma aplicação só poderá ser respondida pelos' +
            ' estudantes caso esteja Ativa. Você também poderá escolher opções para sua aplicação, como: se as questões da prova serão distribuída de forma' +
            ' randômica; se permite mostrar o gabarito para os estudantes após a finalização; configurar uma data e hora para iniciar a avaliação; ' +
            'e configurar a quantidade de horas de duração da avaliação.' +
            ' Aqui também é possível visualizar os resultados da aplicação por aluno, por questão,' +
            ' por competência e objeto de conhecimento.',
    },*/
    {
        selector: '.class-professor',
        content: 'Na opção Turmas, você poderá cadastrar novas turmas. Por meio do menu Acessar, o professor poderá visualizar os simulados, as pessoas' +
            ' inseridas na turma e os resultados dos simulados.',
    },
    ...stepsGeneral,
];

const stepsStudent = [
    {
        selector: '.class-student',
        content: 'Na opção Turmas, você poderá participar de uma turma e acessar as turmas as quais faz parte.' +
            ' Após acessar uma turma, você terá acesso aos simulados da turma, as pessoas inseridas na turma'+
        ' e resultados sobre os simulados presentes na turma.',
    },
    ...stepsGeneral,
];

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
