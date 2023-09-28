import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Paper,
    Dialog,
    Box,
    Divider,
    Link,
    Grid,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, Button, Tooltip
} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import api from "../../services/api";
import moment from "moment";
import useStyles from "../../style/style";
import {withStyles} from "@material-ui/core/styles";
import ReactHtmlParser from "react-html-parser";

const TooltipCustomized = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 200,
        fontSize: theme.typography.pxToRem(12),
        border: '2px solid #dadde9',
    },
}))(Tooltip);

const TooltipQuestione = props => {
    const { className, history, description, content, position, ...rest } = props;

    const classesGeneral = useStyles();

    useEffect(() => {

    }, []);

    return (
      <div >
          <TooltipCustomized
              placement={position}
              title={
                  <Box style={{marginBottom: '5px'}} justifyContent="center" flexDirection='center'>
                      <div className={classesGeneral.paperTitleTextBold} style={{fontSize: '9px'}}>{'Dica Questione'}</div>
                      <div className={classesGeneral.paperTitleText} style={{fontSize: '10px'}}>{description}</div>
                  </Box>
              }>
              <Box display="flex" alignItems="center">
                  {content}
              </Box>
          </TooltipCustomized>
      </div>
    );
};

TooltipQuestione.propTypes = {
    className: PropTypes.string,
    description: PropTypes.object,
    content: PropTypes.object,
    position: PropTypes.string
};

export default withRouter(TooltipQuestione);
