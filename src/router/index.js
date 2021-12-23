import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//引入最外层骨架的一级组件
import Layout from '@/layout'

export const constantRoutes = [
  // 登录--常量路由
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  //404页面--常量路由
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  //首页--常量路由
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

//暴露异步路由--不同的用户（角色），需要筛选出的路由
export const asyncRoutes = [
  //商品管理--异步路由
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'trademark',
        name: 'TradeMark',
        component: () => import('@/views/product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        meta: { title: '平台属性管理' }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: { title: 'spu管理' }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: { title: 'sku管理' }
      }
    ]
  },
  //权限管理--异步路由
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
  //测试管理--异步路由
  {
    name: 'Test',
    path: '/test',
    component: Layout,
    meta: {
      title: '测试管理',
      icon: 'el-icon-apple'
    },
    children: [
      {
        name: 'Test1',
        path: 'test1',
        component: () => import('@/views/Test/Test1'),
        meta: {
          title: '测试管理1',
        },
      },
      {
        name: 'Test2',
        path: 'test2',
        component: () => import('@/views/Test/Test2'),
        meta: {
          title: '测试管理2',
        },
      },
    ]
  },
]

//任意路由--当路径出现错误时候重定向404
export const anyRoutes = { path: '*', redirect: '/404', hidden: true }

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  //根据不同的用户可以展示不同的菜单（“活”的路由）
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
