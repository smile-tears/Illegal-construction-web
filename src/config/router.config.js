// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/firstPage',
    children: [
      {
        path: '/firstPage',
        name: 'FullScreen',
        component: () => import('@/views/teamWork/FullScreen2'),
        meta: { title: '首页', icon: 'line-chart', keepAlive: false, permission: [ 'dashboard' ] }
      },

      {
        path: '/appMaintainSystem',
        name: 'appMaintainSystem',
        component: PageView,
        meta: { title: '应用维护子系统', icon: 'setting', permission: ['dashboard'] },
        children: [
          // {
          //   path: '/appMaintainSystem/questiontype',
          //   name: 'questiontype',
          //   component: () => import('../views/appMaintainSystem/QuestionTypeView'),
          //   meta: { title: '类型管理', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          // },
          {
            path: '/appMaintainSystem/gridcommunity',
            name: 'gridcommunity',
            // component: () => import('../views/appMaintainSystem/GridView'),
            component: () => import('../views/appMaintainSystem/gridcommunity/GridCommunityList'),
            meta: { title: '网格管理', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          },
          {
            path: '/appMaintainSystem/companyManage',
            name: 'companyManage',
            component: () => import('../views/appMaintainSystem/companymanage/CompanyManageList'),
            meta: { title: '公司管理', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          }
          // ,
          // {
          //   path: '/appMaintainSystem/sample',
          //   name: 'sample',
          //   component: () => import('../views/appMaintainSystem/SampleView'),
          //   meta: { title: '样本管理', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          // }
        ]
      },

      {
        path: '/baseDataSystem',
        name: 'baseDataSystem',
        component: PageView,
        meta: { title: '基础数据子系统', icon: 'team', permission: ['dashboard'] },
        children: [
          {
            path: '/baseDataSystem/user',
            name: 'User',
            component: () => import('@/views/appMaintainSystem/UserView'),
            meta: { title: '用户管理', icon: 'user', keepAlive: true, permission: [ 'support' ] }
          },
          {
            path: '/baseDataSystem/department',
            name: 'Department',
            component: () => import('@/views/appMaintainSystem/DepartmentView'),
            meta: { title: '部门管理', icon: 'team', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/baseDataSystem/role',
            name: 'role',
            component: () => import('@/views/appMaintainSystem/role/RoleList'),
            meta: { title: '角色管理', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          }
          // ,
          // {
          //   path: '/baseDataSystem/job',
          //   name: 'JobView',
          //   component: () => import('@/views/appMaintainSystem/JobView'),
          //   meta: { title: '岗位管理', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          // },
          // {
          //   path: '/baseDataSystem/menu',
          //   name: 'MenuView',
          //   component: () => import('@/views/appMaintainSystem/MenuView'),
          //   meta: { title: '菜单管理', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          // },
          // {
          //   path: '/baseDataSystem/auth',
          //   name: 'auth',
          //   component: () => import('@/views/appMaintainSystem/MenuAuthView'),
          //   meta: { title: '菜单分配', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          // },
          // {
          //   path: '/baseDataSystem/dateSet',
          //   name: 'DataSet',
          //   component: () => import('@/views/appMaintainSystem/dateset/List'),
          //   meta: { title: '假期管理', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          // },
          // {
          //   path: '/baseDataSystem/sysGlobalConfig',
          //   name: 'sysGlobalConfig',
          //   component: () => import('@/views/appMaintainSystem/SysGlobalConfig'),
          //   meta: { title: '系统设置', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          // }
        ]
      },

      {
        path: '/superviseAcceptSystem',
        name: 'superviseAcceptSystem',
        component: PageView,
        meta: { title: '监督受理子系统', icon: 'eye', permission: ['dashboard'] },
        children: [
          {
            path: '/superviseAcceptSystem/caseReport',
            name: 'caseReport',
            props: {
              page: '0'
            },
            component: () => import('../views/appMaintainSystem/case/ReportList'),
            meta: { title: '案件上报', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          },
          {
            path: '/superviseAcceptSystem/caseHandle',
            name: 'caseHandle',
            props: {
              page: '1'
            },
            component: () => import('../views/appMaintainSystem/case/ReportList'),
            meta: { title: '案件处置', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          },
          {
            path: '/superviseAcceptSystem/caseSearch',
            name: 'caseSearch',
            props: {
              page: '2'
            },
            component: () => import('../views/appMaintainSystem/case/ReportList'),
            meta: { title: '案件查询', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          }
          // ,
          // {
          //   path: '/superviseAcceptSystem/case12345',
          //   name: 'case12345',
          //   component: () => import('../views/appMaintainSystem/GridView'),
          //   meta: { title: '12345案件', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
          // },
          // {
          //   path: '/superviseAcceptSystem/case12319',
          //   name: 'case12319',
          //   component: () => import('@/views/appMaintainSystem/UserView'),
          //   meta: { title: '12319案件', icon: 'user', keepAlive: true, permission: ['support'] }
          // }
        ]
      },

      // {
      //   path: '/teamWork',
      //   name: 'teamWork',
      //   component: PageView,
      //   meta: { title: '协同工作子系统', icon: 'slack', permission: ['support'] },
      //   children: [
      //     {
      //       path: '/teamWork/registerManage',
      //       name: 'registerManage',
      //       component: () => import('@/views/teamWork/register/Register'),
      //       meta: { title: '立案管理', permission: ['support'] }
      //     },
      //     // {
      //     //   path: '/teamWork/commandCenterFull',
      //     //   name: 'commandCenterFull',
      //     //   component: () => import('@/views/teamWork/FullScreen'),
      //     //   meta: { title: '指挥中心-大屏', keepAlive: true, permission: ['support'] }
      //     // },
      //     {
      //       path: '/teamWork/commandCenter',
      //       name: 'commandCenter',
      //       component: () => import('@/views/teamWork/commandCenter/List'),
      //       meta: { title: '指挥中心', keepAlive: true, permission: ['support'] }
      //     },
      //     // {
      //     //   path: '/teamWork/caseHandling',
      //     //   name: 'caseHandling',
      //     //   component: () => import('@/views/teamWork/caseHandle'),
      //     //   meta: { title: '案件处置', keepAlive: true, permission: ['support'] }
      //     // },
      //     {
      //       path: '/teamWork/caseVerification',
      //       name: 'caseVerification',
      //       component: () => import('@/views/teamWork/caseVerification'),
      //       meta: { title: '案件核查', keepAlive: true, permission: ['support'] }
      //     },
      //     // {
      //     //   path: '/teamWork/integratedQuery',
      //     //   name: 'integratedQuery',
      //     //   // component: () => import('@/views/teamWork/commandCenter/List'),
      //     //   component: () => import('@/views/appMaintainSystem/case/CaseSearch'),
      //     //   meta: { title: '综合查询', keepAlive: true, permission: ['support'] }
      //     // }
      //   ]
      // },
      // {
      //   path: '/superviseCommandSystem',
      //   name: 'superviseCommandSystem',
      //   component: PageView,
      //   meta: { title: '监督指挥子系统', icon: 'tool', permission: ['dashboard'] },
      //   children: [
      //     {
      //       path: '/superviseCommandSystem/personnelOrientation',
      //       name: 'personnelOrientation',
      //       component: () => import('@/views/teamWork/ReplayHis'),
      //       meta: { title: '人员定位', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
      //     },
      //     {
      //       path: '/superviseCommandSystem/personnelTrack',
      //       name: 'personnelTrack',
      //       component: () => import('@/views/teamWork/ReplayHis'),
      //       meta: { title: '人员轨迹', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
      //     },
      //     // 地图展示
      //     {
      //       path: '/superviseCommandSystem/caseDistribution',
      //       name: 'caseDistribution',
      //       component: () => import('@/views/teamWork/register/Register'),
      //       meta: { title: '案件分布', icon: 'solution', keepAlive: true, permission: [ 'support' ] }
      //     }
      //
      //   ]
      // },
      // {
      //   path: '/personalCenter',
      //   name: 'personalCenter',
      //   component: PageView,
      //   meta: { title: '个人中心', icon: 'idcard', permission: ['dashboard'] },
      //   children: [
      //     {
      //       path: '/personalCenter/mailList',
      //       name: 'mailList',
      //       component: () => import('../views/appMaintainSystem/GridView'),
      //       meta: { title: '通讯录', icon: 'contacts', keepAlive: true, permission: [ 'support' ] }
      //     },
      //     {
      //       path: '/personalCenter/mySchedule',
      //       name: 'mySchedule',
      //       component: () => import('../views/appMaintainSystem/GridView'),
      //       meta: { title: '我的排班', icon: 'schedule', keepAlive: true, permission: [ 'support' ] }
      //     },
      //     {
      //       path: '/personalCenter/quickComments',
      //       name: 'quickComments',
      //       component: () => import('../views/appMaintainSystem/GridView'),
      //       meta: { title: '快捷意见', icon: 'exception', keepAlive: true, permission: [ 'support' ] }
      //     },
      //     {
      //       path: '/personalCenter/personalInfo',
      //       name: 'personalInfo',
      //       component: () => import('../views/appMaintainSystem/GridView'),
      //       meta: { title: '个人信息', icon: 'idcard', keepAlive: true, permission: [ 'support' ] }
      //     }
      //   ]
      // },
      // {
      //   path: '/synthesisEvaluationSystem',
      //   name: 'synthesisEvaluationSystem',
      //   component: PageView,
      //   meta: { title: '综合评价子系统', icon: 'area-chart', permission: ['dashboard'] },
      //   children: [
      //     {
      //       path: '/synthesisEvaluationSystem/reportForm1',
      //       name: 'reportForm1',
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: '报表1', icon: 'area-chart', keepAlive: true, permission: [ 'support' ] }
      //     },
      //     {
      //       path: '/synthesisEvaluationSystem/reportForm2',
      //       name: 'reportForm2',
      //       component: () => import('@/views/list/StandardList'),
      //       meta: { title: '报表2', icon: 'line-chart', keepAlive: true, permission: [ 'support' ] }
      //     },
      //     {
      //       path: '/synthesisEvaluationSystem/reportForm3',
      //       name: 'reportForm3',
      //       component: () => import('@/views/list/CardList'),
      //       meta: { title: '报表3', icon: 'bar-chart', keepAlive: true, permission: [ 'support' ] }
      //     }
      //   ]
      // },

      // {
      //   path: '/geocodingSystem',
      //   name: 'geocodingSystem',
      //   component: PageView,
      //   meta: { title: '地理编码子系统', icon: 'compass', permission: ['dashboard'] }
      // },
      // {
      //   path: '/caseMaintainSystem',
      //   name: 'caseMaintainSystem',
      //   component: PageView,
      //   meta: { title: '大数据中心', icon: 'database', permission: ['dashboard'] },
      //   children: [
      //     {
      //       path: '/other/demo/Heatmap',
      //       name: 'Heatmap',
      //       component: () => import('@/views/demo/Heatmap'),
      //       meta: { title: '热力图', keepAlive: true, permission: ['support'] }
      //     }
      //   ]
      // },

      {
        path: '/demo',
        name: 'demo',
        component: PageView,
        meta: { title: 'Demo', icon: 'slack', permission: ['support'] },
        children: [
          {
            path: '/other/teamWork',
            component: RouteView,
            meta: { title: '超时查询', permission: ['support'] },
            redirect: '/other/teamWork/tree-list',
            children: [
              {
                path: '/other/teamWork/QueryRegister',
                name: 'QueryRegister',
                component: () => import('@/views/teamWork/QueryRegister'),
                meta: { title: '立案超时查询', keepAlive: true, permission: ['support'] }
              }

            ]
          },
          {
            path: '/other/teamWork/TestAmap',
            name: 'TestAmap',
            component: () => import('@/views/teamWork/TestAmap'),
            meta: { title: '高德地图demo', keepAlive: true, permission: ['support'] }
          },
          {
            path: '/other/teamWork/DrawGridDemo',
            name: 'DrawGridDemo',
            component: () => import('@/views/teamWork/DrawGridDemo'),
            meta: { title: '画网格demo', keepAlive: true, permission: ['support'] }
          },
          {
            path: '/other/teamWork/FullScreen',
            name: 'FullScreen',
            component: () => import('@/views/teamWork/FullScreen'),
            meta: { title: '全屏地图', keepAlive: true, permission: ['support'] }
          },
          {
            path: '/other/teamWork/ReplayHis',
            name: 'ReplayHis',
            component: () => import('@/views/teamWork/ReplayHis'),
            meta: { title: '轨迹回放', keepAlive: true, permission: ['support'] }
          },
          {
            path: '/other/teamWork/TestWebSocket',
            name: 'TestWebSocket',
            component: () => import('@/views/teamWork/TestWebSocket'),
            meta: { title: 'WebSocket Demo', keepAlive: true, permission: ['support'] }
          },
          {
            path: '/other/demo/MyCarousel',
            name: 'MyCarousel',
            component: () => import('@/views/demo/MyCarousel'),
            meta: { title: '走马灯', keepAlive: true, permission: ['support'] }
          },
          {
            path: '/other/demo/Heatmap',
            name: 'Heatmap',
            component: () => import('@/views/demo/Heatmap'),
            meta: { title: '热力图', keepAlive: true, permission: ['support'] }
          },
          {
            path: '/other/demo/ScrollList',
            name: 'ScrollList',
            component: () => import('@/views/demo/ScrollList'),
            meta: { title: '滚动列表', keepAlive: true, permission: ['support'] }
          }
        ]
      },

      // dashboard
      // {
      //   path: 'dashboard',
      //   name: 'dashboard',
      //   redirect: '/dashboard/workplace',
      //   component: RouteView,
      //   meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: 'analysis/:pageNo([1-9]\\d*)?',
      //       name: 'Analysis',
      //       component: () => import('@/views/dashboard/Analysis'),
      //       meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
      //     },
      //     // 外部链接
      //     {
      //       path: 'https://www.baidu.com/',
      //       name: 'Monitor',
      //       meta: { title: '监控页（外部）', target: '_blank' }
      //     },
      //     {
      //       path: 'workplace',
      //       name: 'Workplace',
      //       component: () => import('@/views/dashboard/Workplace'),
      //       meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: 'test-work',
      //       name: 'TestWork',
      //       component: () => import('@/views/dashboard/TestWork'),
      //       meta: { title: '测试功能', keepAlive: true, permission: [ 'dashboard' ] }
      //     }
      //   ]
      // },
      // forms
      // {
      //   path: '/form',
      //   redirect: '/form/base-form',
      //   component: PageView,
      //   meta: { title: '表单页', icon: 'form', permission: [ 'form' ] },
      //   children: [
      //     {
      //       path: '/form/base-form',
      //       name: 'BaseForm',
      //       component: () => import('@/views/form/BasicForm'),
      //       meta: { title: '基础表单', keepAlive: true, permission: [ 'form' ] }
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'StepForm',
      //       component: () => import('@/views/form/stepForm/StepForm'),
      //       meta: { title: '分步表单', keepAlive: true, permission: [ 'form' ] }
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'AdvanceForm',
      //       component: () => import('@/views/form/advancedForm/AdvancedForm'),
      //       meta: { title: '高级表单', keepAlive: true, permission: [ 'form' ] }
      //     }
      //   ]
      // },
      //
      // // list
      // {
      //   path: '/list',
      //   name: 'list',
      //   component: PageView,
      //   redirect: '/list/table-list',
      //   meta: { title: '列表页', icon: 'table', permission: [ 'table' ] },
      //   children: [
      //     {
      //       path: '/list/table-list/:pageNo([1-9]\\d*)?',
      //       name: 'TableListWrapper',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: '查询表格', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'BasicList',
      //       component: () => import('@/views/list/StandardList'),
      //       meta: { title: '标准列表', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/card',
      //       name: 'CardList',
      //       component: () => import('@/views/list/CardList'),
      //       meta: { title: '卡片列表', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'SearchList',
      //       component: () => import('@/views/list/search/SearchLayout'),
      //       redirect: '/list/search/article',
      //       meta: { title: '搜索列表', keepAlive: true, permission: [ 'table' ] },
      //       children: [
      //         {
      //           path: '/list/search/article',
      //           name: 'SearchArticles',
      //           component: () => import('../views/list/search/Article'),
      //           meta: { title: '搜索列表（文章）', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/project',
      //           name: 'SearchProjects',
      //           component: () => import('../views/list/search/Projects'),
      //           meta: { title: '搜索列表（项目）', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/application',
      //           name: 'SearchApplications',
      //           component: () => import('../views/list/search/Applications'),
      //           meta: { title: '搜索列表（应用）', permission: [ 'table' ] }
      //         }
      //       ]
      //     }
      //   ]
      // },
      //
      // // profile
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   component: RouteView,
      //   redirect: '/profile/basic',
      //   meta: { title: '详情页', icon: 'profile', permission: [ 'profile' ] },
      //   children: [
      //     {
      //       path: '/profile/basic',
      //       name: 'ProfileBasic',
      //       component: () => import('@/views/profile/basic/Index'),
      //       meta: { title: '基础详情页', permission: [ 'profile' ] }
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'ProfileAdvanced',
      //       component: () => import('@/views/profile/advanced/Advanced'),
      //       meta: { title: '高级详情页', permission: [ 'profile' ] }
      //     }
      //   ]
      // },

      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      }

      // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   redirect: '/account/center',
      //   name: 'account',
      //   meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
      //   children: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: () => import('@/views/account/center/Index'),
      //       meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('@/views/account/settings/Index'),
      //       meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
      //       redirect: '/account/settings/base',
      //       hideChildrenInMenu: true,
      //       children: [
      //         {
      //           path: '/account/settings/base',
      //           name: 'BaseSettings',
      //           component: () => import('@/views/account/settings/BaseSetting'),
      //           meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/security',
      //           name: 'SecuritySettings',
      //           component: () => import('@/views/account/settings/Security'),
      //           meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('@/views/account/settings/Custom'),
      //           meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           name: 'BindingSettings',
      //           component: () => import('@/views/account/settings/Binding'),
      //           meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           name: 'NotificationSettings',
      //           component: () => import('@/views/account/settings/Notification'),
      //           meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         }
      //       ]
      //     }
      //   ]
      // }
      // other
      // {
      //   path: '/other',
      //   name: 'otherPage',
      //   component: PageView,
      //   meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
      //   redirect: '/other/icon-selector',
      //   children: [
      //     {
      //       path: '/other/icon-selector',
      //       name: 'TestIconSelect',
      //       component: () => import('@/views/other/IconSelectorView'),
      //       meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/other/list',
      //       component: RouteView,
      //       meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
      //       redirect: '/other/list/tree-list',
      //       children: [
      //         {
      //           path: '/other/list/tree-list',
      //           name: 'TreeList',
      //           component: () => import('@/views/other/TreeList'),
      //           meta: { title: '树目录表格', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/edit-table',
      //           name: 'EditList',
      //           component: () => import('@/views/other/TableInnerEditList'),
      //           meta: { title: '内联编辑表格', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/user-list',
      //           name: 'UserList',
      //           component: () => import('@/views/other/UserList'),
      //           meta: { title: '用户列表', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/role-list',
      //           name: 'RoleList',
      //           component: () => import('@/views/other/RoleList'),
      //           meta: { title: '角色列表', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/system-role',
      //           name: 'SystemRole',
      //           component: () => import('@/views/role/RoleList'),
      //           meta: { title: '角色列表2', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/permission-list',
      //           name: 'PermissionList',
      //           component: () => import('@/views/other/PermissionList'),
      //           meta: { title: '权限列表', keepAlive: true }
      //         }
      //       ]
      //     }
      //   ]
      // },

      // {
      //   path: '/notice',
      //   name: 'notice',
      //   component: PageView,
      //   meta: { title: '通知公告', icon: 'slack', permission: ['dashboard'] },
      //   redirect: '/notice/icon-selector',
      //   children: []
      // }

    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
