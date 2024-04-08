declare namespace API {
  type createDbApiDbCreatePostParams = {
    user_id?: string;
  };

  type DatabaseMeta = {
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
    text_fields: string[];
  };

  type deleteDbApiDbDeletePostParams = {
    db_id: string;
    user_id?: string;
  };

  type getDbApiDbDbIdGetParams = {
    db_id: string;
    user_id?: string;
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
