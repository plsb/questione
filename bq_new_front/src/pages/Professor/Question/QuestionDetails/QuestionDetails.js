import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Box, Grid, TextField, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Block, Close, Done} from "@material-ui/icons";
import {withRouter} from "react-router-dom";
import QuestionCourse from "./QuestionCourse";
import QuestionItens from "./QuestionItens";
import { Editor } from '@tinymce/tinymce-react';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    };
}

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const QuestionDetails = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <Paper className={classes.root}>
          <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="nav tabs example">
              <LinkTab label="Texto base & Enunciado" href="/drafts" {...a11yProps(0)} />
              <LinkTab label="Itens" href="/trash" {...a11yProps(1)} />
              <LinkTab label="Competência" href="/spam" {...a11yProps(2)} />
          </Tabs>
          {/*texto base e enunciado*/}
          <TabPanel value={value} index={0}>
              <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center">
                  <TextField
                      fullWidth
                      label="Referência"
                      margin="dense"
                      name="reference"
                      variant="outlined"
                      style={{width: '90%', justifyContent: 'center'}}
                  />
              </Grid>
              <div style={{padding: "30px"}}>
                  <b className="item1">Enunciado</b>
                  <Editor
                      apiKey="ndvo85oqtt9mclsdb6g3jc5inqot9gxupxd0scnyypzakm18"
                      init={{
                          height: 200,
                          menubar: false,
                          file_picker_types: 'image',
                          images_upload_url: 'postAcceptor.php',
                          automatic_uploads: false,
                          plugins: [
                              'textpattern advlist autolink lists link image charmap print',
                              ' preview hr anchor pagebreak code media save',
                              'table contextmenu FMathEditor charmap'
                          ],
                          toolbar:
                              'insertfile undo redo | fontselect fontsizeselect | bold italic superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image table print preview FMathEditor  charmap'
                      }}
                      name="base_text"/>
              </div>
              <div style={{padding: "30px"}}>
                  <b className="item1">Texto Base</b>
                  <Editor
                      apiKey="ndvo85oqtt9mclsdb6g3jc5inqot9gxupxd0scnyypzakm18"
                      init={{
                          height: 200,
                          menubar: false,
                          file_picker_types: 'image',
                          images_upload_url: 'postAcceptor.php',
                          automatic_uploads: false,
                          plugins: [
                              'textpattern advlist autolink lists link image charmap print',
                              ' preview hr anchor pagebreak code media save',
                              'table contextmenu FMathEditor charmap'
                          ],
                          toolbar:
                              'insertfile undo redo | fontselect fontsizeselect | bold italic superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link image table print preview FMathEditor  charmap'
                      }}
                      name="stem"/>
              </div>

          </TabPanel>
          {/* INTES */}
          <TabPanel value={value} index={1}>
            <QuestionItens />

          </TabPanel>
          {/* CURSO E COMPETÊNCIA*/}
          <TabPanel value={value} index={2}>
            <QuestionCourse />
          </TabPanel>

      </Paper>
  );
}

QuestionDetails.propTypes = {
    className: PropTypes.string,
};

export default withRouter(QuestionDetails);
