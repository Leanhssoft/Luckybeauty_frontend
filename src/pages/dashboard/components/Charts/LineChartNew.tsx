import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './lineChartNew.css';
import dashboardStore from '../../../../stores/dashboardStore';
import { observer } from 'mobx-react';
import { ThongKeLichHen } from '../../../../services/dashboard/dto/thongKeLichHen';
import { Typography } from '@mui/material';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div>
                <p className="label">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index}>
                        <p key={`value-${index}`} className="value" style={{ color: entry.color }}>
                            {entry.name == 'tuanTruoc'
                                ? 'Tuần trước'
                                : entry.name == 'tuanNay'
                                ? 'Tuần này'
                                : entry.name}
                            : {entry.value}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};
const LineChartNew: React.FC = () => {
    const data =
        dashboardStore.thongKeLichHen !== undefined &&
        dashboardStore.thongKeLichHen !== ([] as ThongKeLichHen[]) &&
        dashboardStore.thongKeLichHen.length > 0
            ? dashboardStore.thongKeLichHen.map((item) => {
                  return {
                      tuan:
                          item.tuan === '0'
                              ? window.screen.width <= 768
                                  ? 'CN'
                                  : 'Chủ nhật'
                              : window.screen.width <= 768
                              ? 'T' + item.tuan
                              : 'Thứ ' + item.tuan,
                      tuanNay: item.tuanNay,
                      tuanTruoc: item.tuanTruoc
                  };
              })
            : [
                  { tuan: window.screen.width <= 768 ? 'T2' : 'Thứ 2', tuanNay: 0, tuanTruoc: 0 },
                  { tuan: window.screen.width <= 768 ? 'T3' : 'Thứ 3', tuanNay: 0, tuanTruoc: 0 },
                  { tuan: window.screen.width <= 768 ? 'T4' : 'Thứ 4', tuanNay: 0, tuanTruoc: 0 },
                  { tuan: window.screen.width <= 768 ? 'T5' : 'Thứ 5', tuanNay: 0, tuanTruoc: 0 },
                  { tuan: window.screen.width <= 768 ? 'T6' : 'Thứ 6', tuanNay: 0, tuanTruoc: 0 },
                  { tuan: window.screen.width <= 768 ? 'T7' : 'Thứ 7', tuanNay: 0, tuanTruoc: 0 },
                  { tuan: window.screen.width <= 768 ? 'CN' : 'Chủ nhật', tuanNay: 0, tuanTruoc: 0 }
              ];

    const hideZeroFormatter = (value: any) => (value === 0 ? '' : value);
    const renderLineChart = (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 8, right: 35, bottom: 24, left: 0 }}>
                <Line
                    type="monotone"
                    dataKey="tuanNay"
                    stroke="var(--color-main)"
                    dot={false}
                    activeDot={{ r: 4 }}
                    animationDuration={8000}
                />
                <Line
                    type="monotone"
                    dataKey={'tuanTruoc'}
                    stroke="#ff9900"
                    dot={false}
                    activeDot={{ r: 4 }}
                    animationDuration={8000}
                />
                <CartesianGrid stroke="#E6E1E6" strokeDasharray="0 0 " />
                <XAxis
                    dataKey="tuan"
                    tickSize={0}
                    tick={{ fontSize: 12, fill: '#666466' }}
                    axisLine={{ stroke: '#E6E1E6' }}
                    tickMargin={15}
                    tickLine={{ stroke: '#E6E1E6' }}
                    interval={0}
                />
                <YAxis
                    type="number"
                    tickCount={6}
                    tick={{ fontSize: 12, fill: '#666466' }}
                    axisLine={{ stroke: '#E6E1E6' }}
                    tickSize={0}
                    tickMargin={18}
                    tickFormatter={hideZeroFormatter}
                />
                <Tooltip
                    wrapperStyle={{
                        width: 250,
                        backgroundColor: '#fff',
                        border: '1px solid #EFEDEF',
                        padding: '8px'
                    }}
                    content={<CustomTooltip />}
                />
            </LineChart>
        </ResponsiveContainer>
    );
    return (
        <div className="chart">
            <div className="tooltips">
                <div className="tooltip-item">
                    <div className="tooltip-dot current"></div>
                    <Typography
                        sx={{
                            //color: '#29303D',
                            fontFamily: 'Roboto',
                            fontSize: '12px',
                            fontWeight: '400'
                        }}>
                        Tuần này
                    </Typography>
                </div>
                <div className="tooltip-item">
                    <div className="tooltip-dot before"></div>
                    <Typography
                        sx={{
                            //color: '#29303D',
                            fontFamily: 'Roboto',
                            fontSize: '12px',
                            fontWeight: '400'
                        }}>
                        Tuần trước
                    </Typography>
                </div>
            </div>
            {renderLineChart}
        </div>
    );
};

export default observer(LineChartNew);
