import React, { useState, useEffect, use } from 'react';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';

import HighlightedCard from '../../components/HighlightedCard';
import KPICard from '../../components/customized/KPI-Card';


import Table from '../../components/customized/Table';
import LineGraph from '../../components/customized/Line-Graph';
import BarGraph from '../../components/customized/Bar-Graph';
import SimpleStatCard from '../../components/customized/Simple-Stat';
import { getShortMonthNames, humanizeNumber, renderSparklineCell } from '../../utils/utils';
import { costMOM, quantityMOM, revenueMOM } from '../../data/trends';

export default function MoMTrends() {
  // Quantity Bar Graph
  const [quantityValue, setQuantityValue] = useState(0);
  const [quantitySeries, setQuantitySeries] = useState([]);
  useEffect(() => {
    const data = quantityMOM;
    const series = [
      {
        id: 'stock_revenue',
        label: 'Stock Revenue',
        data: data.data.stock_quantities_mom,
        stack: 'A',
      },
      {
        id: 'menu_revenue',
        label: 'Menu Revenue',
        data: data.data.menu_quantities_mom,
        stack: 'A',
      }
    ];

    const stock_value = data.data.stock_quantities_mom.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const menu_value = data.data.menu_quantities_mom.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const total_value = stock_value + menu_value;

    setQuantityValue(total_value);
    setQuantitySeries(series);
 
  }, []);

  // Cost Bar Graph
  const [costValue, setCostValue] = useState(0);
  const [costSeries, setCostSeries] = useState([]);
  useEffect(() => {
    const data = costMOM;
    const series = [
      {
        id: 'total_cost',
        label: 'Total Cost',
        data: data.data,
        stack: 'A',
      },

    ];

    const total_value = data.data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    setCostValue(total_value);
    setCostSeries(series);
  }, []);

  // Profit Bar Graph
  const [profitValue, setProfitValue] = useState(0);
  const [profitSeries, setProfitSeries] = useState([]);
  useEffect(() => {
    const revenueData = revenueMOM;
    const costData = costMOM;
    const stockRevenue = revenueData.data.stock_revenues_mom;
    const menuRevenue = revenueData.data.menu_revenues_mom;
    const totalCost = costData.data;
    
    // Calculate profit for each month
    const profitData = stockRevenue.map((stock, index) => {
    const menu = menuRevenue[index] || 0;
    const cost = totalCost[index] || 0;
    return stock + menu - cost;
    });
    
    // Calculate total profit
    const totalProfit = profitData.reduce((acc, val) => acc + val, 0);
    
    setProfitValue(totalProfit);
    setProfitSeries([
    {
        id: 'profit',
        label: 'Profit',
        data: profitData,
        stack: 'A',
    }
    ]);
  }, []);

  // Revenue Bar Graph
  const [revenueValue, setRevenueValue] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState([]);
  useEffect(() => {
    const data = revenueMOM;
    const series = [
      {
        id: 'stock_revenue',
        label: 'Stock Revenue',
        data: data.data.stock_revenues_mom,
        stack: 'A',
      },
      {
        id: 'menu_revenue',
        label: 'Menu Revenue',
        data: data.data.menu_revenues_mom,
        stack: 'A',
      }
    ];

    const stock_value = data.data.stock_revenues_mom.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const menu_value = data.data.menu_revenues_mom.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const total_value = stock_value + menu_value;

    setRevenueValue(total_value);
    setRevenueSeries(series);
  }, []);

  return (
      <Grid2
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Cost: Month-over-Month" value={humanizeNumber(costValue)} interval={getShortMonthNames()} description = "Data for Last Year" series= {costSeries}/>
        </Grid2>   
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Revenue: Month-over-Month" value={humanizeNumber(revenueValue)} interval={getShortMonthNames()} description = "Data for Last Year" series= {revenueSeries}/>
        </Grid2> 
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Profit: Month-over-Month" value={humanizeNumber(profitValue)} interval={getShortMonthNames()} description = "Data for Last Year" series= {profitSeries}/>
        </Grid2> 
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Quantiies Sold: Month-over-Month" value={humanizeNumber(quantityValue)} interval={getShortMonthNames()} description = "Data for Last Year" series= {quantitySeries}/>
        </Grid2>            
      </Grid2>     
  );
}
