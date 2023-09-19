import { makeStyles } from '@material-ui/core/styles';

const useStylesLocal = makeStyles({
    root: {},
    headTable: {
        fontWeight: "bold"
    },
    fab:{
        backgroundColor: '#009688',
        color: '#e0f2f1',
    },
    labelRed: {
        backgroundColor: '#EC0B43',
        display: 'block',
        margin: '10px',
        padding: '5px',
        textAlign: 'center',
        color: '#fff',
        borderRadius: 4
    },
});

export default useStylesLocal;