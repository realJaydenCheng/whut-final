import React from "react";
import SearchComplex from "@/components/SearcgComplex";
import { listDbApiDbListGet } from "@/services/ant-design-pro/listDbApiDbListGet";
import { useRequest } from "@umijs/max";

const SearchPage: React.FC<{}> = () => {

    const {data: dbMetas} = useRequest(listDbApiDbListGet);

    return <SearchComplex
        onSearch={() => { }}
        databaseMetas={dbMetas||[]}

    ></SearchComplex>;
};

export default SearchPage;
