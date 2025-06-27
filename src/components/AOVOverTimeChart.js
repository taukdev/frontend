import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ENDPOINTS } from '../api/constants';

const formatToYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const AOVOverTimeChart = ({ startDate, endDate, selectedCampaign }) => {
    const [dataAOV, setDataAOV] = useState([]);

    useEffect(() => {
        // Only fetch if both dates are selected
        if (!startDate || !endDate) return;

        const fetchChartData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    ENDPOINTS.DASHBOARD.AOV_OVER_TIME,
                    {
                        params: {
                            startDate: formatToYYYYMMDD(startDate),
                            endDate: formatToYYYYMMDD(endDate),
                            selectedCampaign
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const formattedData = response.data.data.map((item) => ({
                    time: item.time,
                    aov: item.aov,
                }));

                setDataAOV(formattedData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchChartData();
    }, [startDate, endDate, selectedCampaign]);

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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: "#78829D", fontSize: 12, fontWeight: 400 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        dataKey="aov"
                        tick={{
                            fill: "#78829D",
                            fontSize: 12,
                            fontWeight: 400,
                            fontFamily: "Inter",
                        }}
                        tickFormatter={(val) => `%${val.toFixed(2)}`}
                    />
                    <Tooltip
                        formatter={(value) => [`%${value.toFixed(2)}`, "AOV"]}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="aov"
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        dot={{ stroke: "#0ea5e9", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AOVOverTimeChart; 