import { Col, Input, Row, Select } from "antd";
import React from "react";
import StandardFormRow from "./StandardFormRow";
import FormItem from "antd/es/form/FormItem";
import TagSelect from "./TagSelect";

interface SearchComplexProps {
    onSearch: (
        value: string,
        event?: React.ChangeEvent<HTMLInputElement> |
            React.MouseEvent<HTMLElement> |
            React.KeyboardEvent<HTMLInputElement>,
        info?: {
            source?: 'clear' | 'input';
        }
    ) => void;
    databaseMetas: API.DatabaseMetaOutput[]
}


const SearchComplex: React.FC<SearchComplexProps> = (props) => {

    const categoryOptions = "森es 割让 可能 上传 是吧 绰号吃 触笔 抽势必 笔嗲ad".split(" ");
    const selectOptions = props.databaseMetas.map((meta)=>{
        return {
            label: meta.name,
            value: meta.id,
        }
    })

    return <>

        <div style={{ textAlign: 'center' }}>
            <Row>
                <Col span={4}></Col>
                <Col span={3}>
                    <FormItem name="db_id">
                        <Select
                            size="large"
                            defaultValue={selectOptions[0]?.value}
                            options={selectOptions}
                        />
                    </FormItem>
                </Col>
                <Col span={10}>
                    <FormItem name="terms">
                        <Input.Search
                            placeholder="请输入"
                            enterButton="搜索"
                            size="large"
                            onSearch={props.onSearch}
                            style={{width: '90%' }}
                        />
                    </FormItem>

                </Col>
            </Row>


        </div>

        <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
            <FormItem name="category">
                <TagSelect expandable>
                    {categoryOptions.map((category) => (
                        <TagSelect.Option value={category} key={category}>
                            {category}
                        </TagSelect.Option>
                    ))}
                </TagSelect>
            </FormItem>
        </StandardFormRow>

    </>
}

export default SearchComplex;