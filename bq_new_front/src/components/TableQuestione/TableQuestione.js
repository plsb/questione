import React from 'react';
import {makeStyles} from "@material-ui/styles";
import UsersToolbar from "../../pages/Administrator/Course/CourseTable/components/CourseToolbar/CourseToolbar";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow,
    Tooltip
} from "@material-ui/core";
import clsx from "clsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import {DialogQuestione} from "../index";
import PropTypes from "prop-types";

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
    }
}));

const TableQuestione = props => {
  const { className, total, handlePageChange, handleRowsPerPageChange,
      page, rowsPerPage, children, ...rest } = props;

  const classes = useStyles();

  return (
    <div>
        <div className={classes.root}>

            <div className={classes.content}>
                <Card
                    className={clsx(classes.root, className)}>
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table>
                                {children}
                            </Table>

                        </PerfectScrollbar>
                    </CardContent>
                    <CardActions className={classes.actions}>
                        <TablePagination
                            component="div"
                            count={total}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[10]}
                        />
                    </CardActions>
                </Card>
            </div>
        </div>

    </div>
  );
};

TableQuestione.propTypes = {
    handlePageChange: PropTypes.func,
    handleRowsPerPageChange: PropTypes.func,
    rowsPerPages: PropTypes.func,
    total: PropTypes.number,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default TableQuestione;
