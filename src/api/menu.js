import { axios } from '@/utils/request'

const api = {
  userMenuTree: '/menu/user-tree',
  menuTree: '/menu/tree',
  menuList: '/menu/find',
  menuPost: '/menu/post',
  menuDelete: '/menu/delete',
  menuPut: '/menu/put',
  roleMenuPost: '/role_Menu/post',
  roleMenuList: '/role_Menu/find',
  userMenuPost: '/userMenu/post',
  userMenuList: '/userMenu/find'
}

export default api

export function userMenuPost (parameter) {
  return axios({
    url: api.userMenuPost,
    method: 'post',
    data: parameter
  })
}

export function userMenuList (parameter) {
  return axios({
    url: api.userMenuList,
    method: 'post',
    data: parameter
  })
}

export function roleMenuPost (parameter) {
  return axios({
    url: api.roleMenuPost,
    method: 'post',
    data: parameter
  })
}

export function roleMenuList (parameter) {
  return axios({
    url: api.roleMenuList,
    method: 'post',
    data: parameter
  })
}

export function menuTree (parameter) {
  return axios({
    url: api.menuTree,
    method: 'post',
    data: parameter
  })
}

export function userMenuTree (parameter) {
  return axios({
    url: api.userMenuTree,
    method: 'post',
    data: parameter
  })
}

export function menuList (parameter) {
  return axios({
    url: api.menuList,
    method: 'post',
    data: parameter
  })
}

export function menuPost (parameter) {
  return axios({
    url: api.menuPost,
    method: 'post',
    data: parameter
  })
}

export function menuDelete (parameter) {
  return axios({
    url: api.menuDelete,
    method: 'post',
    data: parameter
  })
}

export function menuPut (parameter) {
  return axios({
    url: api.menuPut,
    method: 'post',
    data: parameter
  })
}
