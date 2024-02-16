import React, { useEffect, useRef, useState } from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from "chart.js";
import { Bar, Line, getElementsAtEvent } from 'react-chartjs-2';
import moment from 'moment/moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DailySignUp = (props) => {
    const chartX = props.width;
    const chartY = props.height;

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const currentDateTime = moment();
    const currentDate = currentDateTime.date();
    const currentMonth = currentDateTime.month() + 1;
    const currentYear = currentDateTime.year();
    

    const first = currentDateTime.clone().startOf('month');
    const last = currentDateTime.clone().endOf('month');

    const firstDate = first.date();
    const lastDate =last.date();

    const [chartData, setChartData] = useState([]);
    const [selectState, setSelectMonth] = useState("");




    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${apiUrl}/api/analyze/signup/month`;
                const response = await fetch(`${url}?year=${currentYear}&month=${currentMonth}`);

                const data = await response.json();
                setChartData(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        
        };

        fetchData();
    }, []);



    const highlightToday = {
        weight: 'bold',
    };



    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display : false,
            },
            title: {
                display: true,
                text: currentMonth+"월 회원 가입수",
            },         
        },       
        scales: {
            x:{
                grid: {
                    display: false, // 선이 아예 안 그려지게 됩니다.
                },
                ticks: {     
                    
                    font: (context) => {
                        return context.tick.value + 1 === currentDate ? highlightToday : '';
                    },
                    color: (context) => {
                        return context.tick.value + 1 === currentDate ? 'red' : '';
                    },        
                    
                }
            },

            y:{
                afterDataLimits: (scale) => {
                    scale.max = scale.max * 1.2;
                },
                beginAtZero: true,  
                title: { 
                    display: true,
                    align: 'end',
                    color: '#808080',
                    font: {
                      size: 12,
                      weight: 300,
                    },
                    text: '단위: 명'
                  }            
            },
        }
    };
    let labels = [];
 
    for (let i = firstDate; i <= lastDate; i++){
       labels.push(i+"일");
    }

    const data = {        
        labels,
        datasets: [            
            {
                data: chartData.map((data) => data.count),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",                
            },
        ],
    };


    return (
        <>
            <Bar
                options={options} 
                data={data}
                // ref={chartRef}
            />
        </>
    );
};

    

export default DailySignUp;