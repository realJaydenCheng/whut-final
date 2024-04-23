import { Tiny } from "@ant-design/charts";
import { Col, Row } from "antd";
import Trend from "../Trend";
import { fill } from "lodash";

const TrendRow  = ({
    color,
    data,
    word,
}:{
    color: string
    data: API.TimeSeriesStat,
    word: string,
}) => {

    const dataArray = data.values.map((v,i)=>({
        value: v,
        date: data.dates[i],
    }));
    const per = data.percentages[dataArray.length - 2];
    const flag = per > 0 ? 'up' : 'down';

    const config = {
        data: dataArray,
        height: 30,
        width: 150,
        shapeField: 'smooth',
        xField: 'date',
        yField: 'value',
        color: color,
        style: {
            lineWidth: 3,
            stroke: color,
        },
        axis: false,
    };

    console.log(dataArray);

    return <Row style={{ marginBottom: 25, textAlign: 'center' }}>

        <Col span={5} style={{ fontSize: 18, whiteSpace: "nowrap"}}> {word} </Col>

        <Col span={5} style={{ fontSize: 18 }}> {dataArray[dataArray.length-1].value} </Col>

        <Col span={9}>
            <Tiny.Line {...config} />
        </Col>

        <Col span={5} style={{ fontSize: 18 }}>
            <Trend flag={flag}> {per.toFixed(2)} % </Trend>
        </Col>

    </Row>
}



const MicroTrends = ({
    color,
    dataMap,
}:{
    color: string,
    dataMap: Record<string, any>,
}) => {
    
    return <>
        <Row style={{ marginBottom: 25, textAlign: "center", marginTop: 15 }}>

            <Col span={5} style={{ fontSize: 18 }}> <b>主题词</b> </Col>

            <Col span={5} style={{ fontSize: 18 }}> <b>今年立项</b> </Col>

            <Col span={9} style={{ fontSize: 18 }}> <b>立项趋势</b> </Col>

            <Col span={5} style={{ fontSize: 18 }}> <b>同比变化</b> </Col>

        </Row>
        {Object.entries(dataMap).slice(0,6).map((e, i) => <TrendRow color={color} key={i} data={e[1]} word={e[0]} />)}
    </>
}

export default MicroTrends;
