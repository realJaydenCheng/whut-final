import React, { useState } from "react";
import SearchComplex from "@/components/SearchComplex";
import { listDbApiDbListGet } from "@/services/ant-design-pro/listDbApiDbListGet";
import { useRequest } from "@umijs/max";
import { getSearchResultApiSearchPost } from "@/services/ant-design-pro/getSearchResultApiSearchPost";

const SearchPage: React.FC<{}> = () => {

    const [dbMetas, setDbMetas] = useState<API.DatabaseMetaOutput[]>([]);

    useRequest(listDbApiDbListGet,
        {
            onSuccess: (data) => {
                setDbMetas(data || []);
            }
        }
    );

    const {run: postForm} = useRequest(
        (searchRequest: API.SearchRequest) => getSearchResultApiSearchPost(searchRequest),
        {
            manual: true,
        }
    )

    return <SearchComplex
        onSearchAndSubmit={(value, formData, form, event, info) => {
            postForm(formData);
        }}
        databaseMetas={dbMetas}
    />;
};

export default SearchPage;
