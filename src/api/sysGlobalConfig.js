import { axios } from '@/utils/request'

const api = {
  sysGlobalConfigList: '/sysGlobalConfig/find',
  sysGlobalConfigPost: '/sysGlobalConfig/post',
  sysGlobalConfigPut: '/sysGlobalConfig/put'
}

export default api

export function sysGlobalConfigList(parameter) {
  return axios({
    url: api.sysGlobalConfigList,
    method: 'post',
    data: parameter
  })
}

export function sysGlobalConfigPost(parameter) {
  return axios({
    url: api.sysGlobalConfigPost,
    method: 'post',
    data: parameter
  })
}


export function sysGlobalConfigPut(parameter) {
  return axios({
    url: api.sysGlobalConfigPut,
    method: 'post',
    data: parameter
  })
}