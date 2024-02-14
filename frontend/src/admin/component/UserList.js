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
} from "chart.js";
import { Bar, Line, getElementsAtEvent } from 'react-chartjs-2';
import moment from 'moment/moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const UserList = () => {

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

    const chartRef = useRef(null);
    console.log(apiUrl)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${apiUrl}/api/analyze/signup`;
                const sort = 'daily';
                const startDate = first.format('YYYY-MM-DD');
                const endDate = last.format('YYYY-MM-DD');

                const response = await fetch(`${url}?sort=${sort}&startDate=${startDate}&endDate=${endDate}`);

                const data = await response.json();
                setChartData(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        
        };

        fetchData();
    }, []);  

    useEffect(() => {

        if (chartRef.current) {
            const chartInstance = chartRef.current;
            console.log(chartInstance)
        }
    }, []);

    const highlightToday = {
        weight: 'bold',
    };



    const options = {
        responsive: true,
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
                    }                
                    
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
        <div>
            <Line 
                options={options} 
                data={data}
                height={100} 
                ref={chartRef}
            />
        </div>
    );
};

    

export default UserList;