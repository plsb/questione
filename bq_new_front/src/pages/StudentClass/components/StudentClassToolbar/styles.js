import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {},
    row: {
        height: '42px',
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '32px'
    },
    spacer: {
        flexGrow: 1
    },
    importButton: {
        marginRight: theme.spacing(1)
    },
    exportButton: {
        marginRight: theme.spacing(1)
    },
    searchInput: {
        marginRight: theme.spacing(1)
    },
    searchButton: {
        width: '48px',
        minWidth: '48px',
        height: '38px',
        marginTop: '8px',
        marginLeft: '2px',
    },
    title: {
        fontWeight: 'bold'
    },
}));

export default useStyles;