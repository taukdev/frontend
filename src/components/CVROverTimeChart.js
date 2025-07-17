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

const CVROverTimeChart = ({ startDate, endDate, selectedCampaign }) => {
    const [dataCVR, setDataCVR] = useState([]);

    useEffect(() => {
        if (!startDate || !endDate) return;

        const fetchChartData = async () => {
            try {
                const token = localStorage.getItem("token");
              
                let campaignNameParam = undefined;
                if (Array.isArray(selectedCampaign) && selectedCampaign.length > 0 && !selectedCampaign.includes("All")) {
                    campaignNameParam = selectedCampaign.join(",");
                }
                const params = {
                    startDate: formatToYYYYMMDD(startDate),
                    endDate: formatToYYYYMMDD(endDate),
                };
                if (campaignNameParam) params.campaignName = campaignNameParam;
                const response = await axios.get(
                    ENDPOINTS.DASHBOARD.CVR_OVER_TIME,
                    {
                        params,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                const formattedData = response.data.map((item) => ({
                    time: item.date,
                    cvr: item.CVR,
                }));

                setDataCVR(formattedData);
            } catch (error) {
                console.error("Error fetching CVR chart data:", error);
            }
        };

        fetchChartData();
    }, [startDate, endDate,selectedCampaign]);

    return (
        <div className="bg-white rounded-[18px] shadow-[0px_3px_4px_0px_#00000008] border border-[#F1F1F4]">
            <div className="flex justify-between items-center mb-[26px] p-[26px] border-b border-b-[#F1F1F4]">
                <h3 className="text-[16px] leading-[16px] text-[#071437] font-semibold">
                    Conversion Rate Over Time
                </h3>
            </div>
            <ResponsiveContainer
                width="100%"
                height={266}
                className="md:px-[20px] md:pb-[20px] max-sm:pr-3"
            >
                <LineChart data={dataCVR}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: "#78829D", fontSize: 12, fontWeight: 400 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        dataKey="cvr"
                        tick={{
                            fill: "#78829D",
                            fontSize: 12,
                            fontWeight: 400,
                            fontFamily: "Inter",
                        }}
                        tickFormatter={(val) => `${(val * 100).toFixed(2)}%`}
                    />
                    <Tooltip
                        formatter={(value) => [`${(value * 100).toFixed(2)}%`, "CVR"]}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="cvr"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ stroke: "#22c55e", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CVROverTimeChart; 