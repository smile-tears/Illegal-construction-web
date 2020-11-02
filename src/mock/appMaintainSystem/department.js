import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const departmentTree = () => {
  return builder([{
    'key': 'key-01',
    'title': '研发中心',
    'testkey': '001',
    'icon': 'mail',
    'children': [{
      'key': 'key-01-01',
      'title': '后端组',
      'testkey': '011',
      'icon': null,
      // 'group': true,
      children: [{
        'key': 'key-01-01-01',
        'title': 'JAVA',
        'icon': null
      },
        {
          'key': 'key-01-01-02',
          'title': 'PHP',
          'icon': null
        },
        {
          'key': 'key-01-01-03',
          'title': 'Golang',
          'icon': null
        }
      ]
    }, {
      'key': 'key-01-02',
      'title': '前端组',
      'icon': null,
      // 'group': true,
      children: [{
        'key': 'key-01-02-01',
        'title': 'React',
        'icon': null
      },
        {
          'key': 'key-01-02-02',
          'title': 'Vue',
          'icon': null
        },
        {
          'key': 'key-01-02-03',
          'title': 'Angular',
          'icon': null
        }
      ]
    }]
  }, {
    'key': 'key-02',
    'title': '财务部',
    'icon': 'dollar',
    'children': [{
      'key': 'key-02-01',
      'title': '会计核算',
      'icon': null
    }, {
      'key': 'key-02-02',
      'title': '成本控制',
      'icon': null
    }, {
      'key': 'key-02-03',
      'title': '内部控制',
      'icon': null,
      'children': [{
        'key': 'key-02-03-01',
        'title': '财务制度建设',
        'icon': null
      },
        {
          'key': 'key-02-03-02',
          'title': '会计核算',
          'icon': null
        }
      ]
    }]
  }])
}

const totalCount = 38

const departmentList = (options) => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      departmentCode: tmpKey,
      departmentName: 'name' + tmpKey,
      departmentMask: 'No ' + tmpKey,
      departmentDesc: '描述by st',
      status: Mock.mock('@integer(0, 3)')
    })
  }

  return builder({
    parentKey: parameters.parentKey,
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const departmentPost = (options) => {
  console.log('departmentPost options', options)
  return builder({
    data: 'post success'
  })
}

const departmentPut = (options) => {
  console.log('departmentPut options', options)
  return builder({
    data: 'put success'
  })
}

const departmentDelete = (options) => {
  console.log('departmentDelete options', options)
  return builder({
    data: 'delete success'
  })
}

Mock.mock(/\/api\/department\/tree/, 'get', departmentTree)
Mock.mock(/\/api\/department\/find/, 'get', departmentList)
Mock.mock(/\/api\/department\/post/, 'post', departmentPost)
Mock.mock(/\/api\/department\/put/, 'post', departmentPut)
Mock.mock(/\/api\/department\/delete/, 'post', departmentDelete)
