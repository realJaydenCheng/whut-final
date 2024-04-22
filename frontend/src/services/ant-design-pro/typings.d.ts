declare namespace API {
  type BodyImportDataApiDbImportPost = {
    /** Data Files */
    data_files: string[] | string;
    /** Db Id */
    db_id: string;
  };

  type CatePercent = {
    /** Cate */
    cate: string;
    /** Percentage */
    percentage: number;
    /** Value */
    value: number;
  };

  type createDbApiDbCreatePostParams = {
    user_id?: string;
  };

  type DatabaseMetaDetail = {
    /** Id */
    id: string;
    /** Name */
    name: string;
    /** Title Field */
    title_field: string;
    /** Time Field */
    time_field: string;
    /** Id Fields */
    id_fields: string[];
    /** Text Fields */
    text_fields: string[];
    /** Cate Fields Detail */
    cate_fields_detail: Record<string, any>;
    /** Date Range */
    date_range: any[] | null;
  };

  type DatabaseMetaInput = {
    /** Name */
    name: string;
    /** Org Name */
    org_name: string;
    /** Title Field */
    title_field: string;
    /** Time Field */
    time_field: string;
    /** Cate Fields */
    cate_fields: string[];
    /** Id Fields */
    id_fields: string[];
    /** Text Fields */
    text_fields?: string[];
  };

  type DatabaseMetaOutput = {
    /** Id */
    id: string;
    /** User Id */
    user_id: string;
    /** Create Time */
    create_time: string;
    /** Name */
    name: string;
    /** Org Name */
    org_name: string;
    /** Title Field */
    title_field: string;
    /** Time Field */
    time_field: string;
    /** Cate Fields */
    cate_fields: string[];
    /** Id Fields */
    id_fields: string[];
    /** Text Fields */
    text_fields: string[];
    /** User Name */
    user_name: string;
  };

  type deleteDbApiDbDeletePostParams = {
    db_id: string;
    user_id?: string;
  };

  type getCategoriesPercentageApiChartsCategoriesPostParams = {
    field: string;
  };

  type getDbDetailApiDbDetailGetParams = {
    db_id: string;
  };

  type HTTPValidationError = {
    /** Detail */
    detail?: ValidationError[];
  };

  type listDbApiDbListGetParams = {
    user_id?: string;
  };

  type ReturnMessage = {
    /** Message */
    message: string;
    /** Status */
    status: boolean;
  };

  type SearchedData = {
    /** Data */
    data: Record<string, any>[];
    /** Total */
    total: number;
  };

  type SearchRequest = {
    /** Db Id */
    db_id: string;
    /** Terms */
    terms: string[] | null;
    /** Date Range */
    date_range: any[] | null;
    /** Filters */
    filters: Record<string, any> | null;
    /** Sub Terms */
    sub_terms: Record<string, any> | null;
    /** Page */
    page: number | null;
    /** Page Size */
    page_size: number | null;
  };

  type TimeSeriesStat = {
    /** Dates */
    dates: number[];
    /** Values */
    values: (number | number)[];
    /** Percentages */
    percentages: (number | number)[];
    /** Deltas */
    deltas: (number | number)[];
    /** Rates */
    rates: (number | number)[];
  };

  type User = {
    /** Id */
    id: string;
    /** Password Hash */
    password_hash: string;
    /** Name */
    name: string;
    /** Privilege */
    privilege: number;
    /** Org Name */
    org_name?: string | null;
  };

  type UserLoginInput = {
    /** Id */
    id: string;
    /** Password Hash */
    password_hash: string;
  };

  type ValidationError = {
    /** Location */
    loc: (string | number)[];
    /** Message */
    msg: string;
    /** Error Type */
    type: string;
  };
}
