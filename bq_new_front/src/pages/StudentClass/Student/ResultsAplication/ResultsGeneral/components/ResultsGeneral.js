import React, { useEffect, useState } from 'react';
import api from "../../../../../../services/api";
import useStyles from "../../../../../../style/style";

import {Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Legend,
  Title,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Box, Paper} from "@material-ui/core";
import {
  MingcuteAlertOctagonFill
} from "../../../../../Student/EvaluationsResult/EvaluationResultDetails/EvaluationsResultDetails";

ChartJS.register(
    CategoryScale,
    LineElement,
    PointElement,
    LinearScale,
    Legend,
    Title,
    ChartDataLabels,
    Tooltip
);

const ResultsGeneral = props =>{
    const [data, setData] = useState(null);

    const [classProfessorOverview, setClassProfessorOverview] = useState(null);
    const [precisionCorrect, setPrecisionCorrect] = useState(0);

    const { studentClassId} = props;

    const classesGeneral = useStyles();

    async function loadClassProfessorOverview(){
        try {
          let url = `class/student/overview/${studentClassId}`;
          const response = await api.get(url);


          if(response.status == 200) {
            if(response.data.length === 0){
              setClassProfessorOverview(null);
            } else {
              setClassProfessorOverview(response.data);

              let evaluations = [];
              let percentages = [];
              let totalAnswered = 0;
              let sumPercentagesAnswered = 0;


              response.data[0].evaluation_answer.forEach(function(result, i) {
                evaluations.push('S'+(i + 1));
                percentages.push(result.porcentage_correct);

                if(result.finalized_at){
                  totalAnswered += 1;
                  sumPercentagesAnswered += result.porcentage_correct;
                }
              });

              setPrecisionCorrect((sumPercentagesAnswered/totalAnswered).toFixed(2))

              setData({
                              labels: evaluations,
                              datasets: [
                                {
                                  label: "Porcentagem de acerto nos simulados",
                                  fill: false,
                                  borderColor: "#bdbdbd",
                                  data: percentages,
                                  borderWidth: 3,
                                  pointBorderWidth: 5
                                },
                              ],
                            }
              )
            }
          } else {
            setClassProfessorOverview(null);

          }
          
        } catch (error) {

        }

      }

    useEffect(() => {
      loadClassProfessorOverview();
    }, []);

    useEffect(() => {

    }, [data]);

    const options = {
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 50,
            font: {
              size: '12px',
              weight: 'bold',
              family: 'Verdana'
            }
          },
        },
        x: {
          ticks: {
            font: {
              size: '12px',
              weight: 'bold',
              family: 'Verdana'
            }
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: '',
          font: {
            weight: 'bold',
            size: '14px',
            family: 'Verdana',
            color: '#000000'
          }
        },
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            font: {
              weight: 'bold',
              size: '14px',
              family: 'Verdana',
              color: '#000000'
            }
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          font: {
            weight: 'bold',
            size: '14px',
            family: 'Verdana',

          },
          color: function(value) {
            let valor = value.dataset.data[value.dataIndex];
            if(valor <= 20){
              return '#f44336'
            } else if (valor <= 50) {
              return '#ffab40'
            } else {
              return '#43a047'
            }
          },
          formatter: function(value) {
            return Math.round(value)+'%';
          },
        }
      }

    };

    return <div style={{marginLeft: '100px', marginRight: '100px'}}>
              <Box display="flex">
                      <Paper style={{
                                  background: '#3a7cf7',
                                  marginTop: '5px',
                                  marginBotton: '5px',
                                  paddingTop: '5px',
                                  paddingBottom: '5px',
                                  paddingLeft: '15px',
                                  paddingRight: '15px',
                                  color: '#FFF', fontWeight: 'bold', fontSize: '15px', marginRight: '5px',
                                }}>
                                  <Box display="flex" alignItems="row">
                                    <MingcuteAlertOctagonFill />
                                    <div style={{marginLeft: '10px'}}>
                                      {precisionCorrect+ '% de precisão nesta turma.'}
                                    </div>
                                  </Box>
                        </Paper>
              </Box>
                {data && <Line data={data} options={options} />}
                <Box display="flex" justifyContent="center">
                  <div className={classesGeneral.paperTitleTextBold} style={{ marginRight: '10px'}}>
                    Legenda:
                  </div>
                  <div className={classesGeneral.paperTitleText} style={{color: '#f44336', marginRight: '5px'}}>
                    0 a 20%;
                  </div>
                  <div className={classesGeneral.paperTitleText} style={{color: '#ffab40', marginRight: '5px'}}>
                    21 a 50%;
                  </div>
                  <div className={classesGeneral.paperTitleText} style={{color: '#43a047'}}>
                    51 a 100%.
                  </div>
                </Box>

          </div>;
}

export default ResultsGeneral;