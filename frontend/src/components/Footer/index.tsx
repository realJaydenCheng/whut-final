import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (

    <DefaultFooter

      style={{
        background: 'none',
      }}

      links={[
        {
          key: '武汉理工大学毕业设计',
          title: '武汉理工大学毕业设计',
          href: 'https://www.whut.edu.cn/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <><GithubOutlined /> Jayden Cheng </>,
          href: 'https://github.com/realJaydenCheng',
          blankTarget: true,
        }
      ]}

      copyright={
        <a href='https://blog.csdn.net/JaydenCheng'>
          信息管理与信息系统2002班 程嘉豪</a>
      }

    />

  );
};

export default Footer;
