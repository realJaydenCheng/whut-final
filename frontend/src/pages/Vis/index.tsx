import { PageContainer } from "@ant-design/pro-components";
import { Card, Col, Row } from "antd";

import useStylesA from './styleA';
import { useMatch, history, Outlet } from "@umijs/max";
import SearchLite from "@/components/SearchComplex/SearchLite";

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

const tabList = [
    {
        key: "trend",
        tab: "立项趋势",
    },
    {
        key: "cate",
        tab: "分类统计",
    },
    {
        key: "hot",
        tab: "相关热词",
    },
    {
        key: "graph",
        tab: "主题图谱",
    },
    {
        key: "rec",
        tab: "潜力推荐",
    }
]

const Vis = () => {

    let match = useMatch(location.pathname);

    const headerCard = <Card bordered={false} style={{ margin: 25, padding: 25 }}>

        <SearchLite
            onSearchAndSubmit={() => { }}
            databaseMetas={[]}
            onSelectChange={() => { }}
        />

        <Row style={{ margin: 10}}>
            <Col sm={8} xs={24}>
                <Info title="关键词" value="大数据" bordered />
            </Col>
            <Col sm={8} xs={24}>
                <Info title="立项数量" value="3,686 条" bordered />
            </Col>
            <Col sm={8} xs={24}>
                <Info title="同比变化" value=" + 3.14 %" />
            </Col>
        </Row>
    </Card>

    const handleTabChange = (key: string) => {
        history.push(`/vis/${key}`);
    };

    const getTabKey = () => {
        const tabKey = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        if (tabList.find((tab) => tab.key === tabKey)) {
            return tabKey;
        } else return 'trend';
    };

    return <PageContainer
        content={headerCard}
        tabList={tabList}
        tabActiveKey={getTabKey()}
        onTabChange={handleTabChange}
        title="可视分析"
    >
        <Outlet />
    </PageContainer>

}

export default Vis;
