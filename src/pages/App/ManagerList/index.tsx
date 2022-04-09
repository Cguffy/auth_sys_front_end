import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Input, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, Router, history } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { query as request } from '@/utils/query';
import { sysInfo } from '@/utils/commonParams';

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

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  // 当无应用id时重定向回角色列表
  useEffect(() => {
    const { query } = history.location;
    if (!query?.app_id && !sysInfo.app_id) {
      location.pathname = '/app_list';
      return;
    }
    if (query?.app_id) sysInfo.app_id = query?.app_id as string;
  }, []);

  const handleDeleteManagerConfirm = () => {};

  const columns: ProColumns[] = [
    {
      title: <FormattedMessage id="pages.appManagerTable.titleId" defaultMessage="用户" />,
      dataIndex: 'username',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage id="pages.appManagerTable.titleAuthTime" defaultMessage="授权时间" />
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
      title: <FormattedMessage id="pages.appManagerTable.titleEndTime" defaultMessage="到期时间" />,
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
      title: <FormattedMessage id="pages.appManagerTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a key="editTime">修改期限</a>,
        <Popconfirm
          key="deletePopconfirm"
          title="确认删除管理员?"
          onConfirm={handleDeleteManagerConfirm}
        >
          <a href="#">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.PageParams>
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          showQuickJumper: true,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined />{' '}
            <FormattedMessage id="pages.appManagerTable.new" defaultMessage="添加管理员" />
          </Button>,
        ]}
        request={async (
          params: {
            // query
            /** 当前的页码 */
            current?: number;
            /** 页面的容量 */
            pageSize?: number;
          },
          options?: Record<string, any>,
        ) => {
          const data = await request('/app/admin/list', {
            method: 'POST',
            data: {
              ...params,
            },
            ...(options || {}),
          });
          return {
            data: data.adminList,
            success: true,
            total: data.adminList?.length,
          };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.appManagerTable.addManager',
          defaultMessage: '添加管理员',
        })}
        labelCol={{ span: 4, offset: 2 }}
        wrapperCol={{ span: 16 }}
        width="600px"
        layout="horizontal"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        // onFinish={async (value) => {
        //   const success = await handleAdd(value as API.RuleListItem);
        //   if (success) {
        //     handleModalVisible(false);
        //     if (actionRef.current) {
        //       actionRef.current.reload();
        //     }
        //   }
        // }}
      >
        <ProFormSelect
          name="new_managers"
          label="管理员"
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
          placeholder="请选择应用管理员"
          rules={[{ required: true, message: '请选择至少一个应用管理员', validator: () => {} }]}
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
