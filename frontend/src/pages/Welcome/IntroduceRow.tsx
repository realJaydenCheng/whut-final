import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Bar, Column, Pie, Treemap } from '@ant-design/charts';
import { Col, Progress, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import type { DataItem } from './data.d';
import useStylesB from './style.B';

import { ChartCard, Field } from './Charts';
import Trend from './Trend';
import { Children } from 'react';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};
const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: DataItem[] }) => {
  const { styles } = useStylesB();

  console.log(visitData)

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="数据库数据量"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => "126,560 条"}
          footer={<Field label="当年数据" value={`12,423 条`} />}
          contentHeight={46}
        >
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            年数据量同比
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            平均数量相比
            <span className={styles.trendText}>11%</span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="总体立项趋势"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={`12,423 条`}
          footer={<Field label="总量" value={"126,560 条"} />}
          contentHeight={46}
        >
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={46}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-25}
            data={visitData}
          />

        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="立项类型占比"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={`26.12 %`}
          footer={"222  232  323 "}
          contentHeight={46}
        >
          <Column 
          data={visitData} 
          height={46} 
          padding={-25}
          yField="y" xField="x" 
          axis={false}
          />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="学科分类占比"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend
                flag="up"
                style={{
                  marginRight: 16,
                }}
              >
                周同比
                <span className={styles.trendText}>12%</span>
              </Trend>
              <Trend flag="down">
                日同比
                <span className={styles.trendText}>11%</span>
              </Trend>
            </div>
          }
          total={"31.41%"}
          contentHeight={46}
        >
          <Treemap
            data={
              {
                name: "root",
                children: visitData.map((e)=>({
                  name: e.x,
                  value: e.y,
                })).slice(0, 5),
              }
            } 
            height={46} 
            padding={-25}
            valueField="value" colorField="value" 
            legend={false}
          />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
