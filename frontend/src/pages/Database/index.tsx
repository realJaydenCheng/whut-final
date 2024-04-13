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
import OperationModal from './components/OperationModal';
import type { BasicListItemDataType } from './data.d';
import { addFakeList, removeFakeList, updateFakeList } from './service';
import useStyles from './style.style';

import { listDbApiDbListGet } from '@/services/ant-design-pro/listDbApiDbListGet';
import { deleteDbApiDbDeletePost } from '@/services/ant-design-pro/deleteDbApiDbDeletePost';
import { createDbApiDbCreatePost } from '@/services/ant-design-pro/createDbApiDbCreatePost';
import { getDbApiDbDbIdGet } from '@/services/ant-design-pro/getDbApiDbDbIdGet';


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

const ListContent = (data: API.DatabaseMeta) => {
  const { styles } = useStyles();
  return (
    <div>
      <div className={styles.listContentItem}>
        <span>Owner</span>
        <p>{data.user_id}</p>
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

const databaseMetaToDescription = (item: API.DatabaseMeta) => {
  return `${item.name}`;
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
    params,
    mutate,
  } = useRequest<API.DatabaseMeta[]>(listDbApiDbListGet,);

  const { run: postRun } = useRequest(
    (method, params) => {
      if (method === 'remove') {
        return removeFakeList(params);
      }
      if (method === 'update') {
        return updateFakeList(params);
      }
      return addFakeList(params);
    },
    {
      manual: true,
      // onSuccess: (result) => {
      //   mutate(result);
      // },
    },
  );

  const list = listData || [];

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: list.length,
  };

  const showEditModal = (item: API.DatabaseMeta) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    postRun('remove', {
      id,
    });
  };

  const editAndDelete = (key: string | number, currentItem: API.DatabaseMeta) => {
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
    item: API.DatabaseMeta;
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

  const handleSubmit = (values: API.DatabaseMeta) => {
    setDone(true);
    const method = values?.id ? 'update' : 'add';
    postRun(method, values);
  };

  const renderListItem = (item: API.DatabaseMeta) => {
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
        />

        {/* https://stackoverflow.com/questions/59969756/not-assignable-to-type-intrinsicattributes-intrinsicclassattributes-react-js */}
        <ListContent {...item} />

      </List.Item>
    )

  }

  console.log("loading", loading);
  console.log("params", params);
  console.log("listData", listData);
  console.log("list", list);

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
