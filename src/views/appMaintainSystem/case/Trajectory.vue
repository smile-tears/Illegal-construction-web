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
            <a-form-item label="用户名" >
                <a-tree-select
                    v-model="queryParam.userid"
                    show-search
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
                <a-button type="primary" style="margin-left: 16px;" @click="userPositionList">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
               
              </a-form-item>
            </a-col>
            <a-col :span="8">
              
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div id="containerTrace" style="width: 100%; height: calc(100vh - 300px); margin: 0 auto"></div>
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
        endTime: this.dateFormat(new Date()) + ' 18:00'
      },
      personTreeData: [],
      positions: [],
      startTime2: moment(this.dateFormat(new Date()) + ' 09:00', 'yyyy-MM-dd HH:mm'),
      endTime2: moment(this.dateFormat(new Date()) + ' 18:00', 'yyyy-MM-dd HH:mm'),
      visible: false,
    }
  },
  created() {
    this.getSubCompanyUserTree()
  },
  watch: {
    modalData(modalData) {
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
    userPositionList() {
      var param = this.queryParam
      userPositionList(qs.stringify(param))
        .then((res) => {
          if (res.code === 200) {
            this.positions = res.result.data
            this.initMap()
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
      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
        if (!PathSimplifier.supportCanvas) {
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
              var color = '#49c30a', // 绿色
                lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3))

              return {
                pathLineStyle: {
                  strokeStyle: color,
                  lineWidth: lineWidth,
                },
                pathLineSelectedStyle: {
                  lineWidth: lineWidth + 2,
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
            name: '路线0',
            path: path
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
            //width: 30,
            //height: 30,
            //content: PathSimplifier.Render.Canvas.getImageContent('./img/car.png', onload, onerror),
            //strokeStyle: null,
            //fillStyle: null,
            //经过路径的样式
            pathLinePassedStyle: {
              lineWidth: 6,
              strokeStyle: 'red',
              dirArrowStyle: {
                stepSpace: 15,
                //   strokeStyle: 'red',
              },
            },
          },
        })
        navg1.start()
      })
    },
  },
}
</script>

<style lang="less" >

</style>>
