export default [
  {
    name: 'app_list',
    icon: 'bars',
    path: '/app_list',
    component: './AppList',
  },
  {
    name: 'user',
    icon: 'user',
    path: '/user',
    routes: [
      {
        path: '/user/login',
        layout: false,
        component: './User/Login',
      },
      {
        name: 'role_list',
        icon: 'table',
        path: '/user/role_list',
        component: './User/RoleList',
      },
      {
        name: 'user_info',
        icon: 'user',
        path: '/user/user_info',
        component: './User/UserInfo',
      },
    ],
  },
  {
    name: 'app',
    icon: 'appstore',
    path: '/app',
    routes: [
      {
        name: 'manager_list',
        icon: 'table',
        path: '/app/manager_list',
        component: './App/ManagerList',
      },
      {
        name: 'role_list',
        icon: 'table',
        path: '/app/role_list',
        component: './App/RoleList',
      },
      {
        name: 'resource_list',
        icon: 'user',
        path: '/app/resource_list',
        component: './App/ResourceList',
      },
    ],
  },
  {
    name: 'role_detail',
    hideInMenu: true,
    path: '/role_detail',
    component: './App/RoleDetail',
  },
  {
    redirect: '/app_list',
  },
  {
    component: './404',
  },
];
