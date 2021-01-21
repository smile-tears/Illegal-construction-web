import { axios } from '@/utils/request'

const api = {
  messageList: '/message/find',
  messagePost: '/message/post',
  messageDelete: '/message/delete'
}

export default api

export function messageList (parameter) {
  return axios({
    url: api.messageList,
    method: 'post',
    data: parameter
  })
}

export function messagePost (parameter) {
  return axios({
    url: api.messagePost,
    method: 'post',
    data: parameter
  })
}

export function messageDelete (parameter) {
  return axios({
    url: api.messageDelete,
    method: 'post',
    data: parameter
  })
}
