import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';

// import api from "../../../services/api";

import {
    Card,
    // CardHeader,
    // CardActions,
    // Button,
    // Menu,
    // MenuItem,
    // TablePagination,
    CardContent,
    // LinearProgress,
    // Grid,
    // Table,
    // TableBody,
    Tabs,
    Tab,
    Box,
    Typography,
    // TextField
} from '@material-ui/core';

import useStyles from './styles';

function StudentClassContent({ history }) {    
    const [refresh, setRefresh] = React.useState(1);
    const [tabValue, setTabValue] = useState(0);

    const classes = useStyles();

    const a11yProps = (index) => {
        return {
            id: `nav-tab-${index}`,
            'aria-controls': `nav-tabpanel-${index}`,
        };
    }

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;
        
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`nav-tabpanel-${index}`}
                aria-labelledby={`nav-tab-${index}`}
                {...other}>
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    const LinkTab = (props) => {
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

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {}, [refresh]);

    return (
        <div className={classes.root}>
            <Tabs
                variant="fullWidth"
                value={tabValue}
                onChange={handleChangeTab}
                aria-label="nav tabs example"
            >
                <LinkTab label="Menu 1" href="/drafts" {...a11yProps(0)} />
                <LinkTab label="Menu 2" href="#" {...a11yProps(1)} />
                <LinkTab label="Pessoas" href="#" {...a11yProps(2)} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Card
                    className={classes.table}
                >
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            Tab 1
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            Tab 2
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Card className={classes.header}>
                    <CardContent>
                        <div style={{ margin: '16px', marginLeft: '16px' }}>
                            Tab 3
                        </div>
                    </CardContent>
                </Card>
            </TabPanel>
        </div>
    );
}

export default StudentClassContent;
