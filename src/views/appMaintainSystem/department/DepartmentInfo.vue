<template>

  <a-card :bordered="false">
    <detail-list title="分部信息" v-if="isSubCompany">
      <detail-list-item term="分部编号">{{subCompany.subCompanyCode}}</detail-list-item>
      <detail-list-item term="分部名称">{{subCompany.subCompanyName}}</detail-list-item>
      <detail-list-item term="上级分部">{{supSubCompanyName}}</detail-list-item>
      <detail-list-item term="状态">{{statusObj[subCompany.canceled]}}</detail-list-item>
      <detail-list-item term="排序">{{subCompany.showOrder}}</detail-list-item>
      <detail-list-item term="是否独立站点">{{aloneSiteObj[subCompany.aloneSite]}}</detail-list-item>
    </detail-list>

    <detail-list title="部门信息" v-else="">
      <detail-list-item term="部门编号">{{department.departmentCode}}</detail-list-item>
      <detail-list-item term="部门名称">{{department.departmentName}}</detail-list-item>
      <detail-list-item term="部门简称">{{department.departmentMask}}</detail-list-item>
      <detail-list-item term="上级部门">{{supDeptName}}</detail-list-item>
      <detail-list-item term="状态">{{statusObj[department.canceled]}}</detail-list-item>
      <detail-list-item term="排序">{{department.showOrder}}</detail-list-item>
      <detail-list-item term="所属分部">{{subCompanyName}}</detail-list-item>
      <detail-list-item term="描述">{{department.departmentDesc}}</detail-list-item>
    </detail-list>


  </a-card>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
import { getDepartmentList, getSubCompanyList } from '@/api/manage'

export default {
  name: 'DepartmentInfo',
  components:{
    DetailList,
    DetailListItem
  },
  data () {
    return {
      isSubCompany : false,
      department: {},
      subCompany : {},
      supSubCompanyName: "",
      supDeptName: "",
      subCompanyName: "",
      statusObj:{
        0: "启用",
        1: "封存"
      },
      aloneSiteObj:{
        0: '是',
        1:'否'
      }
    }
  },
  mounted () {

  },
  methods: {
    loadData (type, key) {
      const _this = this
      _this.isSubCompany = {}
      _this.department = {}
      _this.supSubCompanyName = ""
      _this.supDeptName = ""
      _this.subCompanyName = ""

      _this.isSubCompany = (type === 'subCompany')
      if(_this.isSubCompany){
        getSubCompanyList({ id: key }).then(res => {
          _this.subCompany = res.result.data[0]

          getSubCompanyList({ id: _this.subCompany.supSubCompanyId }).then(res => {
            console.log(" res.result.data[0]", res.result.data[0])
            if(res.result.data[0])
            _this.supSubCompanyName = res.result.data[0].subCompanyName
          })
        })
      } else {
        getDepartmentList({ id: key }).then(res => {
          _this.department = res.result.data[0]

          getSubCompanyList({ id: _this.department.subCompanyId }).then(res => {
            if(res.result.data[0])
            _this.subCompanyName = res.result.data[0].subCompanyName
          })
          getDepartmentList({ id: _this.department.supDeptId }).then(res => {
            if(res.result.data[0])
            _this.supDeptName = res.result.data[0].departmentName
          })
        })
      }
    },
  }
}
</script>
