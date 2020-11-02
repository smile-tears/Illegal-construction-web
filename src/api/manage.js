import { axios } from '@/utils/request'

const api = {
  user: '/myuser/list',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  departmentTree: '/department/tree',
  departmentList: '/department/find',
  departmentPost: '/department/post',
  departmentPut: '/department/put',
  departmentDelete: '/department/delete',
  subCompanyTree: '/subCompany/tree', // 获取组织结构树
  subCompanyTree2: '/subCompany/tree2', // 获取分部树
  subCompanyUserTree: '/subCompany/user-tree', // 带用户的组织架构树
  subCompanyList: '/subCompany/find',
  subCompanyPost: '/subCompany/post',
  subCompanyPut: '/subCompany/put',
  subCompanyDelete: '/subCompany/delete',
  userList: '/user/find',
  userPost: '/user/post',
  userPut: '/user/put',
  userDelete: '/user/delete',
  workInfoList: '/workInfo/find',
  workInfoPost: '/workInfo/post',
  workInfoPut: '/workInfo/put',
  workInfoDelete: '/workInfo/delete',
  familyInfoList: '/familyInfo/find',
  familyInfoPost: '/familyInfo/post',
  familyInfoPut: '/familyInfo/put',
  familyInfoDelete: '/familyInfo/delete',
  jobList: '/jobMask/find',
  jobPost: '/jobMask/post',
  jobPut: '/jobMask/put',
  jobDelete: '/jobMask/delete',
  teamWork: '/teamWork',
  userTree: '/subCompany/user-tree/'
}

export default api

// export function getUserList (parameter) {
//   return axios({
//     url: api.user,
//     method: 'get',
//     params: parameter
//   })
// }
export function userTree (parameter) {
  return axios({
    url: api.userTree,
    method: 'post',
    data: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}
export function getSubCompanyTree (parameter) {
  return axios({
    url: api.subCompanyTree,
    method: 'post',
    data: parameter
  })
}
export function getSubCompanyTree2 (parameter) {
  return axios({
    url: api.subCompanyTree2,
    method: 'post',
    data: parameter
  })
}
export function getSubCompanyUserTree (parameter) {
  return axios({
    url: api.subCompanyUserTree,
    method: 'post',
    data: parameter
  })
}

export function getDepartmentTree (parameter) {
  return axios({
    url: api.departmentTree,
    method: 'post',
    data: parameter
  })
}

export function getDepartmentList (parameter) {
  return axios({
    url: api.departmentList,
    method: 'post',
    params: parameter
  })
}

export function postDepartment (parameter) {
  var myurl = ''
  if (parameter.id && parameter.id !== '') {
    myurl = api.departmentPut
  } else {
    myurl = api.departmentPost
  }
  return axios({
    url: myurl,
    method: 'post',
    data: parameter
  })
}

export function deleteDepartment (parameter) {
  return axios({
    url: api.departmentDelete,
    method: 'post',
    data: parameter
  })
}

export function getSubCompanyList (parameter) {
  return axios({
    url: api.subCompanyList,
    method: 'post',
    params: parameter
  })
}

export function postSubCompany (parameter) {
  var myurl = ''
  if (parameter.id && parameter.id !== '') {
    myurl = api.subCompanyPut
  } else {
    myurl = api.subCompanyPost
  }
  return axios({
    url: myurl,
    method: 'post',
    data: parameter
  })
}

export function deleteSubCompany (parameter) {
  return axios({
    url: api.subCompanyDelete,
    method: 'post',
    data: parameter
  })
}

export function getUserList (parameter) {
  return axios({
    url: api.userList,
    method: 'post',
    params: parameter
  })
}
export function postUser (parameter) {
  var myurl = ''
  if (parameter.id && parameter.id !== '') {
    myurl = api.userPut
  } else {
    myurl = api.userPost
  }
  return axios({
    url: myurl,
    method: 'post',
    data: parameter
  })
}
export function deleteUser (parameter) {
  return axios({
    url: api.userDelete,
    method: 'post',
    data: parameter
  })
}

export function getWorkInfoList (parameter) {
  return axios({
    url: api.workInfoList,
    method: 'post',
    params: parameter
  })
}
export function postWorkInfo (parameter) {
  var myurl = ''
  if (parameter.id && parameter.id !== '') {
    myurl = api.workInfoPut
  } else {
    myurl = api.workInfoPost
  }
  return axios({
    url: myurl,
    method: 'post',
    data: parameter
  })
}
export function deleteWorkInfo (parameter) {
  return axios({
    url: api.workInfoDelete,
    method: 'post',
    data: parameter
  })
}

export function getFamilyInfoList (parameter) {
  return axios({
    url: api.familyInfoList,
    method: 'post',
    params: parameter
  })
}
export function postFamilyInfo (parameter) {
  var myurl = ''
  if (parameter.id && parameter.id !== '') {
    myurl = api.familyInfoPut
  } else {
    myurl = api.familyInfoPost
  }
  return axios({
    url: myurl,
    method: 'post',
    data: parameter
  })
}
export function deleteFamilyInfo (parameter) {
  return axios({
    url: api.familyInfoDelete,
    method: 'post',
    data: parameter
  })
}

export function getJobList (parameter) {
  return axios({
    url: api.jobList,
    method: 'post',
    params: parameter
  })
}

export function postJobMask (parameter) {
  var myurl = ''
  if (parameter.id && parameter.id !== '') {
    myurl = api.jobPut
  } else {
    myurl = api.jobPost
  }
  return axios({
    url: myurl,
    method: 'post',
    data: parameter
  })
}

export function deleteJob (parameter) {
  return axios({
    url: api.jobDelete,
    method: 'post',
    data: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function getRegisterOutTimeList (parameter) {
  return axios({
    url: api.teamWork,
    method: 'get',
    params: parameter
  })
}
