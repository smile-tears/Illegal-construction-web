import { axios } from '@/utils/request'

const api = {
  roleList: '/role/find',
  rolePost: '/role/post',
  roleDelete: '/role/delete',
  rolePut: '/role/put',
  userRolePost: '/user_Role/post',
  userRoleDelete: '/user_Role/delete',
  userRoleList: '/user_Role/find'
}

export default api

export function roleList (parameter) {
  return axios({
    url: api.roleList,
    method: 'post',
    data: parameter
  })
}

export function rolePost (parameter) {
  return axios({
    url: api.rolePost,
    method: 'post',
    data: parameter
  })
}

export function roleDelete (parameter) {
  return axios({
    url: api.roleDelete,
    method: 'post',
    data: parameter
  })
}

export function rolePut (parameter) {
  return axios({
    url: api.rolePut,
    method: 'post',
    data: parameter
  })
}

export function userRolePost (parameter) {
  return axios({
    url: api.userRolePost,
    method: 'post',
    data: parameter
  })
}

export function userRoleDelete (parameter) {
  return axios({
    url: api.userRoleDelete,
    method: 'post',
    data: parameter
  })
}

export function userRoleList (parameter) {
  return axios({
    url: api.userRoleList,
    method: 'post',
    data: parameter
  })
}
