import { axios } from '@/utils/request'

const api = {
  questionTypeList: '/questionType/find',
  questionTypePost: '/questionType/post',
  questionTypeDelete: '/questionType/delete',
  questionTypePut: '/questionType/put',
  questionTypeFstLvl: '/questionType/fstLvl',
  questionTypeSecLvl: '/questionType/secLvl',
}

export default api

export function questionTypeFstLvl(parameter) {
  return axios({
    url: api.questionTypeFstLvl,
    method: 'post',
    data: parameter
  })
}

export function questionTypeSecLvl(parameter) {
  return axios({
    url: api.questionTypeSecLvl,
    method: 'post',
    data: parameter
  })
}

export function questionTypeList(parameter) {
  return axios({
    url: api.questionTypeList,
    method: 'post',
    data: parameter
  })
}

export function questionTypePost(parameter) {
  return axios({
    url: api.questionTypePost,
    method: 'post',
    data: parameter
  })
}

export function questionTypeDelete(parameter) {
  return axios({
    url: api.questionTypeDelete,
    method: 'post',
    data: parameter
  })
}

export function questionTypePut(parameter) {
  return axios({
    url: api.questionTypePut,
    method: 'post',
    data: parameter
  })
}