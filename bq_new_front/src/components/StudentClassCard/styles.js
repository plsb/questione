import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        marginBottom: 8,
    },
    head: {
        paddingBottom: 0,
        paddingTop: 10
    },
    chip:{
        backgroundColor: '#e57373',
        color: '#ffebee',
    },
    spacer: {
        flexGrow: 1
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: 2,
        flex: 1,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    fieldsDialog: {
        marginTop: 20
    }
});

export default useStyles;