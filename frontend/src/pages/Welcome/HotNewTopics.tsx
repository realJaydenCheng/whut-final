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

const testData = [
  {
      "value": 8.77077893705,
      "text": "肉眼",
      "name": "安纳萨哥拉斯"
  },
  {
      "value": 8.18364995057,
      "text": "微小",
      "name": "安纳萨哥拉斯"
  },
  {
      "value": 8.10461990121,
      "text": "大自然",
      "name": "安纳萨哥拉斯"
  },
  {
      "value": 7.69410172525,
      "text": "粒子",
      "name": "安纳萨哥拉斯"
  },
  {
      "value": 21.209681572,
      "text": "万事万物",
      "name": "普罗汀"
  },
  {
      "value": 7.48068272383,
      "text": "上帝",
      "name": "普罗汀"
  },
  {
      "value": 9.17328983326,
      "text": "赦免",
      "name": "耶稣"
  },
  {
      "value": 8.04274449749,
      "text": "拯救",
      "name": "耶稣"
  },
  {
      "value": 8.29120585679,
      "text": "递减",
      "name": "牛顿"
  },
  {
      "value": 7.9817837977,
      "text": "行星",
      "name": "牛顿"
  },
  {
      "value": 4.36834335975,
      "text": "宇宙",
      "name": "牛顿"
  },
]

const HotNewTopics = () => {
  const { styles } = useStylesB();

  const loading = false;
  const visitData = [{ x: 1, y: 1 }];
  const cardHeight = 350;

  return (
    <Row gutter={24}>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
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

          <MicroTrends color='darkblue' />

        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="热门选题"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={undefined}
          footer={undefined}
          contentHeight={cardHeight+15}
        >

          <WordCloud
            data={testData.concat(testData.concat(testData)).concat(testData)}
            colorField={"name"}
            height={cardHeight+30}
          />

        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
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

          <MicroTrends color='darkgreen' />

        </ChartCard>
      </Col>
    </Row>
  );
};
export default HotNewTopics;
