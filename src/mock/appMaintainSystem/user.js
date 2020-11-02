import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 38

const userList = (options) => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1
  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    const item = {
      key: tmpKey,
      username: 'user' + tmpKey,
      name: 'realName' + tmpKey,
      telephone: '123456789',
      email: '123@163.com',
      sex: Mock.mock('@integer(1, 2)'),
      isShowPhone: Mock.mock('@integer(1, 2)'),
      isChangePass: Mock.mock('@integer(1, 2)'),
      status: Mock.mock('@integer(1, 2)'),
      lastLoginTime: Mock.mock('@datetime')
    }
    result.push(item)
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const userPost = (options) => {
  console.log('userPost options', options)
  return builder({
    data: 'post success'
  })
}

const userPut = (options) => {
  console.log('userPut options', options)
  return builder({
    data: 'put success'
  })
}

const userDelete = (options) => {
  console.log('departmentDelete options', options)
  return builder({
    data: 'delete success'
  })
}

Mock.mock(/\/api\/user\/find/, 'post', userList)
Mock.mock(/\/api\/user\/post/, 'post', userPost)
Mock.mock(/\/api\/user\/put/, 'post', userPut)
Mock.mock(/\/api\/user\/delete/, 'post', userDelete)
