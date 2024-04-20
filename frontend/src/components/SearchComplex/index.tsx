import React, { useState, useEffect } from "react";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import StandardFormRow from "./StandardFormRow";
import TagSelect from "./TagSelect";
import { useRequest } from "@umijs/max";
import { getDbDetailApiDbDetailGet } from "@/services/ant-design-pro/getDbDetailApiDbDetailGet";
import FormItem from "antd/es/form/FormItem";
import { ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { listDbApiDbListGet } from "@/services/ant-design-pro/listDbApiDbListGet";
import { from } from "form-data";

type tEvent = React.ChangeEvent<HTMLInputElement> |
    React.MouseEvent<HTMLElement> |
    React.KeyboardEvent<HTMLInputElement> | undefined;

type tInfo = { source?: 'clear' | 'input'; } | undefined

interface SearchComplexProps {
    onSearchAndSubmit: (
        searchValue: string,
        formData: API.SearchRequest,
        formInstance: FormInstance<any>,
        event?: tEvent,
        info?: tInfo,
    ) => void;
    databaseMetas: API.DatabaseMetaOutput[]
}

const SearchComplex: React.FC<SearchComplexProps> = (props) => {

    const [selectOptions, setSelectOptions] = useState<{ label: string, value: string }[]>([]);
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
                <StandardFormRow key={field_name} title={field_name} block style={{ padding: 0, marginTop: 0, marginBottom: 3 }}>
                    <FormItem name={`cateField-${field_name}`} style={{ padding: 0, marginTop: 0, marginBottom: 3 }}>
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

        const genNode = (fieldCate: string, field_name: string) => {
            return <FormItem
                name={`${fieldCate}-${field_name}`}
                label={field_name}
                style={{ marginBottom: 3 }}
                // see: https://sentry.io/answers/unique-key-prop/
                key={field_name}
            >
                <Input size="small" style={{ width: '80%' }} />
            </FormItem>
        }

        let nodes: React.ReactNode[] = [];

        nodes = nodes.concat(detail?.id_fields.map((field_name) => {
            return genNode("idField", field_name);
        }));
        nodes = nodes.concat(detail?.text_fields.map((field_name) => {
            return genNode("textField", field_name);
        }));

        setOtherFieldsTexts(nodes);
    };

    const [form] = Form.useForm();
    const pairs = new Map<string, string>(Object.entries({
        "cateField": "filters",
        "idField": "sub_terms",
        "textField": "sub_terms",
    }));
    const extractCombinedToNestedObj = (
        prefixTargetPairs: Map<string, string>,
        data: object,
    ) => {
        const res: any = {};
        for (const [key, value] of Object.entries(data)) {
            // Split key into prefix and realKey using the '-' delimiter
            const [prefix, realKey] = key.split('-');
            // Find the corresponding target based on the prefix
            const target = prefixTargetPairs.get(prefix);
            if (target != undefined) {
                // If the target does not exist in res, initialize it as an empty object
                if (!res[target]) {
                    res[target] = {};
                }
                // Assign the value to the correct target and realKey
                if (value instanceof String) {
                    res[target][realKey] = value.split(" ");
                } else if (value instanceof Array) {
                    res[target][realKey] = value;
                }
                
            }
        }
        return res;
    };
    const searchToSubmit = (value: string, event: tEvent, info: tInfo) => {
        const formData = form.getFieldsValue(true);
            const nestedDate = extractCombinedToNestedObj(pairs, formData)
            const searchRequest: API.SearchRequest = {
                terms: (formData["terms"] as string).split(" "),
                db_id: formData["db_id"],
                date_range: null,  //FIXME: implement data range.
                filters: nestedDate["filters"],
                sub_terms: nestedDate["sub_terms"],
            }
        props.onSearchAndSubmit(value, searchRequest, form, event, info);
    };

    return (
        <Form form={form}>
            <div style={{ textAlign: 'center' }}>
                <Row>

                    <Col span={5} offset={5}>
                        <FormItem name="db_id" initialValue='65e94e64-e526-4298-981b-8168eb142605'>
                            <Select  // FIXME: need to add dynamic default values.
                                // initValue and defaultValue are not working.
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
                                onSearch={searchToSubmit}
                                style={{ width: '90%' }}
                            />
                        </FormItem>
                    </Col>

                </Row>
            </div>

            {cateFieldsTagSelects}

            <Row>{otherFieldsTexts}</Row>

        </Form>

    );
};

export default SearchComplex;
