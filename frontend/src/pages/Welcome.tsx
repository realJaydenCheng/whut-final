import SearchLite from '@/components/SearchComplex/SearchLite';
import { listDbApiDbListGet } from '@/services/ant-design-pro/listDbApiDbListGet';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Card, theme } from 'antd';
import { Line } from '@ant-design/plots';
import React, { useState } from 'react';


const Welcome: React.FC = () => {

  const [dbMetas, setDbMetas] = useState<API.DatabaseMetaOutput[]>([]);

  useRequest(listDbApiDbListGet, {
    onSuccess: (data) => {
      setDbMetas(data || []);
    }
  })

  return <PageContainer>
    <SearchLite
      onSearchAndSubmit={() => { }}
      databaseMetas={dbMetas}
    />
  </PageContainer>

};

export default Welcome;
