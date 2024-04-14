import {
  ModalForm,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, Result } from 'antd';
import type { FC } from 'react';
import useStyles from './style.style';

import TagGroup from './tagGroup';

type OperationModalProps = {
  done: boolean;
  open: boolean;
  current: Partial<API.DatabaseMetaOutput> | undefined;
  onDone: () => void;
  onSubmit: (values: API.DatabaseMetaOutput) => void;
  children?: React.ReactNode;
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const { styles } = useStyles();
  const { done, open, current, onDone, onSubmit, children } = props;
  if (!open) {
    return null;
  }
  return (

    <ModalForm<API.DatabaseMetaOutput>
      open={open}
      title={done ? null : `任务${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done
          ? {
            padding: '72px 0',
          }
          : {},
      }}
    >
      {!done ? (
        <>

          <ProFormText
            name="name"
            label="数据库名称"
            placeholder="请输入"
          />

          <ProForm.Item
            name="cate_fields"
            label="分类字段"
          >
            <TagGroup value={["分类字段0", "分类字段1"]} />
          </ProForm.Item>

          <ProForm.Item
            name="id_fields"
            label="标识字段"
          >
            <TagGroup value={["标识字段0", "标识字段1", "标识字段1"]} />
          </ProForm.Item>

          <ProForm.Item
            name="text_fields"
            label="描述字段"
          >
            <TagGroup value={["文本字段名"]} />
          </ProForm.Item>

        </>
      ) : (
        <Result
          status="success"
          title="操作成功"
          subTitle="一系列的信息描述，很短同样也可以带标点。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      )}
    </ModalForm>
  );
};
export default OperationModal;
