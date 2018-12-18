import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Index from '@/views/index'
import BookStore from '@/views/book-store'
import Uploading from '@/views/uploading'
import BookDetail from '@/views/book-detail'
import ThematicList from '@/views/thematic-list'
import ThematicSee from '@/views/thematic-see'
import ThematicChange from '@/views/thematic-change'
import AdvertisingManag from '@/views/advertising-manag'
import PopularRecommend from '@/views/popular-recommend'
import HotChange from '@/views/hot-change'
import OperatAdvertising from '@/views/operat-advertising'
import searchHotWords from '@/views/search-hot-words'
import UserList from '@/views/user-list'
import AccountManag from '@/views/account-manag'
import AccountChange from '@/views/account-change'
import LogList from '@/views/log-list'
import Feedback from '@/views/feedback'
import ueditor from '@/views/ueditor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login,
    },
    {
      path: '/Index',
      component: Index,
      children: [
        {
          path: '/',
          component: BookStore,
        }, {
          path: '/ueditor',
          component: ueditor
        }, {
          path: '/Uploading',
          component: Uploading
        }, {
          path: '/BookDetail',
          component: BookDetail
        }, {
          path: '/ThematicList',
          component: ThematicList
        }, {
          path: '/ThematicSee',
          component: ThematicSee
        }, {
          path: '/ThematicChange',
          component: ThematicChange
        }, {
          path: '/AdvertisingManag',
          component: AdvertisingManag
        }, {
          path: '/OperatAdvertising',
          component: OperatAdvertising
        }, {
          path: '/PopularRecommend',
          component: PopularRecommend
        }, {
          path: '/HotChange',
          component: HotChange
        }, {
          path: '/searchHotWords',
          component: searchHotWords
        }, {
          path: '/UserList',
          component: UserList
        }, {
          path: '/AccountManag',
          component: AccountManag
        }, {
          path: '/AccountChange',
          component: AccountChange
        }, {
          path: '/LogList',
          component: LogList
        }, {
          path: '/Feedback',
          component: Feedback
        },
      ]
    },
    
  ]
})
