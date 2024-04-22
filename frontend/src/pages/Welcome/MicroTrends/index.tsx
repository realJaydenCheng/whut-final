import { Tiny } from "@ant-design/charts";
import { Col, Row } from "antd";
import Trend from "../Trend";

const TrendRow: React.FC<{ color: string }> = (props) => {
    const data = [
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467,
    ].map((value, index) => ({ value, index }));
    const config = {
        data,
        height: 30,
        width: 150,
        // padding: 8,
        shapeField: 'smooth',
        xField: 'index',
        yField: 'value',
        style: {
            fill: `linear-gradient(-90deg, white 0%, ${props.color} 100%)`,
            fillOpacity: 0.6,
        },
    };

    return <Row style={{ marginBottom: 25, textAlign: 'center' }}>

        <Col span={5} style={{ fontSize: 18 }}> 主题词 </Col>

        <Col span={5} style={{ fontSize: 18 }}> 168 </Col>

        <Col span={9}>
            <Tiny.Area {...config} />
        </Col>

        <Col span={5} style={{ fontSize: 18 }}>
            <Trend flag="up"> 12 % </Trend>
        </Col>

    </Row>
}



const MicroTrends: React.FC<{
    color: string
}> = (props) => {
    const cnt = [1, 2, 3, 4, 5, 6,]
    return <>
        <Row style={{ marginBottom: 25, textAlign: "center", marginTop: 15 }}>

            <Col span={5} style={{ fontSize: 18 }}> <b>主题词</b> </Col>

            <Col span={5} style={{ fontSize: 18 }}> <b>今年立项</b> </Col>

            <Col span={9} style={{ fontSize: 18 }}> <b>立项趋势</b> </Col>

            <Col span={5} style={{ fontSize: 18 }}> <b>同比变化</b> </Col>

        </Row>
        {cnt.map((i) => <TrendRow color={props.color} key={i} />)}
    </>
}

export default MicroTrends;
