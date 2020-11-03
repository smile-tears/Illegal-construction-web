import { axios } from '@/utils/request'

const api = {
  companyManageList: '/companyManage/find',
  companyManagePost: '/companyManage/post',
  companyManageDelete: '/companyManage/delete',
  companyManagePut: '/companyManage/put'
}

export default api

export function companyManageList(parameter) {
  return axios({
    url: api.companyManageList,
    method: 'post',
    data: parameter
  })
}

export function companyManagePost(parameter) {
  return axios({
    url: api.companyManagePost,
    method: 'post',
    data: parameter
  })
}

export function companyManageDelete(parameter) {
  return axios({
    url: api.companyManageDelete,
    method: 'post',
    data: parameter
  })
}

export function companyManagePut(parameter) {
  return axios({
    url: api.companyManagePut,
    method: 'post',
    data: parameter
  })
}