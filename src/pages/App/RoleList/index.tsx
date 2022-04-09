import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, Router, history } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { sysInfo } from '@/utils/commonParams';
import { query } from '@/utils/query';

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
    if (!sysInfo.app_id) {
      location.pathname = '/app_list';
      return;
    }
  }, []);

  const columns: ProColumns[] = [
    {
      title: <FormattedMessage id="pages.appRoleTable.titleId" defaultMessage="id" />,
      dataIndex: 'role_id',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.appRoleTable.titleName" defaultMessage="Rule name" />,
      dataIndex: 'role_name',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.appRoleTable.titleDesc" defaultMessage="Description" />,
      dataIndex: 'role_desc',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.appRoleTable.titleUserNum"
          defaultMessage="Number of service calls"
        />
      ),
      dataIndex: 'member_count',
      sorter: true,
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.appRoleTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="detail" href={`/role_detail?app_id=${record.app_id}&role_id=${record.role_id}`}>
          <FormattedMessage id="pages.userRoleTable.detail" defaultMessage="Configuration" />
        </a>,
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
            <PlusOutlined /> <FormattedMessage id="pages.appRoleTable.new" defaultMessage="New" />
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
          const data = await query('/app/role/list', {
            method: 'POST',
            data: {
              ...params,
            },
            ...(options || {}),
          });
          return {
            data: data.roleList,
            success: true,
            total: data.roleList?.length,
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
          id: 'pages.appRoleTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        labelCol={{ span: 4, offset: 2 }}
        wrapperCol={{ span: 16 }}
        width="710px"
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
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.appRoleTable.ruleName"
                  defaultMessage="角色名称为必填"
                />
              ),
            },
          ]}
          label="角色名称"
          width="lg"
          name="name"
        />
        <ProFormText label="角色描述" width="lg" name="desc" />
        <ProFormSelect
          name="app_members"
          label="角色成员"
          showSearch
          debounceTime={1000}
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
          placeholder="请选择角色成员"
          // rules={[{ required: true, message: '请选择至少一个角色成员', validator: () => {} }]}
        />
        <ProFormSelect
          name="app_managers"
          label="角色管理员"
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
          placeholder="请选择角色管理员"
          rules={[{ required: true, message: '请选择至少一个角色管理员', validator: () => {} }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
