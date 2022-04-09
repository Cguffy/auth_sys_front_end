import { EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Card, Row, Col, Space, Descriptions } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import styles from './index.less';
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { query } from '@/utils/query';

enum TabKey {
  SelfInfo = 'self_info',
  PwdChange = 'password_change',
}

enum SelfInfoMode {
  Read = 'read',
  Edit = 'edit',
}

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [activeTabKey, setActiveTabKey] = useState(TabKey.SelfInfo);
  const [selfInfoMode, setSelfInfoMode] = useState(SelfInfoMode.Read);
  // const [userInfo, setUserInfo] = useState<Record<string, any>>({});
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [realname, setRealname] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const getUserInfo = async () => {
    const url = '/user/info';
    const { userInfo } = await query(url, {
      method: 'POST',
    });
    setUserName(userInfo.username);
    setPassword(userInfo.password);
    setRealname(userInfo.realname);
    setNickname(userInfo.nickname);
    setPhone(userInfo.phone);
    setEmail(userInfo.email);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const contentList = (key: TabKey) => {
    if (key === TabKey.SelfInfo) {
      if (selfInfoMode === SelfInfoMode.Read) {
        return (
          <Card
            className={styles.selfinfo_card}
            hoverable={true}
            title="基础信息"
            extra={<a onClick={() => setSelfInfoMode(SelfInfoMode.Edit)}>编辑</a>}
            onClick={() => setSelfInfoMode(SelfInfoMode.Edit)}
            style={{ width: '100%' }}
          >
            <Descriptions title={false} layout="vertical">
              <Descriptions.Item label="用户名">{username}</Descriptions.Item>
              <Descriptions.Item label="昵称">{nickname}</Descriptions.Item>
              <Descriptions.Item label="真实姓名">{realname}</Descriptions.Item>
              <Descriptions.Item label="手机号" span={2}>
                {phone}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">{email}</Descriptions.Item>
            </Descriptions>
          </Card>
        );
      } else {
        return (
          <div>
            <ProForm
              style={{ width: '100%' }}
              labelCol={{ span: 4, offset: 2 }}
              wrapperCol={{ span: 16 }}
              layout="horizontal"
              submitter={{
                render: (props, doms) => {
                  return (
                    <Row>
                      <Col span={14} offset={6}>
                        <Space>{doms}</Space>
                      </Col>
                    </Row>
                  );
                },
              }}
              onFinish={async (values) => {
                await waitTime(1000);
                console.log(values);
                message.success('提交成功');
                setSelfInfoMode(SelfInfoMode.Read);
              }}
              params={{}}
              request={async () => {
                return {
                  username,
                  nickname,
                  realname,
                  phone,
                  email,
                  useMode: 'chapter',
                };
              }}
            >
              <ProFormText
                width="xl"
                name="username"
                label="用户名"
                disabled
                rules={[{ required: true, message: '这是必填项' }]}
              />
              <ProFormText
                width="xl"
                name="nickname"
                label="昵称"
                placeholder="请输入您希望的该账号昵称"
              />
              <ProFormText
                width="xl"
                name="realname"
                label="真实姓名"
                placeholder="请输入您的真实姓名"
              />
              <ProFormText
                width="xl"
                name="phone"
                label="手机号"
                placeholder="请输入您的手机号码"
              />
              <ProFormText width="xl" name="email" label="邮箱" placeholder="请输入您的邮箱" />
              {/* <ProFormText
              name={['contract', 'name']}
              width="xl"
              label="合同名称"
              tooltip="5~16位数字或字母"
              placeholder="请输入名称"
            /> */}
            </ProForm>
          </div>
        );
      }
    } else {
      return (
        <ProForm
          // style={{ marginLeft: '200px' }}
          labelCol={{ span: 4, offset: 2 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          submitter={{
            render: (props, doms) => {
              return (
                <Row>
                  <Col span={14} offset={6}>
                    <Space>{doms}</Space>
                  </Col>
                </Row>
              );
            },
          }}
          onFinish={async (values) => {
            await waitTime(1000);
            console.log(values);
            message.success('提交成功');
          }}
          params={{}}
          // request={async () => {
          //   await waitTime(100);
          //   return {
          //     originPassword: 'admin',
          //     newPassword: 'chapter',
          //   };
          // }}
        >
          <ProFormText.Password
            width="xl"
            name="originPassword"
            label="原密码"
            rules={[{ required: true, message: '这是必填项' }]}
          />
          <ProFormText.Password
            width="xl"
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '这是必填项' }]}
          />
          <ProFormText.Password
            width="xl"
            name="confirmPassword"
            label="确认密码"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm>
      );
    }
  };

  return (
    <PageContainer>
      <Card
        title={false}
        style={{ marginRight: '100px' }}
        tabList={[
          {
            key: TabKey.SelfInfo,
            tab: (
              <>
                <UserOutlined />
                个人信息
              </>
            ),
          },
          {
            key: TabKey.PwdChange,
            tab: (
              <>
                <EditOutlined />
                修改密码
              </>
            ),
          },
        ]}
        activeTabKey={activeTabKey}
        onTabChange={(key) => {
          setActiveTabKey(key as TabKey);
        }}
      >
        {contentList(activeTabKey)}
      </Card>
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="xl"
          name="name"
        />
        <ProFormTextArea width="xl" name="desc" />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
