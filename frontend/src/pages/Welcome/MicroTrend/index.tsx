import { Tiny } from "@ant-design/charts";
import { Col, Row } from "antd";
import Trend from "../Trend";

const TrendRow: React.FC<{}> = () => {
    const data = [
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467,
    ].map((value, index) => ({ value, index }));
    const config = {
        data,
        height: 30,
        width: 120,
        // padding: 8,
        shapeField: 'smooth',
        xField: 'index',
        yField: 'value',
        style: {
            fill: 'linear-gradient(-90deg, white 0%, darkgreen 100%)',
            fillOpacity: 0.6,
        },
    };

    return <Row style={{margin: 30}}>

        <Col span={5} style={{fontSize: 18}}> 主题词 </Col>

        <Col span={5} style={{fontSize: 18}}> 168 </Col>

        <Col span={9}>
            <Tiny.Area {...config} />
        </Col>

        <Col span={5} style={{fontSize: 18}}>
            <Trend flag="up"> 12 % </Trend>
        </Col>

    </Row>
}

const MicroTrend: React.FC<{}> = () => {
    const cnt = [1,2,3,4,5,6,]
    return <>
        {cnt.map(()=><TrendRow/>)}
    </>
}

export default MicroTrend;
