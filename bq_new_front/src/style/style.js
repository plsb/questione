import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),

    },
    content: {
        padding: 0,
        marginTop: theme.spacing(1)
    },
    row: {
        display: 'flex',
        alignItems: 'flex-start',
    },
    spacer: {
        flexGrow: 1
    },
    titleList: {
        fontWeight: 'bold',
        paddingTop: '16px',
        fontSize: '23px',
        fontFamily: 'Verdana',
        color: '#000000'
    },
    subtitleList: {
        paddingTop: '16px',
        fontSize: '15px',
        fontFamily: 'Verdana'
    },
    subtitles:{
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        fontSize: '14px',
        marginTop: '15px',
        marginBottom: '10px'
    },
    buttons: {
        fontFamily: 'Verdana'
    },
    paperTitle: {
        background: '#e1f5fe',
        padding: '10px'
    },
    paperTitleRed: {
        background: '#f44336',
        padding: '10px'
    },
    paperTitleGray: {
        background: '#e0e0e0',
        padding: '10px'
    },
    paperTitleSilver: {
        background: '#c0c0c0',
        padding: '10px'
    },
    paperTitleGold: {
        background: '#ffd700',
        padding: '10px'
    },
    paperTitleGreen: {
        background: '#c8e6c9',
        padding: '10px'
    },
    paperTitleText: {
        color: '#000000', fontFamily: 'Verdana', fontSize: '14px', marginTop: '4px'
    },
    paperTitleTextGreen: {
        color: '#00c853', fontFamily: 'Verdana', fontSize: '14px', marginTop: '4px', fontWeight: 'bold'
    },
    paperTitleTextBold: {
        color: '#000000', fontWeight: 'bold', fontFamily: 'Verdana', fontSize: '14px', marginTop: '4px'
    },
    paperSubtitle: {
        background: '#fafafa',
        padding: '15px'
    },
    itensMenu: {
        color: '#000000', fontFamily: 'Verdana', fontSize: '13px'
    },
    textRedInfo: {
        color: '#f44336', fontFamily: 'Verdana', fontSize: '14px'
    },
    textGreeInfo: {
        color: '#009688', fontFamily: 'Verdana', fontSize: '14px', marginTop: '4px', fontWeight: 'bold'
    },
    titleDialog: {
        color: '#000000', fontFamily: 'Verdana', fontSize: '16px', fontWeight: 'bold'
    },
    messageDialog: {
        color: '#000000', fontFamily: 'Verdana', fontSize: '15px'
    }


}));


export default useStyles;