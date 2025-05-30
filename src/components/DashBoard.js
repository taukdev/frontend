
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ReactComponent as CalendarIcon } from '../Assets/calendar.svg';

import { ReactComponent as TotalLead } from '../Assets/TotalLead.svg';
import { ReactComponent as CallableLeadWithBackground } from '../Assets/CallableLeadWithBackground.svg';
import { ReactComponent as TotalSale } from '../Assets/TotalSale.svg';
import { ReactComponent as SaleRevenue } from '../Assets/SaleRevenue.svg';
import { ReactComponent as ConversionRate } from '../Assets/ConversionRate.svg';
import { ReactComponent as AOV } from '../Assets/AOV.svg';

const dataAOV = [
  { month: "Jan", value: 1600 },
  { month: "Feb", value: 1200 },
  { month: "Mar", value: 1300 },
  { month: "Apr", value: 1725 },
  { month: "May", value: 1100 },
  { month: "Jun", value: 1500 },
];

const dataCVR = [
  { month: "Jan", value: 25 },
  { month: "Feb", value: 15 },
  { month: "Mar", value: 20 },
  { month: "Apr", value: 33 },
  { month: "May", value: 17 },
  { month: "Jun", value: 22 },
];

const CustomTooltip = ({ active, payload, label, labelFormatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border shadow-md rounded-lg p-2 text-sm text-gray-700">
        <p className="font-semibold font-['Inter'] font-semibold tracking-normal">{labelFormatter ? labelFormatter(label) : label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="font-['Inter'] font-semibold text-[#071437]">
            $ {entry.value}
          </p>
        ))} 
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md">
    <div className="p-3 rounded-xl">
      <Icon className="text-gray-700" />
    </div>
    <div>
      <h4 className="text-lg font-semibold">{value}</h4>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-start gap-2">

          {/* Heading and subheading stacked vertically */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tauk Client Dashboard</h2>
            <p className="text-sm text-gray-500">Central Hub for Personal Customization</p>
          </div>
        </div>

        <div className="flex items-center border rounded-lg px-3 py-2 md:gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM, yyyy"
            showMonthYearPicker
            className="hidden md:block w-40 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={TotalLead} title="Total Leads" value="253" />
        <StatCard icon={CallableLeadWithBackground} title="Callable Leads" value="178" />
        <StatCard icon={TotalSale} title="Total Sales" value="42" />
        <StatCard icon={SaleRevenue} title="Sales Revenue" value="$72,450" />
        <StatCard icon={ConversionRate} title="Conversion Rate (CVR)" value="16.6%" />
        <StatCard icon={AOV} title="Average Order Value (AOV)" value="$1,725" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-semibold">Average Order Value Over Time</h3>
  <select className="border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none">
    <option value="monthly">12 months</option>
    <option value="quarterly">Quarterly</option>
    <option value="yearly">Yearly</option>
  </select>
</div>
          <ResponsiveContainer width="100%" height={300}>
<LineChart data={dataAOV}>
  <defs>
    <linearGradient id="aovGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#0ea5e9" />
      <stop offset="100%" stopColor="#38bdf8" />
    </linearGradient>
  </defs>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" tick={false} axisLine={false} />
  <YAxis dataKey="value" tick={{ fill: '#78829D', fontSize: 12, fontWeight: 400 , fontFamily: 'Inter' ,style: {
      letterSpacing: '0em', 
    }}} 
    tickFormatter={(val) => `$ ${val}`} />

  <Tooltip
  content={<CustomTooltip />}
  formatter={(value) => [`$${value}`, "AOV"]}
/>
  <Line
    type="monotone"
    dataKey="value"
    stroke="url(#aovGradient)" // ← Use the gradient ID here
    strokeWidth={3}
  />
</LineChart>

          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-semibold">Conversion Rate Over Time</h3>
  <select className="border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none">
    <option value="monthly">12 months</option>
    <option value="quarterly">Quarterly</option>
    <option value="yearly">Yearly</option>
  </select>
</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataCVR}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={false} axisLine={false}/>
              <YAxis domain={[0, 40]} tickFormatter={(val) => `${val}%`} tick={{ fill: '#78829D', fontSize: 12, fontWeight: 400 , fontFamily: 'Inter' ,style: {
      letterSpacing: '0em', 
    }}}/>
              <Tooltip
  content={<CustomTooltip />}
  formatter={(value) => [`${value}%`, "CVR"]}
/>
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
