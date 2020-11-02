import { axios } from '@/utils/request'

const api = {
  sampleTree: '/sample/tree',
  sampleList: '/sample/find',
  samplePost: '/sample/post',
  sampleDelete: '/sample/delete',
  samplePut: '/sample/put'
}

export default api

export function sampleTree(parameter) {
  return axios({
    url: api.sampleTree,
    method: 'post',
    data: parameter
  })
}

export function sampleList(parameter) {
  return axios({
    url: api.sampleList,
    method: 'post',
    data: parameter
  })
}

export function samplePost(parameter) {
  return axios({
    url: api.samplePost,
    method: 'post',
    data: parameter
  })
}

export function sampleDelete(parameter) {
  return axios({
    url: api.sampleDelete,
    method: 'post',
    data: parameter
  })
}

export function samplePut(parameter) {
  return axios({
    url: api.samplePut,
    method: 'post',
    data: parameter
  })
}