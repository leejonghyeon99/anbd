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
import { Bar, Line } from 'react-chartjs-2';
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

const MonthSignUp = () => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const currentDateTime = moment();
    const currentMonth = currentDateTime.month();
    const currentYear = currentDateTime.year();
    
    const [chartData, setChartData] = useState([]);

    const chartRef = useRef(null);


    console.log(currentYear)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${apiUrl}/api/analyze/signup/year`;
                const response = await fetch(`${url}?year=${currentYear}`);

                const data = await response.json();
                setChartData(data.reverse());
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const highlightMonth = {
        weight: 'bold',
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `${currentYear}년 회원 가입수`,
            },
        },       
        scales: {
            x:{
                grid: {
                    display: false,
                },
                ticks: {     
                    font: (context) => {
                        return context.tick.value === currentMonth ? highlightMonth : '';
                    },
                    color: (context) => {
                        return context.tick.value === currentMonth ? 'red' : '';
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

    for (let i = 1; i <= 12; i++){
       labels.push(`${i}월`);
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
                ref={chartRef}            
            />
        </>
    );
};

export default MonthSignUp;
