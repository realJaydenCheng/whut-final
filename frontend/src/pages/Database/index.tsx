import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Dropdown,
  Input,
  List,
  Modal,
  Progress,
} from 'antd';
import dayjs from 'dayjs';
import type { FC } from 'react';
import React, { useState } from 'react';
import OperationModal from './OperationModal';
import type { BasicListItemDataType } from './data.d';
import useStyles from './style.style';

import cookie from 'react-cookies'

import { listDbApiDbListGet } from '@/services/ant-design-pro/listDbApiDbListGet';
import { deleteDbApiDbDeletePost } from '@/services/ant-design-pro/deleteDbApiDbDeletePost';
import { createDbApiDbCreatePost } from '@/services/ant-design-pro/createDbApiDbCreatePost';


const { Search } = Input;

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => {
  const { styles } = useStyles();
  return (
    <div className={styles.headerInfo}>
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em />}
    </div>
  );
};

const ListContent = (data: API.DatabaseMetaOutput) => {
  const { styles } = useStyles();
  return (
    <div>
      <div className={styles.listContentItem}>
        <span>创建用户</span>
        <p>{data.user_name}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>创建时间</span>
        <p> {data.create_time} </p>
      </div>
      <div className={styles.listContentItem}>
      </div>
    </div>
  );
};

const databaseMetaToDescription = (item: API.DatabaseMetaOutput) => {
  // return `${item.id}：` +
  // `创建用户：${item.user_name}（${item.user_id}）；` +
  // `创建时间：${item.create_time}；` + 
  // `所属组织：${item.org_name}；标题字段：${item.title_field}，时间字段：${item.time_field}；` +
  // `分类字段：${item.cate_fields.join("、")}；` +
  // `标识字段：${item.id_fields.join("、")}；` +
  // `描述字段：${item.text_fields.join("、")}`

  return `所属组织：${item.org_name}; ` + 
  `分类字段：${item.cate_fields.join("、")}; ` +
  `描述字段：${item.text_fields.join("、")}; `
}


export const BasicList: FC = () => {

  const { styles } = useStyles();
  const [done, setDone] = useState<boolean>(false);
  const [open, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BasicListItemDataType> | undefined>(undefined);

  // see:
  // https://ahooks.js.org/zh-CN/hooks/use-request/basic/#%E7%AB%8B%E5%8D%B3%E5%8F%98%E6%9B%B4%E6%95%B0%E6%8D%AE
  const {
    data: listData,
    loading,
  } = useRequest<API.DatabaseMetaOutput[]>(listDbApiDbListGet,);

  const list = listData || [];

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: list.length,
  };

  const showEditModal = (item: API.DatabaseMetaOutput) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    deleteDbApiDbDeletePost({ db_id: id });
  };

  const editAndDelete = (key: string | number, currentItem: API.DatabaseMetaOutput) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该任务吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };

  const extraContent = (
    <div>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: API.DatabaseMetaOutput;
  }> = ({ item }) => (
    <Dropdown
      menu={{
        onClick: ({ key }) => editAndDelete(key, item),
        items: [
          {
            key: 'edit',
            label: '编辑',
          },
          {
            key: 'delete',
            label: '删除',
          },
        ],
      }}
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent({});
  };

  const handleSubmit = (values: API.DatabaseMetaOutput) => {
    setDone(true);
    const method = values?.id ? 'update' : 'add';
    const user_id = cookie.load("user_id")
    createDbApiDbCreatePost({ user_id }, values)
  };

  const renderListItem = (item: API.DatabaseMetaOutput) => {
    return (
      <List.Item
        actions={[
          <a
            key="edit"
            onClick={(e) => {
              e.preventDefault();
              showEditModal(item);
            }}
          >
            编辑
          </a>,
          <MoreBtn key="more" item={item} />,
        ]}
      >
        <List.Item.Meta
          title={item.name}
          description={databaseMetaToDescription(item)}
          style={{
            overflow: "hidden"
          }}
        />

        {/* https://stackoverflow.com/questions/59969756/not-assignable-to-type-intrinsicattributes-intrinsicclassattributes-react-js */}
        <ListContent {...item} />

      </List.Item>
    )

  }

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="详细列表"
            style={{
              marginTop: 24,
            }}
            styles={{
              body: {
                padding: '0 32px 40px 32px',
              }
            }}
            extra={extraContent}
          >

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={renderListItem}
            />

          </Card>
        </div>
      </PageContainer>

      <Button
        type="dashed"
        onClick={() => {
          setVisible(true);
        }}
        style={{
          width: '100%',
          marginBottom: 8,
        }}
      >
        <PlusOutlined />
        添加
      </Button>

      <OperationModal
        done={done}
        open={open}
        current={current}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />

    </div>
  );

};

export default BasicList;
