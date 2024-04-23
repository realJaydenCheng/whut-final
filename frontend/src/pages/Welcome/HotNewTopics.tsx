import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Bar, Column, Pie, Treemap, WordCloud } from '@ant-design/charts';
import { Col, Progress, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import type { DataItem } from './data.d';
import useStylesB from './style.B';

import { ChartCard, Field } from './Charts';
import Trend from './Trend';
import MicroTrends from './MicroTrends';

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
  style: {
    marginBottom: 24,
  },
};

interface HotNewTopicsProps {
  newTrends?: Record<string, any>,
  wordsCloudData?: Record<string, any>[],
  hotTrends?: Record<string, any>,
}

const cardHeight = 380;

const HotNewTopics = ({
  newTrends,
  wordsCloudData,
  hotTrends,
}: HotNewTopicsProps) => {

  return (
    <Row gutter={24}>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={newTrends ? false : true}
          title="新兴研究"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={undefined}
          footer={undefined}
          contentHeight={cardHeight}
        >

          <MicroTrends color='orange' dataMap={newTrends || {}} />

        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={wordsCloudData ? false : true}
          title="热门选题"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={undefined}
          footer={undefined}
          contentHeight={cardHeight + 15}
        >

          <WordCloud
            data={wordsCloudData}
            colorField={"text"}
            height={cardHeight + 30}
          />

        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={hotTrends ? false : true}
          bordered={false}
          title="立项趋势"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          footer={undefined}
          total={undefined}
          contentHeight={cardHeight}
        >

          <MicroTrends color='green' dataMap={hotTrends || {}} />

        </ChartCard>
      </Col>
    </Row>
  );
};
export default HotNewTopics;
