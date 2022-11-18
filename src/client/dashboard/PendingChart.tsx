import React, { useEffect, useState } from 'react';

import { BasicTable } from '~client/standard_components/app-components';
import { axiosPost } from '~client/utils/axios';
import resgisterCharts from '~client/register_charts';
import { selectedSavedNode } from '~client/utils/constants';
import { useLoading } from '~client/hooks/useLoading';

// Calls NestJs Server and returns pending payments and channels

const PendingChart = () => {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const postBody = {
        node: selectedSavedNode(),
      };

      useLoading({ isLoading: true });
      const result = await axiosPost({ path: 'grpc/get-pending', postBody });

      if (!!result) {
        setData(result);
      }

      useLoading({ isLoading: false });
    };

    fetchData();
  }, []);

  resgisterCharts();
  return !!data && !!data.length ? <BasicTable rows={data} title={'Pending Things'} /> : null;
};

export default PendingChart;
