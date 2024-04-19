import React, { useState } from "react";
import SearchComplex from "@/components/SearchComplex";
import { listDbApiDbListGet } from "@/services/ant-design-pro/listDbApiDbListGet";
import { useRequest } from "@umijs/max";

const SearchPage: React.FC<{}> = () => {

    const [dbMetas, setDbMetas] = useState<API.DatabaseMetaOutput[]>([]);
    useRequest(listDbApiDbListGet,
        {
            onSuccess: (data) => {
                setDbMetas(data||[]);
            }
        }
    );

    return <SearchComplex
        onSearch={() => { }}
        databaseMetas={dbMetas}
    />;
};

export default SearchPage;
