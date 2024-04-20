import React, { useState } from "react";
import SearchComplex from "@/components/SearchComplex";
import { listDbApiDbListGet } from "@/services/ant-design-pro/listDbApiDbListGet";
import { useRequest } from "@umijs/max";
import { getSearchResultApiSearchPost } from "@/services/ant-design-pro/getSearchResultApiSearchPost";
import { Pagination, Table, TableProps } from "antd";
import { max } from "lodash";

const SearchPage: React.FC<{}> = () => {

    const [dbMetas, setDbMetas] = useState<API.DatabaseMetaOutput[]>([]);
    const [currentMeta, setCurrentMeta] = useState<API.DatabaseMetaOutput>();
    const [cFormData, setCFormData] = useState<API.SearchRequest>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useRequest(listDbApiDbListGet,
        {
            onSuccess: (data) => {
                setDbMetas(data || []);
            }
        }
    );

    const { run: postForm, loading, data } = useRequest(
        (searchRequest: API.SearchRequest) => getSearchResultApiSearchPost(searchRequest),
        {
            manual: true,
        }
    );

    const textCols = currentMeta?.text_fields.map((field_name) => ({
        title: field_name,
        dataIndex: field_name,
        key: field_name,
    })) || [];
    const idCols = currentMeta?.id_fields.map((field_name) => ({
        title: field_name,
        dataIndex: field_name,
        key: field_name,
    })) || [];
    const cateCols = currentMeta?.cate_fields.map((field_name) => ({
        title: field_name,
        dataIndex: field_name,
        key: field_name,
    })) || [];
    const mainCols = currentMeta ? [
        {
            title: currentMeta.title_field,
            dataIndex: currentMeta.title_field,
            key: currentMeta.title_field,
            width: 200,
            ellipsis: true,
            textWrap: 'word-break',
            fixed: true
        },
        {
            title: currentMeta.time_field,
            dataIndex: currentMeta.time_field,
            key: currentMeta.time_field,
        }
    ] : []
    const columns: TableProps['columns'] = mainCols.concat(idCols).concat(cateCols).concat(textCols);

    
    return <>

        <SearchComplex
            onSearchAndSubmit={(value, formData, form, event, info, databaseMeta) => {
                postForm({
                    ...formData,
                    page: page,
                    page_size: pageSize,
                });
                setCFormData(formData);
                setCurrentMeta(databaseMeta);
            }}
            databaseMetas={dbMetas}
        />

        <Table
            pagination={{
                total: data?.total,
                showTotal: (total) => `共检索到 ${total} 条数据`,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: (p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                    postForm({
                        ...cFormData!,
                        page: p,
                        page_size: ps,
                    });
                }
            }}
            dataSource={data?.data}
            scroll={{ x: "max-content" }}
            loading={loading}
            columns={columns}
            showHeader
            style={{marginTop: 20}}
            
        />


    </>;
};

export default SearchPage;
