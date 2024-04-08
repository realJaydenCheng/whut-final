// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Get Db GET /api/db/${param0} */
export async function getDbApiDbDbIdGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDbApiDbDbIdGetParams,
  options?: { [key: string]: any },
) {
  const { db_id: param0, ...queryParams } = params;
  return request<API.DatabaseMeta>(`/api/db/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
