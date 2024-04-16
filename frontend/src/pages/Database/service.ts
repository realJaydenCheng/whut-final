// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

type BodyImportDataApiDbImportPost = {
    /** Data Files */
    data_files: File[];
    /** Db Id */
    db_id: string;
  };


/** Import Data POST /api/db/import */
async function importDataApiDbImportPost(
  body: BodyImportDataApiDbImportPost,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.ReturnMessage>('/api/db/import', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

export {
    BodyImportDataApiDbImportPost,
    importDataApiDbImportPost
}
