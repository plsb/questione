import React, { useEffect, useState } from 'react';
//import api from "../../../services/api";

import {
    Card,
    CardHeader,
    Divider,
    CardContent,
    Tabs,
    Tab,
    Box,
    Typography,
    IconButton,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ResultsByTest from './ResultsByTest/ResultsByTest';
import ResultsByStudent from './ResultsByStudent/components/ResultsByStudent';
import ResultsGeneral from './ResultsGeneral/components/ResultsGeneral';


const ResultsAplication = props =>{

    const { className, history, studentClassId, fk_class_id } = props;

    return(
        <div>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Typography>Visão Geral</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        spacing={1}>
                              <Grid
                                  item
                                  md={12}
                                  xs={12}>
                                    <ResultsGeneral studentClassId={studentClassId}/>

                                 </Grid>
                    </Grid>

                </AccordionDetails>
            </Accordion>

            {/*<Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
                >
                <Typography>Resultados por Alunos</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Grid
                        container
                        spacing={1}>
                        <Grid
                            item
                            md={12}
                            xs={12}>
                            <ResultsByStudent/>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion> */}
        </div>
    );
}

export default ResultsAplication;