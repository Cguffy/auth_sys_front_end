import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
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
  const [currentRow, setCurrentRow] = useState();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns[] = [
    {
      title: <FormattedMessage id="pages.userRoleTable.titleId" defaultMessage="id" />,
      dataIndex: 'role_id',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.userRoleTable.titleName" defaultMessage="Rule name" />,
      dataIndex: 'role_name',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.userRoleTable.titleDesc" defaultMessage="Description" />,
      dataIndex: 'role_desc',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.userRoleTable.titleBelongApp" defaultMessage="Status" />,
      dataIndex: 'app_name',
    },
    {
      title: (
        <FormattedMessage id="pages.userRoleTable.titleIsAdmin" defaultMessage="Description" />
      ),
      dataIndex: 'is_admin',
      valueEnum: {
        0: {
          text: '否',
        },
        1: {
          text: '是',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.userRoleTable.titleOption" defaultMessage="Operating" />,
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
        // headerTitle={intl.formatMessage({
        //   id: 'pages.userRoleTable.title',
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
          const data = await query('/user/rolelist', {
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
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.userRoleTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        // onFinish={async (value) => {
        //   const success = await handleAdd(value);
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
                  id="pages.userRoleTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
