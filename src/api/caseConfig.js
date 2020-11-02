const caseType = {
  待分派: {
    status: 2,
    count: 0,
    options: [{
      label: '分派',
      value: 3
    }, {
      label: '结案',
      value: 10
    }]
  },
  案件处置: {
    status: 3,
    count: 0,
    options: [{
      label: '申请结案',
      value: 4
    }, {
      label: '申请延期',
      value: 8
    }, {
      label: '申请回退',
      value: 7
    }]
  },
  处置反馈件: {
    status: 4,
    count: 0,
    options: [{
      label: '派遣核查',
      value: 5
    }, {
      label: '不同意结案【重新分派】',
      value: 3
    }, {
      label: '结案',
      value: 10
    }]
  },
  案件核查: {
    status: 5,
    count: 0,
    options: [{
      label: '申请结案',
      value: 6
    }, {
      label: '申请延期',
      value: 8
    }, {
      label: '申请回退',
      value: 7
    }]
  },
  核查反馈件: {
    status: 6,
    count: 0,
    options: [{
      label: '同意结案',
      value: 10
    }, {
      label: '退回',
      value: 5
    }]
  },
  申请回退: {
    status: 7,
    count: 0,
    options: [{
      label: '同意回退',
      value: 2
    }, {
      label: '不同意回退',
      value: 'laststatus'
    }]
  },
  申请延期: {
    status: 8,
    count: 0,
    options: [{
      label: '同意延期',
      value: 'laststatus1'
    }, {
      label: '不同意延期',
      value: 'laststatus2'
    }]
  },
  处置中件: {
    count: 0,
    status: 3
  },
  核查中件: {
    count: 0,
    status: 5
  }
}
const caseSource1 = [
  '环卫',
  '执法',
  '区12319转办',
  '专项普查',
  '区12345转办',
  '巡查现场已解决',
  '领导交办',
  '区政府交办',
  '信息采集监督员巡查',
  '标准化现场督察',
  '视频抓拍',
  '网格化执法巡查',
  '水务'
]

const caseSource2 = ['微信平台', '视频对接', '市局转办', '市12345转办', '市12319转办', '群众来访', '新媒体举报']

const caseStatusObj = {
  '0': '上报',
  '1': '立案',
  '2': '分派',
  '3': '案件处置',
  '4': '处置反馈件',
  '5': '案件核查',
  '6': '核查反馈件',
  '7': '申请回退',
  '8': '申请延期'
}

const caseColors = {
  '0': 'green',
  '1': 'yellow',
  '2': 'red'
}

export default {
  caseType: caseType,
  caseSource1: caseSource1,
  caseSource2: caseSource2,
  caseStatusObj: caseStatusObj,
  caseColors: caseColors
}
