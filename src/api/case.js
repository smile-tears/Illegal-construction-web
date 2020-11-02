import { axios } from '@/utils/request'

const api = {
  caseInfoCityType: '/caseInfoCity/type',
  caseInfoCityList: '/caseInfoCity/find',
  caseInfoCityList2: '/caseInfoCity/find2',
  caseInfoCityPost: '/caseInfoCity/post',
  caseInfoCityDelete: '/caseInfoCity/delete',
  caseInfoCityPut: '/caseInfoCity/put',
  caseInfoFileCityDelete: '/caseInfoFileCity/delete',
  caseReportData: '/caseInfoCity/caseReportData',

  caseInfoRequestLogCityPost: '/caseInfoRequestLogCity/post',
  caseInfoRequestLogCityPut: '/caseInfoRequestLogCity/put',
  caseInfoRequestLogCityList: '/caseInfoRequestLogCity/find'

}

export default api

export function caseInfoRequestLogCityPost (parameter) {
  return axios({
    url: api.caseInfoRequestLogCityPost,
    method: 'post',
    data: parameter
  })
}

export function caseInfoRequestLogCityPut (parameter) {
  return axios({
    url: api.caseInfoRequestLogCityPut,
    method: 'post',
    data: parameter
  })
}
export function caseInfoCityType (parameter) {
  return axios({
    url: api.caseInfoCityType,
    method: 'post',
    data: parameter
  })
}
export function caseInfoRequestLogCityList (parameter) {
  return axios({
    url: api.caseInfoRequestLogCityList,
    method: 'post',
    data: parameter
  })
}

export function caseInfoCityList (parameter) {
  return axios({
    url: api.caseInfoCityList,
    method: 'post',
    data: parameter
  })
}

export function caseInfoCityList2(parameter) {
  return axios({
    url: api.caseInfoCityList2,
    method: 'post',
    data: parameter
  })
}

export function caseInfoCityPost(parameter) {
  return axios({
    url: api.caseInfoCityPost,
    method: 'post',
    data: parameter
  })
}

export function caseInfoCityDelete(parameter) {
  return axios({
    url: api.caseInfoCityDelete,
    method: 'post',
    data: parameter
  })
}

export function caseInfoCityPut(parameter) {
  return axios({
    url: api.caseInfoCityPut,
    method: 'post',
    data: parameter
  })
}

export function caseInfoFileCityDelete (parameter) {
  return axios({
    url: api.caseInfoFileCityDelete,
    method: 'post',
    data: parameter
  })
}

export function caseReportData (parameter) {
  return axios({
    url: api.caseReportData,
    method: 'post',
    data: parameter
  })
}
