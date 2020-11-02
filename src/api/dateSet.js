import { axios } from '@/utils/request'

const api = {
  dateSetList: '/dateSet/find',
  dateSetPost: '/dateSet/post',
  dateSetDelete: '/dateSet/delete',
  dateSetPut: '/dateSet/put'
}

export default api

export function dateSetList(parameter) {
  return axios({
    url: api.dateSetList,
    method: 'post',
    data: parameter
  })
}

export function dateSetPost(parameter) {
  return axios({
    url: api.dateSetPost,
    method: 'post',
    data: parameter
  })
}

export function dateSetDelete(parameter) {
  return axios({
    url: api.dateSetDelete,
    method: 'post',
    data: parameter
  })
}

export function dateSetPut(parameter) {
  return axios({
    url: api.dateSetPut,
    method: 'post',
    data: parameter
  })
}