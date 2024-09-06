import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      icon: 'mdi-home',
      title: 'Home',
    },
  },
  {
    path: '/server-side-model',
    name: 'ServerSideModel',
    component: () => import('@/examples/server-pagination-demo/ServerPaginationDemo.vue'),
    meta: {
      icon: 'mdi-server',
      title: 'Server Side Model',
    },
  },
  {
    path: '/row-grouping',
    name: 'RowGrouping',
    component: () => import('@/examples/client-pagination-demo/RowGroupDemo.vue'),
    meta: {
      icon: 'mdi-table-row',
      title: 'Row Grouping',
    },
  },
  {
    path: '/row-editing',
    name: 'RowEditing',
    component: () => import('@/examples/client-pagination-demo/RowEditDemo.vue'),
    meta: {
      icon: 'mdi-table-edit',
      title: 'Row Editing',
    },
  },
  {
    path: '/column-grouping',
    name: 'ColumnGrouping',
    component: () => import('@/examples/client-pagination-demo/ColumnGroupDemo.vue'),
    meta: {
      icon: 'mdi-table-column',
      title: 'Column Grouping',
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
