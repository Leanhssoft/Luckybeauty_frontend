import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dashboardStore from '../../../../stores/dashboardStore';
import { observer } from 'mobx-react';
import { ThongKeDoanhThu } from '../../../../services/dashboard/dto/thongKeDoanhThu';
function formatCurrency(number: any) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div>
                <p className="label">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index}>
                        <p key={`value-${index}`} className="value" style={{ color: entry.color }}>
                            {entry.name == 'thangTruoc'
                                ? 'Năm trước'
                                : entry.name == 'thangNay'
                                ? 'Năm này'
                                : entry.name}
                            : {formatCurrency(entry.value)}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};
const ColumnChartNew: React.FC = () => {
    const data =
        dashboardStore.thongKeDoanhThu !== undefined &&
        dashboardStore.thongKeDoanhThu != ([] as ThongKeDoanhThu[]) &&
        dashboardStore.thongKeDoanhThu.length > 0
            ? dashboardStore.thongKeDoanhThu.map((item) => {
                  return {
                      month: window.screen.width <= 768 ? 'T' + item.month : 'Tháng ' + item.month,
                      thangNay: item.thangNay,
                      thangTruoc: item.thangTruoc
                  };
              })
            : [
                  { month: window.screen.width <= 768 ? 'T1' : 'Tháng 1', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T2' : 'Tháng 2', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T3' : 'Tháng 3', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T4' : 'Tháng 4', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T5' : 'Tháng 5', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T6' : 'Tháng 6', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T7' : 'Tháng 7', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T8' : 'Tháng 8', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T9' : 'Tháng 9', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T10' : 'Tháng 10', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T11' : 'Tháng 11', thangNay: 0, thangTruoc: 0 },
                  { month: window.screen.width <= 768 ? 'T12' : 'Tháng 12', thangNay: 0, thangTruoc: 0 }
              ];
    //const yTicks = [];

    return (
        <div style={{ marginTop: '30px', background: '#FFF', borderRadius: '8px' }}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="0 0" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: '#666466' }}
                        axisLine={{ stroke: '#E6E1E6' }}
                        tickMargin={9}
                        tickSize={0}
                    />
                    <YAxis
                        tickCount={4}
                        //ticks={yTicks}
                        tick={{ fontSize: 12, fill: '#666466' }}
                        axisLine={{ stroke: 'transparent' }}
                        tickSize={0}
                        tickMargin={9}
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

                    <Bar dataKey="thangTruoc" stackId="stack" fill="#ff9900" barSize={12} />
                    <Bar dataKey="thangNay" stackId="stack" fill="var(--color-main)" barSize={12} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default observer(ColumnChartNew);
