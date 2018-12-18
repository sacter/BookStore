const data = [
  // {
  //   name: 1,
  //   path: '',
  //   component: '',
  //   title: '分类',
  //   children: [
  //     {
  //       name: '1-1',
  //       path: '',
  //       component: '',
  //       title: '分类',
  //     }
  //   ]
  // },
  // {
  //   name: 2,
  //   path: '',
  //   component: '',
  //   title: '操作日志动作',
  //   children: [{
  //       name: '2-1',
  //       path: '',
  //       component: '',
  //       title: '操作日志动作和对象说明',
  //     }
  //   ]
  // },
  {
    name: 3,
    path: '',
    component: '',
    title: '用户',
    children: [{
      name: '3-1',
      path: '/UserList',
      component: 'UserList',
      title: '用户列表',
    }
    ]
  },
  {
    name: 4,
    path:'',
    component:'',
    title: '书库',
    children:[
      {
        name: '4-1',
        path: '/Index/',
        component: 'BookStore',
        title: '作品管理',
      }
    ]
  },
  {
    name: 5,
    path: '',
    component: '',
    title: '运营',
    children: [
      {
        name: '5-1',
        path: '/PopularRecommend',
        component: 'PopularRecommend',
        title: '热门推荐',
        // title: '默认词和热门推荐',
      },
      {
        name: '5-2',
        path: '/searchHotWords',
        component: 'searchHotWords',
        title: '搜索热词',
      },
      {
        name: '5-3',
        path: '/AdvertisingManag',
        component: 'AdvertisingManag',
        title: '广告管理',
      }
    ]
  },
  {
    name: 6,
    path: '',
    component: '',
    title: '内容',
    children: [
      {
        name: '6-1',
        path: '/ThematicList',
        component: '',
        title: '专题列表',
      }
    ]
  },
  {
    name: 7,
    path: '',
    component: '',
    title: '统计',
    children: [
      {
        name: '7-1',
        path: '',
        component: '',
        title: '交易统计',
      }
    ]
  },
  {
    name: 8,
    path: '',
    component: '',
    title: '设置',
    children: [
      {
        name: '8-1',
        path: '/AccountManag',
        component: 'AccountManag',
        title: '账号管理',
      },
      {
        name: '8-2',
        path: '/LogList',
        component: 'LogList',
        title: '操作日志',
      },
      {
        name: '8-3',
        path: '/Feedback',
        component: 'Feedback',
        title: '意见反馈',
      }
    ]
  }
]

export const menus = data;