import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import { Typography } from '@mui/material';

// Generate Sales Data
function createData(
    time: string,
    amount?: number,
): { time: string; amount: number | null } {
    return { time, amount: amount ?? null };
}

interface LoadedAsset {
    ticker: string,
    purchasedOn: Date,
    amount: number,
    price: number,
}
interface ChartProps {
    assets: LoadedAsset[][];
}

export default function Chart({ assets }: ChartProps) {
    const theme = useTheme();

    var data = [
        createData('00:00', 0),
        createData('03:00', 300),
        //createData('06:00', 600),
        //createData('09:00', 800),
        //createData('12:00', 1500),
        //createData('15:00', 2000),
        //createData('18:00', 2400),
        //createData('21:00', 2400),
        //createData('24:00'),
    ];

    const calculateAssetsValue = (assets: LoadedAsset[]) => {
        var value = 0.0;
        for (const asset of assets) {
            value += asset.amount * asset.price;
        }
        return value;
    }

    if (assets != null && assets.length > 1) {
        var newData = [];
        for (const asset of assets) {
            newData.push(createData(new Date(asset[0].purchasedOn).toLocaleString(),
                calculateAssetsValue(asset)));
        }
        data = newData;
    }

    return (
        <React.Fragment>
            {/*<Typography component="h2" variant="h6" color="primary" gutterBottom>*/}
            {/*    Today*/}
            {/*</Typography>*/}
            <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
                <LineChart
                    dataset={data}
                    margin={{
                        top: 16,
                        right: 20,
                        left: 70,
                        bottom: 30,
                    }}
                    xAxis={[
                        {
                            scaleType: 'point',
                            dataKey: 'time',
                            tickNumber: 2,
                            tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
                        },
                    ]}
                    yAxis={[
                        {
                            label: 'Overall ($)',
                            labelStyle: {
                                ...(theme.typography.body1 as ChartsTextStyle),
                                fill: theme.palette.text.primary,
                            },
                            tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
                            //max: 2500,
                            tickNumber: 3,
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'amount',
                            showMark: false,
                            color: theme.palette.primary.light,
                        },
                    ]}
                    sx={{
                        [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
                        [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
                        [`& .${axisClasses.left} .${axisClasses.label}`]: {
                            transform: 'translateX(-25px)',
                        }
                    }}
                />
            </div>
        </React.Fragment>
    );
}