import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AOVOverTimeChart = () => {
    const [dataAOV, setDataAOV] = useState([]);

    const fetchChartData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/aov-over-time', {
                params: {
                    startDate: '2025-06-01',
                    endDate: '2025-06-26',
                    interval: 'daily',
                }
            });

            // Map API response to chart format
            const formattedData = response.data.data.map(item => ({
                month: item.time,    // X-axis
                value: item.aov      // Y-axis
            }));

            setDataAOV(formattedData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, []);

    return (
        <div className="bg-white rounded-[18px] shadow-[0px_3px_4px_0px_#00000008] border border-[#F1F1F4]">
            <div className="flex justify-between items-center mb-[26px]  p-[26px] border-b border-b-[#F1F1F4]">
                <h3 className="text-[16px] leading-[16px] text-[#071437] font-semibold">
                    Average Order Value Over Time
                </h3>
                <select className="border border-[#DBDFE9] rounded-[6px] px-[10px] py-[8px] text-[11px] leading-[12px] text-[#252F4A] ">
                    <option value="monthly">12 months</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>
            <ResponsiveContainer
                width="100%"
                height={266}
                className="md:px-[20px] md:pb-[20px] max-sm:pr-3"
            >
                <LineChart data={dataAOV}>
                    <defs>
                        <linearGradient id="aovGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={false} axisLine={false} />
                    <YAxis
                        dataKey="value"
                        tick={{
                            fill: "#78829D",
                            fontSize: 12,
                            fontWeight: 400,
                            fontFamily: "Inter",
                            style: {
                                letterSpacing: "0em",
                            },
                        }}
                        tickFormatter={(val) => `% ${val}`}
                    />
                    <Tooltip
                        formatter={(value) => [`${value}`, "AOV"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#aovGradient)"
                        strokeWidth={3}
                        dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AOVOverTimeChart; 