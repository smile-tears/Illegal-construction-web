import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { getAsyncRoutes } from '@/utils/asyncRouter'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {userMenuTree} from '@/api/menu'
import qs from 'qs'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

//const whiteList = ['/user/login', 'register', 'registerResult'] // no redirect whitelist
const defaultRoutePath = '/dashboard/workplace'

const whiteList = ['/user/login'];
router.beforeEach( async (to, from, next) => {
    NProgress.start()
    // 获取用户token，用来判断当前用户是否登录
    const hasToken = Vue.ls.get(ACCESS_TOKEN)
    if (hasToken) {
        if (to.path === '/user/login') {
            next()
            NProgress.done()
        } else {
            //异步获取store中的路由
           
            let isGenerateRoutes = window.sessionStorage.getItem('isGenerateRoutes')
            var that = router 
            if ( isGenerateRoutes == 'true' ) {
                next()
            } else {
                try {
                    userMenuTree(qs.stringify({userId: window.sessionStorage.getItem('id')})).then(response => {
                        window.sessionStorage.setItem('addRoutes',JSON.stringify(response.result))
                        window.sessionStorage.setItem('isGenerateRoutes','false')
                        let addRoutes =  JSON.parse(window.sessionStorage.getItem('addRoutes'))
                        const accessRoutes = getAsyncRoutes( addRoutes );
                        // 动态添加格式化过的路由
                        //debugger
                        if(accessRoutes && accessRoutes.length > 0) {
                        router.addRoutes(accessRoutes);
                        window.sessionStorage.setItem('isGenerateRoutes', 'true')
                        next({ ...to, replace: true })
                        } else {
                        next()
                        }
                    })
                    
                    
                } catch (error) {
                    // Message.error('出错了')
                    next(`/user/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/user/login`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})