import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';
import Tour from 'reactour';

import { Sidebar, Topbar, Footer } from './components';
import {login, TOKEN_KEY, updateShowTour} from "../../services/auth";
import api from "../../services/api";

const useStyles = makeStyles(theme => ({
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

    const [isTourOpen, setIsTourOpen] =
                useState(localStorage.getItem('@Questione-acess-show-tour') == 1);

    const classes = useStyles();
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

    useEffect(() => {

    }, []);

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

    </div>
    );
};

const stepsGeneral = [
    {
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
    }
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
            ' ser visualizadas na opção editar avaliação. Aqui também é possível cadastrar novas aplicações para avaliações. Uma mesma' +
            ' avaliação poderá ser aplicada várias vezes.',
    },
    {
        selector: '.applications-professor',
        content: 'Na opção Aplicações, você poderá editar e ativar aplicações de uma avaliação. Uma aplicação só poderá ser respondida pelos' +
            ' estudantes caso esteja Ativa. Você também poderá escolher opções para sua aplicação, como: se as questões da prova serão distribuída de forma' +
            ' randômica; se permite mostrar o gabarito para os estudantes após a finalização; configurar uma data e hora para iniciar a avaliação; ' +
            'e configurar a quantidade de horas de duração da avaliação.' +
            ' Aqui também é possível visualizar os resultados da aplicação por aluno, por questão,' +
            ' por competência e objeto de conhecimento.',
    },
    {
        selector: '.result-evaluations',
        content: 'Na opção Avaliações respondidas, você poderá visualizar o gabarito das avaliações que você respondeu. O conteúdo da questão' +
            ' não é apresentado.',
    },
    ...stepsGeneral,
];

const stepsStudent = [
    {
        selector: '.result-evaluations',
        content: 'Na opção Avaliações respondidas, você poderá visualizar o gabarito das avaliações que você respondeu. O conteúdo da questão' +
            ' não é apresentado.',
    },
    ...stepsGeneral,
];

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
