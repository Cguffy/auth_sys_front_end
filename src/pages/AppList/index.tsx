import { AppstoreAddOutlined, BarsOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Popconfirm, Badge } from 'antd';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { query } from '@/utils/query';

enum Tab {
  AllApps = 'tab1',
  MyApps = 'tab2',
}

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();

  const [activeKey, setActiveKey] = useState(Tab.AllApps);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const handleDeleteAppConfirm = () => {};

  const columns: ProColumns[] = [
    {
      title: <FormattedMessage id="pages.userAppTable.titleId" defaultMessage="id" />,
      dataIndex: 'app_id',
      align: 'center',
      render: (dom, record) => [
        <a key="detail" href={`/app/manager_list?app_id=${record.app_id}`}>
          {dom}
        </a>,
      ],
    },
    {
      title: <FormattedMessage id="pages.userAppTable.titleName" defaultMessage="Rule name" />,
      dataIndex: 'app_name',
      align: 'center',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.userAppTable.titleDesc" defaultMessage="Description" />,
      dataIndex: 'app_desc',
      align: 'center',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.userAppTable.titleIsAdmin" defaultMessage="" />,
      dataIndex: 'is_admin',
      align: 'center',
      valueEnum: {
        0: '否',
        1: '是',
      },
    },
    {
      title: <FormattedMessage id="pages.userAppTable.titleCreator" defaultMessage="Status" />,
      dataIndex: 'creator',
      align: 'center',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.userAppTable.nameStatus.default"
              defaultMessage="Shut down"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.userAppTable.nameStatus.running" defaultMessage="Running" />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.userAppTable.nameStatus.online" defaultMessage="Online" />
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage
              id="pages.userAppTable.nameStatus.abnormal"
              defaultMessage="Abnormal"
            />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.userAppTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      align: 'center',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          // onClick={() => {
          //   setCurrentRow(record);
          //   console.log('location: ', location);
          // }}
          href={`/app/manager_list?app_id=${record.app_id}`}
        >
          <FormattedMessage id="pages.userAppTable.detail" defaultMessage="Configuration" />
        </a>,
        <Popconfirm key="deletePopconfirm" title="确认删除应用?" onConfirm={handleDeleteAppConfirm}>
          <a href="#">删除应用</a>
        </Popconfirm>,
      ],
    },
  ];

  const [dataSource, setDataSource] = useState([]);

  const getDataSource = async (key: Tab) => {
    const url = key === Tab.AllApps ? '/app/list/all' : '/app/list/self';
    const data = await query(url, {
      method: 'POST',
    });
    setDataSource(data.appsList);
  };

  useEffect(() => {
    getDataSource(activeKey);
  }, [activeKey]);

  return (
    <PageContainer>
      <ProTable<API.PageParams>
        // headerTitle={intl.formatMessage({
        //   id: 'pages.userAppTable.title',
        //   defaultMessage: 'Enquiry form',
        // })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          showQuickJumper: true,
        }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: [
              {
                key: Tab.AllApps,
                label: (
                  <span>
                    <BarsOutlined />
                    <span style={{ marginRight: '5px' }}>所有应用</span>
                  </span>
                ),
              },
              {
                key: Tab.MyApps,
                label: (
                  <span>
                    <UserOutlined />
                    <span style={{ marginRight: '5px' }}>我的应用</span>
                  </span>
                ),
              },
            ],
            onChange: (key) => {
              setActiveKey(key as Tab);
            },
          },
          actions: [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleModalVisible(true);
              }}
            >
              <AppstoreAddOutlined />{' '}
              <FormattedMessage id="pages.userAppTable.new" defaultMessage="New" />
            </Button>,
          ],
        }}
        dataSource={dataSource}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.userAppTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        labelCol={{ span: 4, offset: 2 }}
        wrapperCol={{ span: 16 }}
        width="710px"
        layout="horizontal"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.userAppTable.ruleName"
                  defaultMessage="应用名称为必填"
                />
              ),
            },
          ]}
          label="应用名称"
          width="lg"
          name="name"
        />
        <ProFormText label="应用描述" width="lg" name="desc" />
        <ProFormSelect
          name="app_managers"
          label="管理员"
          showSearch
          debounceTime={300}
          fieldProps={{
            mode: 'multiple',
            defaultValue: ['test1'],
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
          placeholder="请选择应用管理员"
          rules={[{ required: true, message: '请选择至少一个应用管理员', validator: () => {} }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
