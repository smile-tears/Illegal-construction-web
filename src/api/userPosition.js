import { axios } from '@/utils/request'

const api = {
  userPositionList: '/userPosition/find',
  userPositionPost: '/userPosition/post',
  userPositionDelete: '/userPosition/delete',
  userPositionPut: '/userPosition/put'
}

export default api

export function userPositionList(parameter) {
  return axios({
    url: api.userPositionList,
    method: 'post',
    data: parameter
  })
}

export function userPositionPost(parameter) {
  return axios({
    url: api.userPositionPost,
    method: 'post',
    data: parameter
  })
}

export function userPositionDelete(parameter) {
  return axios({
    url: api.userPositionDelete,
    method: 'post',
    data: parameter
  })
}

export function userPositionPut(parameter) {
  return axios({
    url: api.userPositionPut,
    method: 'post',
    data: parameter
  })
}