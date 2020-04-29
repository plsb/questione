import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';
import api from '../../../../../services/api';

import { getInitials } from '../../../../../helpers';
import {UsersToolbar} from "../index";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
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
  actions: {
    justifyContent: 'flex-end'
  }
}));

const CourseTable = props => {
  const { className, ...rest } = props;

  const [courses, setCourses] = useState([]);

  const classes = useStyles();

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  async function loadCourses(page){
    const response = await api.get('courses?page='+page);
    setTotal(response.data.total);
    setCourses(response.data.data);
    setLastPage(response.data.last_page);
    setCurrentPage(response.data.current_page);
    console.log(response.data);
  }

  useEffect(() => {
    loadCourses(1);
  }, []);

  const handleSelectAll = event => {
    const { courses } = props;

    let selectedCourses;

    if (event.target.checked) {
      selectedCourses = courses.map(course => course.id);
    } else {
      selectedCourses = [];
    }

    setSelectedCourses(selectedCourses);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCourses.indexOf(id);
    let newSelectedCourses = [];

    if (selectedIndex === -1) {
      newSelectedCourses = newSelectedCourses.concat(selectedCourses, id);
    } else if (selectedIndex === 0) {
      newSelectedCourses = newSelectedCourses.concat(selectedCourses.slice(1));
    } else if (selectedIndex === selectedCourses.length - 1) {
      newSelectedCourses = newSelectedCourses.concat(selectedCourses.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCourses = newSelectedCourses.concat(
        selectedCourses.slice(0, selectedIndex),
        selectedCourses.slice(selectedIndex + 1)
      );
    }

    setSelectedCourses(newSelectedCourses);
  };

  const handlePageChange = (event, page) => {
    loadCourses(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Inicias</TableCell>
                  <TableCell>Descrição</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                 {courses.map(course => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={course.id}
                    selected={selectedCourses.indexOf(course.id) !== -1}>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar
                          className={classes.avatar}
                          src={course.avatarUrl}>
                          {getInitials(course.initials)}
                        </Avatar>
                        <Typography variant="body1">{course.initials}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell>
                      {course.acess_level == 1 ? "Administrador" :
                          course.acess_level == 2 ? "Professor" : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
  );
};

CourseTable.propTypes = {
  className: PropTypes.string,
};

export default CourseTable;
