import React, { useState, useEffect } from "react";
import { Col, Input, Row, Select } from "antd";
import StandardFormRow from "./StandardFormRow";
import TagSelect from "./TagSelect";
import { useRequest } from "@umijs/max";
import { getDbDetailApiDbDetailGet } from "@/services/ant-design-pro/getDbDetailApiDbDetailGet";
import FormItem from "antd/es/form/FormItem";
import { ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { listDbApiDbListGet } from "@/services/ant-design-pro/listDbApiDbListGet";

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

    const [selectOptions, setSelectOptions] = useState<{label: string, value: string}[]>([]);
    const [selectedDbId, setSelectedDbId] = useState<string>();
    const [cateFieldsTagSelects, setCateFieldsTagSelects] = useState<React.ReactNode[]>([]);
    const [otherFieldsTexts, setOtherFieldsTexts] = useState<React.ReactNode[]>([]);

    const { run: fetchDbDetails } = useRequest(getDbDetailApiDbDetailGet, {
        manual: true,
        onSuccess: (data) => {
            renderCateFieldsTagSelects(data);
            renderOtherFieldsText(data);
        }
    });

    useEffect(() => {
        if (props.databaseMetas.length > 0) {
            setSelectedDbId(props.databaseMetas[0].id);
            setSelectOptions(props.databaseMetas.map(
                (meta) => ({ label: meta.name, value: meta.id })
            ));
            fetchDbDetails({ db_id: props.databaseMetas[0].id });
            console.log("selectedDbId: ", selectedDbId);
            console.log("props.databaseMetas[0].id: ", props.databaseMetas[0].id);
        }
    }, [props.databaseMetas]);

    const handleDbSelectChange = (value: string) => {
        setSelectedDbId(value);
        fetchDbDetails({ db_id: value });
    };

    const renderCateFieldsTagSelects = (detail: API.DatabaseMetaDetail) => {
        const nodes = [];
        for (const field_name in detail?.cate_fields_detail) {
            const categoryOptions = detail?.cate_fields_detail[field_name];
            nodes.push(
                <StandardFormRow title={field_name} block style={{ padding: 0, marginTop: 0, marginBottom: 3 }}>
                    <FormItem name={field_name} style={{ padding: 0, marginTop: 0, marginBottom: 3 }}>
                        <TagSelect expandable>
                            {categoryOptions.map((category: string) => (
                                <TagSelect.Option value={category} key={category}>
                                    {category}
                                </TagSelect.Option>
                            ))}
                        </TagSelect>
                    </FormItem>
                </StandardFormRow>
            );
        }
        setCateFieldsTagSelects(nodes);
    };
    const renderOtherFieldsText = (detail: API.DatabaseMetaDetail) => {
        const fields = detail?.id_fields.concat(detail?.text_fields);
        // TODO: remove duplicated field_name in fields
        const nodes = fields?.map((field_name) => {
            return <FormItem name={field_name} label={field_name} style={{ marginBottom: 3 }}>
                <Input size="small" style={{ width: '80%' }} />
            </FormItem>

        }) || [];
        setOtherFieldsTexts(nodes);
    }

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <Row>

                    <Col span={5} offset={5}>
                        <FormItem name="db_id" initialValue={selectedDbId}>
                            <Select
                                size="large"
                                value={selectedDbId}
                                options={selectOptions}
                                onChange={handleDbSelectChange}
                            />
                        </FormItem>
                    </Col>

                    <Col span={11}>
                        <FormItem name="terms">
                            <Input.Search
                                placeholder="请输入"
                                enterButton="搜索"
                                size="large"
                                onSearch={props.onSearch}
                                style={{ width: '90%' }}
                            />
                        </FormItem>
                    </Col>

                </Row>
            </div>

            {cateFieldsTagSelects}

            <Row>{otherFieldsTexts}</Row>

        </>

    );
};

export default SearchComplex;
