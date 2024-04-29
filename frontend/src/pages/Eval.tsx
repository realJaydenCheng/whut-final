import SearchLite from "@/components/SearchComplex/SearchLite";
import { Gauge, Radar, Tiny } from "@ant-design/charts";
import { PageContainer, ProCard, StatisticCard } from "@ant-design/pro-components"
import { Statistic } from "antd"
import { useState } from "react";

const Eval = () => {

    const score = 95;
    const data = {
        "新颖性": 95,
        "应用价值": 98,
        "学术价值": 92,
        "指南匹配度": 96,
        "趋势分": 94,
    }
    const description = {
        "新颖性": "新颖性评价指的是产品的可视化表现，产品的可视化表现越高，产品越新颖。",
        "应用价值": "应用价值评价指的是产品的应用价值，产品的应用价值越高，产品越富有应用价值。",
        "学术价值": "学术价值评价指的是产品的学术价值，产品的学术价值越高，产品越富有学术价值。",
        "指南匹配度": "If you need the index of the found element in the array, use findIndex().",
        "趋势分": "配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。",
    }

    const dataUsing = Object.entries(data).map(
        (e) => ({ dim: e[0], score: e[1], description: description[e[0]] })
    )

    const mainGauge = <Gauge
        data={{
            target: score,
            total: 100,
            name: 'score',
        }}
        autoFit={true}
        style={{
            textContent: (target: number, total: number) => "良好",
        }}
    />

    const mainRadar = <Radar
        data={dataUsing}
        xField="dim"
        yField="score"
        area={{
            style: {
                fillOpacity: 0.2,
            },
        }}
        scale={{
            x: {
                padding: 1,
                align: 0,
            },
            y: {
                nice: true,
            },
        }}
        axis={{
            x: {
                title: false,
                grid: true,
                labelFontSize: 24,
                labelFontWeight: 700,
                labelSpacing: 10,
                labelFormatter: (label: string, index: number) => `${label}\n${data[label]}`
            },
            y: {
                gridAreaFill: 'rgba(0, 0, 0, 0.04)',
                label: false,
                title: false,
            },
        }}
    />

    const subCard = (score: number, label: string, description: string) => {

        const subRing = <Tiny.Ring
            percent={score / 100}
            width={100}
            height={100}
            color={['#E8EFF5', '#66AFF4']}
            annotations={[
                {
                    type: 'text',
                    style: {
                        text: score.toFixed(2),
                        x: '50%',
                        y: '50%',
                        textAlign: 'center',
                        fontSize: 14,
                    },
                },
            ]}
        />
        return <StatisticCard
            statistic={{
                title: label,
                value: score,
                suffix: '分',
                description
            }}
            loading={false}
            chartPlacement="left"
            chart={subRing}
            key={label}
        />
    }

    return <PageContainer>

        <SearchLite
            onSearchAndSubmit={() => { }}
            databaseMetas={[]}
            onSelectChange={() => { }}
        />

        <ProCard
            title="主题：基于深度学习的自然语言处理小系统"
            extra="数据库：国家大创数据库"
            split='horizontal'
            headerBordered
            bordered
        >
            <ProCard split="vertical">

                <StatisticCard
                    statistic={{
                        value: score,
                        suffix: '分',
                        title: "总体评分"
                    }}
                    loading={false}
                    chart={mainGauge}
                />

                <StatisticCard
                    title="维度评分"
                    loading={false}
                    chart={mainRadar}
                />

            </ProCard>

            <ProCard split="horizontal">
                <ProCard split="vertical">

                    {
                        dataUsing.slice(0, 3).map((item) => {
                            return subCard(item.score, item.dim, item.description);
                        })
                    }

                </ProCard>
                <ProCard split="vertical">

                    {
                        dataUsing.slice(3, 5).map((item) => {
                            return subCard(item.score, item.dim, item.description);
                        })
                    }

                    <ProCard />

                </ProCard>
            </ProCard>
        </ProCard>
    </PageContainer>
}

export default Eval
