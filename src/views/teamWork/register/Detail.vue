<template>
  <div style="padding:7px 0px 0px 0px;">
    <h4>案件详情</h4>
    <p class='input-item'>案件来源 : {{record.casesource1}}-{{record.casesource2}}    上报人 :{{(record.reportor?record.reportor:'')}}</p>
    <p class='input-item'>案件类型 : {{record.caseTypeStr}}    上报时间 : {{record.reportDate + " " + record.reportTime}}</p>
    <p class='input-item'>案件样本 : {{record.sampleStr}}</p>
    <p class='input-item'>案件描述 : {{(record.caseDesc?record.caseDesc:'')}}</p>
    <p class='input-item'>案件位置描述 : {{(record.locationDesc?record.locationDesc:'')}}</p>
    <a-carousel autoplay v-for="(item,key) in record.files" key="{{key}}">
      <div><img class='caseImg' src='/api/{{item.url}}'></div>
    </a-carousel>
    <p class='input-item'><a @click='confirmCase(record.id)'>立案处理</a></p>
  </div>

</template>

<script>
import { Carousel } from 'ant-design-vue'

export default {
  components: {
    Carousel
  },
  mounted () {
    this.loadData(this.record)
  },
  data () {
    return {
      record:{
        "id": "402881ea72e0f7300172e1268aeb0000",
        "caseNo": null,
        "casesource1": "内部",
        "casesource2": "环卫",
        "casetype1": null,
        "casetype2": null,
        "casetype": {
          "id": "4028812272d9eacc0172dc3b184d0009",
          "typeName": "电池",
          "areaCode": null,
          "bigCode": "00001",
          "smallCode": null,
          "score": null,
          "alias": null,
          "shortcutName": null,
          "processTimeLimit": null,
          "pid": "4028812272d9eacc0172dc3ae56b0008",
          "showOrder": null,
          "delTag": 1
        },
        "managerDept": "402880e67246d72701724771fac90001",
        "manager": "402880e6726a9dbb01726b1e84680000",
        "limittimes": null,
        "casecount": null,
        "caseDesc": "ssssssssssssssssssssssssss",
        "locationDesc": null,
        "reportor": "sss",
        "contract": null,
        "reportDate": "2020-06-23",
        "reportTime": "20:26",
        "importantCase": 1,
        "repeatCase": 1,
        "address": null,
        "lng": "118.766734",
        "lat": "32.072239",
        "urgency": null,
        "casenature": null,
        "enddate": null,
        "closedate": null,
        "dealdate": null,
        "setupdate": null,
        "assigndate": null,
        "sample1": null,
        "sample2": null,
        "sample": {
          "id": "4028812272d9eacc0172dc35b8300007",
          "sampleName": "test3",
          "gridCommunity": {
            "id": "4028812272d9eacc0172d9ebd9790000",
            "gridName": "XX街道",
            "manager": "",
            "managerContactNum": null,
            "showOrder": null,
            "managerDept": "",
            "area": null,
            "gridAreaCode": null,
            "patrolManager": "",
            "icon": "#000000",
            "number": null,
            "coordinate": "118.776141,32.068082",
            "delTag": 1,
            "pid": "7c659a32b43211ea9a0300ffffff0000",
            "gridPosition": null
          },
          "supSampleId": "4028812272d9eacc0172dc35939c0006",
          "delTag": 1,
          "createTime": "2020-06-22 21:26:48",
          "updateTime": "2020-06-22 21:26:48"
        },
        "status": 1,
        "laststatus": null,
        "modfiler": null,
        "modifledate": null,
        "isduban": null,
        "dubancount": null,
        "delTag": 1,
        "files": [{
          "id": "402881ea72e0f7300172e1268b040001",
          "fileName": "u=3321238736,733069773&fm=214&gp=0.jpg",
          "url": "/avatar/90619b0085194de29032e80ffcf53513_origin.jpg",
          "thumbUrl": "/avatar/90619b0085194de29032e80ffcf53513_thumb.jpg",
          "fileType": 1
        }, {
          "id": "402881ea72e0f7300172e1268b050002",
          "fileName": "20141009224754_AswrQ.jpeg",
          "url": "/avatar/da1a55fbf57949d4bf444cf3dd2e9855_origin.jpeg",
          "thumbUrl": "/avatar/da1a55fbf57949d4bf444cf3dd2e9855_thumb.jpeg",
          "fileType": 1
        }],
        "gridCommunity": {
          "id": "4028812272d9eacc0172d9ebd9790000",
          "gridName": "XX街道",
          "manager": "",
          "managerContactNum": null,
          "showOrder": null,
          "managerDept": "",
          "area": null,
          "gridAreaCode": null,
          "patrolManager": "",
          "icon": "#000000",
          "number": null,
          "coordinate": "118.776141,32.068082",
          "delTag": 1,
          "pid": "7c659a32b43211ea9a0300ffffff0000",
          "gridPosition": null
        },
        "weight": 1,
        "lnglat": [118.766734, 32.072239],
        "_amapMarker": {
          "posContainer": [60.00000000093132, 436.82505673728883],
          "used": true,
          "count": 1
        }
      }
    }
  },
  methods: {
    loadData (record) {
      var caseType = ""
      if(record.casetype){
        caseType += record.casetype.typeName + "-"
      }
      if(record.casetype1){
        caseType += record.casetype1.typeName + "-"
      }
      if(record.casetype2){
        caseType += record.casetype2.typeName
      }
      record.caseTypeStr = caseType
      var sample = ""
      if(record.sample){
        sample += record.sample.sampleName + "-"
      }
      if(record.sample1){
        sample += record.sample1.sampleName + "-"
      }
      if(record.sample2){
        sample += record.sample2.sampleName
      }
      record.sampleStr = sample

      this,record = record
    }
  }
}
</script>
