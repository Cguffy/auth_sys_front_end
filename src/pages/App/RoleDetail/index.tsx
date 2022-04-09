import { BarsOutlined, PlusOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Card, Input, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useIntl, FormattedMessage, history } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { sysInfo } from '@/utils/commonParams';
import { query as request } from '@/utils/query';

enum TabKey {
  Member = 'member',
  Auth = 'auth',
  Admin = 'admin',
}

enum AddMode {
  AddMember = 'add_member',
  AddAdmin = 'add_admin',
}

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [showAddModel, setShowAddModel] = useState<boolean>(false);
  // const [addMode, setAddMode] = useState(AddMode.AddMember);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const [activeTabKey, setActiveTabKey] = useState(TabKey.Member);

  const addMode = useMemo(() => {
    return activeTabKey === TabKey.Member ? AddMode.AddMember : AddMode.AddAdmin;
  }, [activeTabKey]);

  // 当无角色或角色id时重定向回角色列表
  useEffect(() => {
    const { query } = history.location;
    if (!query?.app_id || !query?.role_id) {
      location.pathname = '/app_list';
      return;
    }
    sysInfo.app_id = query.app_id as string;
    sysInfo.role_id = query.role_id as string;
  }, []);

  const memberColumns: ProColumns[] = [
    {
      title: (
        <FormattedMessage id="pages.roleDetailTable.member.titleAccount" defaultMessage="id" />
      ),
      dataIndex: 'username',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.roleDetailTable.member.titleAuthTime"
          defaultMessage="授权时间"
        />
      ),
      sorter: true,
      dataIndex: 'auth_time',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.appResourceTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.roleDetailTable.member.titleEndTime"
          defaultMessage="到期时间"
        />
      ),
      sorter: true,
      dataIndex: 'end_time',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.appResourceTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.roleDetailTable.member.titleOption"
          defaultMessage="Operating"
        />
      ),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="updateAuth"
          onClick={() => {
            setCurrentRow(record);
          }}
        >
          <FormattedMessage
            id="pages.roleDetailTable.member.updateAuth"
            defaultMessage="更新授权期限"
          />
        </a>,
        <Popconfirm
          key="deleteAuth"
          title={`确认删除用户${addMode === AddMode.AddMember ? '角色' : '管理员'}权限？`}
          onConfirm={async () => {
            // await handleRemove(selectedRowsState);
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
          }}
          okText="确认"
          cancelText="取消"
        >
          <Button type="link" danger>
            <FormattedMessage id="pages.appResourceTable.batchDeletion" defaultMessage="删除" />
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const authColumns: ProColumns[] = [
    {
      title: <FormattedMessage id="pages.appResourceTable.titleID" defaultMessage="资源UID" />,
      dataIndex: 'resource_id',
      tip: '资源UID是唯一键',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.appResourceTable.titleKey" defaultMessage="资源key" />,
      dataIndex: 'resource_key',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.appResourceTable.titleName" defaultMessage="资源名称" />,
      dataIndex: 'resource_name',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.appResourceTable.titleDesc" defaultMessage="资源描述" />,
      dataIndex: 'resource_desc',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage id="pages.appResourceTable.titleCreateTime" defaultMessage="创建时间" />
      ),
      sorter: true,
      dataIndex: 'create_time',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.appResourceTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: (
        <FormattedMessage id="pages.appResourceTable.titleUpdateTime" defaultMessage="更新时间" />
      ),
      sorter: true,
      dataIndex: 'update_time',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.appResourceTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.appResourceTable.hasAuth" defaultMessage="是否授权" />,
      dataIndex: 'has_auth',
      valueEnum: {
        1: '是',
        0: '否',
      },
    },
  ];

  const getColumns = (key: TabKey) => {
    switch (key) {
      case TabKey.Member:
        return memberColumns;
      case TabKey.Auth:
        return authColumns;
      case TabKey.Admin:
        return memberColumns;
      default:
        return memberColumns;
    }
  };

  const [dataSource, setDataSource] = useState([]);

  const getDataSource = async (key: TabKey) => {
    let url = '';
    switch (key) {
      case TabKey.Member:
        url = '/role/member/list';
        break;
      case TabKey.Auth:
        url = 'role/auth/list';
        break;
      case TabKey.Admin:
        url = 'role/admin/list';
        break;
    }
    const data = await request(url, {
      method: 'POST',
    });
    setDataSource(data.memberList || data.authList || data.adminList);
  };

  useEffect(() => {
    getDataSource(activeTabKey);
  }, [activeTabKey]);

  return (
    <PageContainer>
      <ProTable<API.PageParams>
        // headerTitle={intl.formatMessage({
        //   id: 'pages.roleDetailTable.title',
        //   defaultMessage: 'Enquiry form',
        // })}
        actionRef={actionRef}
        rowKey={activeTabKey === TabKey.Auth ? 'resource_id' : 'username'}
        search={{
          labelWidth: 120,
        }}
        cardProps={{
          onTabChange: (key) => setActiveTabKey(key as TabKey),
          tabList: [
            {
              key: TabKey.Member,
              tab: (
                <>
                  <TeamOutlined />
                  角色成员
                </>
              ),
            },
            {
              key: TabKey.Auth,
              tab: (
                <>
                  <BarsOutlined />
                  角色权限
                </>
              ),
            },
            {
              key: TabKey.Admin,
              tab: (
                <>
                  <SettingOutlined />
                  管理员
                </>
              ),
            },
          ],
        }}
        pagination={{
          showQuickJumper: true,
        }}
        toolBarRender={() =>
          (activeTabKey !== TabKey.Auth && [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setShowAddModel(true);
              }}
            >
              <PlusOutlined />{' '}
              <FormattedMessage
                id="pages.roleDetailTable.add"
                defaultMessage={`添加${addMode === AddMode.AddMember ? '成员' : '管理员'}`}
              />
            </Button>,
          ]) ||
          []
        }
        dataSource={dataSource}
        columns={getColumns(activeTabKey)}
        rowSelection={
          activeTabKey === TabKey.Auth && {
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }
        }
      />
      {activeTabKey === TabKey.Auth && selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.roleDetailTable.chosen" defaultMessage="选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.roleDetailTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Popconfirm
            title="确认为角色添加所选资源权限？"
            onConfirm={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary">
              <FormattedMessage
                id="pages.appResourceTable.batchDeletion"
                defaultMessage="批量添加权限"
              />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确认删除角色所选资源权限？"
            onConfirm={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" danger>
              <FormattedMessage
                id="pages.appResourceTable.batchDeletion"
                defaultMessage="批量删除权限"
              />
            </Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.appManagerTable.addManager',
          defaultMessage: `添加${addMode === AddMode.AddMember ? '角色成员' : '管理员'}`,
        })}
        labelCol={{ span: 4, offset: 2 }}
        wrapperCol={{ span: 16 }}
        width="600px"
        layout="horizontal"
        visible={showAddModel}
        onVisibleChange={setShowAddModel}
      >
        <ProFormSelect
          name="new_managers"
          label={`${addMode === AddMode.AddMember ? '角色成员' : '管理员'}`}
          showSearch
          debounceTime={1000}
          fieldProps={{
            mode: 'multiple',
            autoClearSearchValue: true,
          }}
          request={async () => {
            return [
              {
                value: 'test1',
                label: '测试1',
              },
              {
                value: 'test2',
                label: '测试2',
              },
              {
                value: 'test3',
                label: '测试3',
              },
            ];
          }}
          placeholder={`请选择角色${addMode === AddMode.AddMember ? '成员' : '管理员'}`}
          rules={[
            {
              required: true,
              message: `请选择至少一个角色${addMode === AddMode.AddMember ? '成员' : '管理员'}`,
              validator: () => {},
            },
          ]}
        />
        <ProFormSelect
          name="auth_time"
          label="授权期限"
          request={async () => {
            return [
              {
                value: 1,
                label: '一个月',
              },
              {
                value: 3,
                label: '三个月',
              },
              {
                value: 6,
                label: '半年',
              },
              {
                value: 12,
                label: '一年',
              },
              {
                value: 36,
                label: '三年',
              },
              {
                value: 60,
                label: '五年',
              },
            ];
          }}
          placeholder="请选择授权期限"
          rules={[{ required: true, message: '请选择至少一个时长', validator: () => {} }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
