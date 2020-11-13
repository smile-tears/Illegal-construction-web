import { axios } from '@/utils/request'

const api = {
  gridCommunityList: '/gridCommunity/find',
  gridCommunityPost: '/gridCommunity/post',
  gridCommunityDelete: '/gridCommunity/delete',
  gridCommunityPut: '/gridCommunity/put',
  gridTree: '/gridCommunity/tree',
  idAndName: '/gridCommunity/idAndName',
  userIdAndName: '/gridCommunity/userIdAndName',
  checkGridName: '/gridCommunity/checkGridName',
  getTelephone: '/gridCommunity/getTelephone',
  callVideo: '/jPush/'
}

export default api

export function jPush(userId) {
  return axios({
    url: api.callVideo + userId,
    method: 'get'
  })
}

export function getTelephone(parameter) {
  return axios({
    url: api.getTelephone,
    method: 'post',
    data: parameter
  })
}

export function checkGridName(parameter) {
  return axios({
    url: api.checkGridName,
    method: 'post',
    data: parameter
  })
}

export function userIdAndName(parameter) {
  return axios({
    url: api.userIdAndName,
    method: 'post',
    data: parameter
  })
}

export function idAndName(parameter) {
  return axios({
    url: api.idAndName,
    method: 'post',
    data: parameter
  })
}

export function gridCommunityList(parameter) {
  return axios({
    url: api.gridCommunityList,
    method: 'post',
    data: parameter
  })
}

export function gridCommunityPost(parameter) {
  return axios({
    url: api.gridCommunityPost,
    method: 'post',
    data: parameter
  })
}

export function gridCommunityDelete(parameter) {
  return axios({
    url: api.gridCommunityDelete,
    method: 'post',
    data: parameter
  })
}

export function gridCommunityPut(parameter) {
  return axios({
    url: api.gridCommunityPut,
    method: 'post',
    data: parameter
  })
}
export function gridTree (parameter) {
  return axios({
    url: api.gridTree,
    method: 'post',
    data: parameter
  })
}