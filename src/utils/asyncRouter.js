// 引入路由文件这种的公共路由
// import { constantRoutes } from '@/config/router2.config'
// import { constantRoutes } from '../router';
// Layout 组件是项目中的主页面，切换路由时，仅切换Layout中的组件
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
const layouts = ['UserLayout', 'BasicLayout', 'RouteView', 'BlankLayout', 'PageView']
export function getAsyncRoutes(routes) {
    const res = []
    // 定义路由中需要的自定名
    const keys = ['path', 'name', 'children', 'redirect', 'meta','props']
    // 遍历路由数组去重组可用的路由
    routes.forEach(item => {
        const newItem = {};
        if (item.component) {
            // 判断 item.component 是否等于 'Layout',若是则直接替换成引入的 Layout 组件
            if (layouts.includes(item.component)) {
                //newItem.component = BasicLayout
                newItem.component = (resolve) => require([`@/layouts/${item.component}`], resolve)
            } else {
                // newItem.component = resolve => require([`${item.component}`],resolve)
                //newItem.component = (() => import(`${item.component}`));
                newItem.component = (resolve) => require([`@/views/${item.component}`], resolve)
            }
        }
        for (const key in item) {
            if (keys.includes(key)) {
                newItem[key] = item[key]
            }
        }
        // 若遍历的当前路由存在子路由，需要对子路由进行递归遍历
        if (newItem.children && newItem.children.length) {
            newItem.children = getAsyncRoutes(item.children)
        }
        res.push(newItem)
    })
    // 返回处理好且可用的路由数组
    return res
}