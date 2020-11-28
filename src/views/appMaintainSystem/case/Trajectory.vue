<template>
  <div>
    <a-modal
      v-if="modalData.title !== undefined"
      :title="modalData.title"
      :width="1200"
      :visible="visible"
      :confirmLoading="false"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button @click="handleCancel"> 关闭 </a-button>
      </template>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="用户名">
                <a-tree-select
                    v-model="queryParam.userid"
                    show-search
                    treeNodeFilterProp="title"
                    style="width: 250px"
                    :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                    :tree-data="personTreeData"
                    placeholder
                    tree-default-expand-all
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :span="16">
              <a-form-item label="时间段">
                <a-date-picker
                  v-model="startTime2"
                  placeholder="开始时间"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  @change="(value, dateString) => (queryParam.startTime = dateString)"
                />
                ~
                <a-date-picker
                  v-model="endTime2"
                  placeholder="结束时间"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  @change="(value, dateString) => (queryParam.endTime = dateString)"
                />
                <a-button type="primary" style="margin-left: 16px" @click="userPositionList">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
              </a-form-item>
            </a-col>
            <a-col :span="8"> </a-col>
          </a-row>
        </a-form>
      </div>
      <div id="containerTrace" style="float: left;width: 80%; height: calc(100vh - 250px); margin: 0 auto"></div>
      <div id="right-container" style="float: left;width: 20%;">
        <a-table
          class="show-table"
          :columns="columns"
          :data-source="tableData"
          rowKey="id"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            'show-total': total => `共 ${total} 条`
          }"
          @change="change"
        >
        </a-table>
      </div>
      <div style="clear: both;"></div>
    </a-modal>
  </div>
</template>

<script>
import { getSubCompanyTree, getSubCompanyUserTree } from '@/api/manage'
import { userPositionList } from '@/api/userPosition'
import qs from 'qs'
import moment from 'moment'
export default {
  props: ['modalData'],
  data() {
    return {
      queryParam: {
        startTime: this.dateFormat(new Date()) + ' 09:00',
        endTime: this.dateFormat(new Date()) + ' 18:00',
      },
      personTreeData: [],
      positions: [],
      startTime2: undefined,
      endTime2: undefined,
      visible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '巡查记录',
          dataIndex: 'uploadTime',
          key: 'uploadTime'
        },
      ],
      tableData: []
    }
  },
  created() {
    this.getSubCompanyUserTree()
  },
  watch: {
    modalData(modalData) {
      var date = new Date()
      var date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0)
      var date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0)
      this.startTime2 = moment(date1, 'yyyy-MM-dd HH:mm')
      this.endTime2 = moment(date2, 'yyyy-MM-dd HH:mm')
      this.visible = modalData.visible
      // if (modalData.visible === true) {
      //   this.queryParam.userid = modalData.userid
      //   this.queryParam = {
      //     userid: this.modalData.userid,
      //   }
      //   this.userPositionList()
      // }
    },
  },
  methods: {
    change (pagination, filters, sorter) {
      this.pagination = pagination
      this.userPositionList('tableDataChange')
    },
    dateFormat(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day
    },
    userPositionList(type) {
      var param = this.queryParam
      Object.assign(param, {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      })
      
      if (param.userid === undefined || param.userid === '') {
        this.$message.error('请选择人员！')
        return
      }
      userPositionList(qs.stringify(param))
        .then((res) => {
          if (res.code === 200) {
            if (type && type == 'tableDataChange') {

            } else {
              this.positions = res.result.data
              this.initMap()
            }
            this.pagination.total = res.result.totalCount
            this.tableData = res.result.tableData
          }
        })
        .catch(() => {})
    },
    onChange(value, dateString) {
      // console.log('Selected Time: ', value)
      // console.log('Formatted Selected Time: ', dateString)
    },
    onOk(value) {
      // console.log('onOk: ', value)
    },
    getSubCompanyUserTree() {
      getSubCompanyUserTree()
        .then((res) => {
          if (res.code === 200) {
            this.personTreeData = res.result
          }
        })
        .catch(() => {})
    },
    handleCancel() {
      this.visible = false
      this.modalData.visible = false
    },
    initMap() {
      var that = this
      //创建地图
      var map = new AMap.Map('containerTrace', {
        zoom: 15,
      })
      AMapUI.load(
        ['ui/misc/PathSimplifier', 'lib/$', 'ui/misc/PointSimplifier'],
        function (PathSimplifier, $, PointSimplifier) {
          if (!PathSimplifier.supportCanvas || !PointSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！')
            return
          }
          var pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            //autoSetFitView:false,
            map: map, //所属的地图实例

            getPath: function (pathData, pathIndex) {
              return pathData.path
            },
            renderOptions: {
              //renderAllPointsIfNumberBelow: 100, //绘制路线节点，如不需要可设置为-1
              pathLineStyle: {
                dirArrowStyle: true,
              },
              getPathStyle: function (pathItem, zoom) {
                var color = '#1b83bd', // 绿色
                //lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3))
                lineWidth = 5

                return {
                  pathLineStyle: {
                    strokeStyle: color,
                    lineWidth: lineWidth,
                  },
                  pathLineSelectedStyle: {
                    lineWidth: lineWidth ,
                  },
                  pathNavigatorStyle: {
                    fillStyle: color,
                  },
                }
              },
            },
          })

          window.pathSimplifierIns = pathSimplifierIns

          //设置数据
          var path = []
          that.positions.forEach((position) => {
            path.push([position.lng, position.lat])
          })
          pathSimplifierIns.setData([
            {
              name: '人员轨迹',
              path: path,
            },
          ])
          function onload() {
            pathSimplifierIns.renderLater()
          }

          function onerror(e) {
            alert('图片加载失败！')
          }
          //对第一条线路（即索引 0）创建一个巡航器
          var navg1 = pathSimplifierIns.createPathNavigator(0, {
            loop: true, //循环播放
            speed: 10000,
            //speed: 1000000, //巡航速度，单位千米/小时
            pathNavigatorStyle: {
              pathLinePassedStyle: {
                lineWidth: 5,
                strokeStyle: 'green',
                dirArrowStyle: {
                  stepSpace: 15,
                  //   strokeStyle: 'red',
                },
              },
            },
          })
          navg1.start()

          var pointSimplifierIns = new PointSimplifier({
            zIndex: 300,
            map: map,
            //maxChildrenOfQuadNode:3,
            getPosition: function (item) {
              if (!item) return null
              return [item[0], item[1]]
            },
            getHoverTitle: function (dataItem, idx) {
              return ''
            },
            renderOptions: {
              //点的样式
              pointStyle: {
                //绘制点占据的矩形区域
                content: PointSimplifier.Render.Canvas.getImageContent(
                  '/img/location.png',
                  function onload() {
                    pointSimplifierIns.renderLater()
                  },
                  function onerror(e) {
                    alert('图片加载失败！')
                  }
                ),
                //宽度
                width: 25,
                //高度
                height: 31,
                //定位点为底部中心
                offset: ['-50%', '-100%'],
                fillStyle: null,
                strokeStyle: null,
              },
            },
          })

          window.pointSimplifierIns = pointSimplifierIns
          pointSimplifierIns.setData(path)
        }
      )
    },
  },
}
</script>

<style lang="less" scoped>
  /deep/ .show-table td {
    padding: 8px 16px !important;
  }
  /deep/ .show-table th {
    padding: 8px 16px !important;
  }
</style>
