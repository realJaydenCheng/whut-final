import SearchLite from '@/components/SearchComplex/SearchLite';
import { listDbApiDbListGet } from '@/services/ant-design-pro/listDbApiDbListGet';
import { PageContainer } from '@ant-design/pro-components';
import { request, useModel, useRequest } from '@umijs/max';
import { Card, Col, FormInstance, Row, theme } from 'antd';
import React, { useEffect, useState } from 'react';

import useStylesA from './styleA';
import IntroduceRow from './IntroduceRow';
import { AnalysisData } from './data';
import getFakeChartData from "./_mock"
import HotNewTopics from './HotNewTopics';
import { getViceTrendsApiChartsViceTrendPost } from '@/services/ant-design-pro/getViceTrendsApiChartsViceTrendPost';
import { getCategoriesPercentageApiChartsCategoriesPost } from '@/services/ant-design-pro/getCategoriesPercentageApiChartsCategoriesPost';

type tEvent = React.ChangeEvent<HTMLInputElement> |
  React.MouseEvent<HTMLElement> |
  React.KeyboardEvent<HTMLInputElement> | undefined;

type tInfo = { source?: 'clear' | 'input'; } | undefined

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

const genSearchRequest = (db_id: string): API.SearchRequest => {
  return {
    db_id: db_id,
    terms: [],
    page: null,
    page_size: null,
    filters: null,
    sub_terms: null,
    date_range: null,
  }
}


const Welcome: React.FC = () => {

  const [selectedDbId, setSelectedDbId] = useState<string>('65e94e64-e526-4298-981b-8168eb142605');

  const { data: dbMetas } = useRequest(listDbApiDbListGet, {
    onSuccess: (data) => {
      runDbTrend(selectedDbId);
      const _meta = data?.find(db => db.id === selectedDbId);
      runCateA(_meta);
      runCateB(_meta);
    }
  });


  const { data: dbTrend, run: runDbTrend } = useRequest(
    (db_id: string) => {
      return getViceTrendsApiChartsViceTrendPost(genSearchRequest(db_id));
    },
    {
      manual: true
    }
  );

  const { data: cateA, run: runCateA } = useRequest(
    (meta?: API.DatabaseMetaOutput) => {
      if (meta) {
        return getCategoriesPercentageApiChartsCategoriesPost(
          {
            field: meta.cate_fields[0],
          },
          genSearchRequest(meta.id),
        );
      }
    },
    {
      manual: true
    }
  );

  const { data: cateB, run: runCateB } = useRequest(
    (meta?: API.DatabaseMetaOutput) => {
      if (meta) {
        return getCategoriesPercentageApiChartsCategoriesPost(
          {
            field: meta.cate_fields[1],
          },
          genSearchRequest(meta.id),
        );
      }
    },
    {
      manual: true
    }
  );

  const handleOnSearchAndSubmit = (
    searchValue: string,
    formData: API.SearchRequest,
    formInstance: FormInstance<any>,
    event?: tEvent,
    info?: tInfo,
    currentDbMeta?: API.DatabaseMetaOutput,
  ) => {
  };

  const handleSelectChange = (value: string) => {
    runDbTrend(value);
    const _meta = dbMetas?.find(db => db.id === value);
    runCateA(_meta);
    runCateB(_meta);
  };

  return <PageContainer>

    <Card bordered={false} style={{ margin: 25 }}>
      <Row>
        <Col sm={8} xs={24}>
          <Info title="系统项目数据库数量" value="4 座" bordered />
        </Col>
        <Col sm={8} xs={24}>
          <Info title="科研项目收录总数量" value="351,738 条" bordered />
        </Col>
        <Col sm={8} xs={24}>
          <Info title="收录数据涵盖的年份" value="2010 - 2023" />
        </Col>
      </Row>
    </Card>

    <div style={{ margin: 48, marginBottom: 36 }}>
      <SearchLite
        onSearchAndSubmit={handleOnSearchAndSubmit}
        databaseMetas={dbMetas || []}
        onSelectChange={handleSelectChange}
      />
    </div>

    <IntroduceRow
      dbTrend={ dbTrend }
      cateDataA={ cateA }
      cateDataB={ cateB }
    />

    <HotNewTopics />


  </PageContainer>

};

export default Welcome;
