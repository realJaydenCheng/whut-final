import SearchLite from '@/components/SearchComplex/SearchLite';
import { listDbApiDbListGet } from '@/services/ant-design-pro/listDbApiDbListGet';
import { PageContainer } from '@ant-design/pro-components';
import { request, useModel, useRequest } from '@umijs/max';
import { Card, Col, Row, theme } from 'antd';
import React, { useState } from 'react';

import useStylesA from './styleA';
import IntroduceRow from './IntroduceRow';
import { AnalysisData } from './data';
import getFakeChartData from "./_mock"

const Info: React.FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => {
  const { styles } = useStylesA();
  return (
    <div className={styles.headerInfo} >
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em />}
    </div>
  );
};


const Welcome: React.FC = () => {

  const { data: dbMetas } = useRequest(listDbApiDbListGet, {
  })

  return <PageContainer>

    <Card bordered={false} style={{ margin: 25 }}>
      <Row>
        <Col sm={8} xs={24}>
          <Info title="数据库数量" value="3 座" bordered />
        </Col>
        <Col sm={8} xs={24}>
          <Info title="科研项目收录总数量" value="16,888,808 条" bordered />
        </Col>
        <Col sm={8} xs={24}>
          <Info title="系统涵盖年份" value="2016-2023" />
        </Col>
      </Row>
    </Card>

    <div style={{ margin: 48 }}>
      <SearchLite
        onSearchAndSubmit={() => { }}
        databaseMetas={dbMetas || []}
      />
    </div>

    <IntroduceRow
      loading={false}
      visitData={
        getFakeChartData.visitData
      }
    />


  </PageContainer>

};

export default Welcome;
