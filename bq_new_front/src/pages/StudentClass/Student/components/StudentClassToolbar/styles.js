import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {},
    row: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '32px'
    },
    filters: {
        position: 'relative',
        padding: '16px',
        paddingLeft: '0px',
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
        fontWeight: 'bold',
        padding: '16px',
    },
    description: {
        padding: '0px 16px',
    },
}));

export default useStyles;