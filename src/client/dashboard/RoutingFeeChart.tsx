import React, { useEffect, useState } from 'react';
import { defaultChartQueryDays, selectedSavedNode } from '~client/utils/constants';

import { ChartFeesEarnedOutput } from '~client/output';
import { axiosGet } from '~client/utils/axios';
import resgisterCharts from '../register_charts';

// Renders the routing fees earned chart section of the dashboard.

const RoutingFeeChart = () => {
  const [data, setData] = useState({ data: [], title: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      const query = {
        days: defaultChartQueryDays,
        via: '',
        is_count: false,
        is_forwarded: false,
        nodes: [selectedSavedNode()],
      };

      const result = await axiosGet({ path: 'chart-fees-earned', query });

      if (!!result) {
        setData(result);
      }
    };

    fetchData();
  }, []);

  resgisterCharts();
  return <>{!!data.data.length ? <ChartFeesEarnedOutput data={data} /> : null}</>;
};

export default RoutingFeeChart;
