import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Table, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, history } from 'umi';
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
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

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

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: <FormattedMessage id="pages.appResourceTable.titleID" defaultMessage="资源UID" />,
      dataIndex: 'resource_id',
      tip: '资源UID是唯一键',
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
    },
    {
      title: (
        <FormattedMessage id="pages.appResourceTable.titleUpdateTime" defaultMessage="更新时间" />
      ),
      sorter: true,
      dataIndex: 'update_time',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.appResourceTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="subResource"
          onClick={() => {
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.appResourceTable.subResource" defaultMessage="创建子资源" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="resource_id"
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
            <FormattedMessage id="pages.appResourceTable.new" defaultMessage="新建资源" />
          </Button>,
        ]}
        // request={async (
        //   // 第一个参数 params 查询表单和 params 参数的结合
        //   // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        //   params: API.PageParams & {
        //     pageSize?: number;
        //     current?: number;
        //   },
        //   sort,
        //   filter,
        // ) => {
        //   console.log('params: ', params);
        //   console.log('sort: ', sort);
        //   console.log('filter: ', filter);
        //   return rule(params, sort);
        // }}
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
          const data = await query('/app/resource/list', {
            method: 'POST',
            data: {
              ...params,
            },
            ...(options || {}),
          });
          return {
            data: data.resourceList,
            success: true,
            total: data.resourceList?.length,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.appResourceTable.chosen" defaultMessage="选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.appResourceTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Popconfirm
            title="确认删除？"
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
                defaultMessage="批量删除"
              />
            </Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.roleDetailTable.createForm.title',
          defaultMessage: '新建资源',
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
                  id="pages.roleDetailTable.ruleName"
                  defaultMessage="资源key为必填"
                />
              ),
            },
          ]}
          label="资源 key"
          width="lg"
          name="key"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.roleDetailTable.ruleName"
                  defaultMessage="资源名称为必填"
                />
              ),
            },
          ]}
          label="资源名称"
          width="lg"
          name="name"
        />
        <ProFormText label="资源描述" width="lg" name="desc" />
        <ProFormSelect
          label="授权角色"
          showSearch
          debounceTime={300}
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
          placeholder="请选择需要授权的角色"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
