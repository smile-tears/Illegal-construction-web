<template>
  <div>
    <a-modal
      :title="modalData.title"
      :width="800"
      :visible="modalData.visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :layout="formLayout" :form="form">
          <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
            <a-input :disabled="modalData.disabled" v-decorator="['id', {}]"/>
          </a-form-item>
          <a-form-item style="margin-left: 35px" label="网格名称" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <a-input style="width: 250px" :disabled="modalData.disabled" v-decorator="['gridName',
          {rules: [{ required: true, message: '请输入网格名称', whitespace: true}, {validator: checkName}]}
          ]"/>
          </a-form-item>
          <a-form-item label="责任人" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <a-tree-select
              :disable-branch-nodes="true"
              :disabled="modalData.disabled"
              v-decorator="['manager', {initialValue:''}]"
              style="width: 250px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="depUserTreeData"
              placeholder="Please select"
              tree-default-expand-all
              @select="initTelephone"
            ></a-tree-select>
          </a-form-item>
          <a-form-item label="责任人联系方式" :label-col="{span: 8}" :wrapper-col="{span: 16}" v-show="true">
            <a-input style="width: 249px" :disabled="modalData.disabled" v-decorator="['managerContactNum', {}]"/>
          </a-form-item>
          <a-form-item label="责任部门" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <!--<a-input :disabled="modalData.disabled" v-decorator="['managerDept', {}]"/>-->
            <a-tree-select
              :disabled="modalData.disabled"
              v-decorator="['managerDept', {initialValue:''} ]"
              style="width: 250px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="depTreeData"
              placeholder="Please select"
              tree-default-expand-all
            ></a-tree-select>
          </a-form-item>
          <a-form-item style="margin-left: 40px" label="区域编号" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <a-input  style="width: 250px" :disabled="modalData.disabled" v-decorator="['number', {}]"/>
          </a-form-item>
          <a-form-item label="显示顺序" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <a-input-number  style="width: 250px" :disabled="modalData.disabled" :min="0" v-decorator="['showOrder', {}]" />
          </a-form-item>


          <a-form-item style="margin-left: 40px" label="巡查人员" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <a-tree-select
              :disable-branch-nodes="true"
              :disabled="modalData.disabled"
              v-decorator="['patrolManager', {initialValue:''}]"
              style="width: 250px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="depUserTreeData"
              placeholder="Please select"
              tree-default-expand-all
            ></a-tree-select>
          </a-form-item>

          <a-form-item label="网格颜色" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <colorPicker  style="width: 250px" :disabled="modalData.disabled"   v-decorator="['icon', {initialValue:'#000000'}]"></colorPicker>
          </a-form-item>

          <a-form-item style="width: 500px;margin-left: 16px;" label="网格中心坐标" :label-col="{span:5}" :wrapper-col="{span:19}" v-show="true">
            <a-input style="width: 250px;"  :disabled="modalData.disabled" v-decorator="['coordinate', {}]" />
            <a-button type="primary" :disabled="modalData.disabled" style="margin-left: 20px" @click="openMap">地图标注</a-button>
          </a-form-item>

          <a-form-item label="网格区域"  :label-col="{span: 3}"
                       :wrapper-col="{span: 21}"
                       style="width: 669px;margin-left: 35px" v-show="true">
            <a-textarea :disabled="modalData.disabled" v-decorator="['gridPosition', {}]"/>
          </a-form-item>
          <a-form-item label="父级菜单" style="margin-left: 35px" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <a-tree-select
              :disabled="modalData.disabled"
              v-decorator="['pid', { rules: [{ required: true, message: '父级菜单必填！' }] }]"
              style="width: 250px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="Please select"
              tree-default-expand-all
            ></a-tree-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <div id="drawGrid">
      <a-modal
        title="地图标注"
        :visible="mapVisiable"
        :confirm-loading="confirmLoading"
        :width="900"
        :height="550"
        @ok="mapOk"
        @cancel="mapCancel"
      >
        <DrawGrid @positionValue="getPosition" :record="recordValue" />
      </a-modal>
    </div>

  </div>
</template>

<script>
  import {gridCommunityPost, gridCommunityPut, gridTree,checkGridName,getTelephone} from '@/api/gridCommunity'
  import { getSubCompanyTree,getSubCompanyUserTree} from '@/api/manage'
  import colorPicker from './color-picker'
  import DrawGrid from './DrawGrid'
  export default {
    // eslint-disable-next-line vue/require-prop-types
    components: { colorPicker,DrawGrid },
    props: ['modalData'],
    created() {
      this.getGridTree();
      this.getGridDepTree();
      this.getGridDepUserTree();
    },

    data() {
      return {
        eventBus: this.$EventBus(this),
        labelCol: {
          span: 6
        },
        wrapperCol: {
          span: 18
        },
        formLayout: 'inline',
        confirmLoading: false,
        treeData: [],
        depTreeData:[],
        depUserTreeData:[],
        mapVisiable:false,
        mapPosition:null,
        recordValue:null
      }
    },
    watch: {
      modalData(modalData) {
        this.form.resetFields();
        if (modalData.visible === true) {
          this.$nextTick(() => {
            delete this.modalData.record.delTag;
            if (!this.modalData.record.id) {
              this.modalData.record.visible = 0
            }
            this.parseTree(this.depTreeData,0);
            this.parseTree(this.depUserTreeData,1);
            //console.log(this.depTreeData);
            Object.keys(this.modalData.record).forEach(key=>{
              if(this.modalData.record[key] == null)
              {
                this.modalData.record[key] = '';
              }
            });
            delete this.modalData.record.visible;
            this.form.setFieldsValue({...this.modalData.record});
          });

        }
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
      // console.log('form::', this.form)
    },
    mounted() {
      let that = this;
      this.eventBus.$on('refreshGridTree', function (res) {
        that.getGridTree();
      })
    },
    methods: {
      getPosition(data){
        this.mapPosition = data;
      },
      mapOk(){
        this.form.setFieldsValue({'coordinate':this.mapPosition});
        this.mapVisiable = false;
      },
      mapCancel(){
        this.mapVisiable = false;
      },
      openMap(){
        this.mapVisiable = true;
        this.recordValue = this.modalData.record;
      },
      handleOk() {
        // 触发表单验证
        this.form.validateFields((err, values) => {
          // 验证表单没错误
          if (!err) {
            // console.log('form values', values)
            var api = values.id === undefined ? gridCommunityPost : gridCommunityPut;
            values.delTag = 1;
            /* let index = values.manager.indexOf("（");
             values.managerContactNum=values.manager.substring(index+1,values.manager.length-1);
             values.manager = values.manager.substring(0,index);*/
            api(values)
              .then(res => {
                if (res.code === 200) {
                  this.$emit('handleModalEvent', res);
                  this.getGridTree();
                  this.handleCancel()
                } else {
                  this.$message.error(res.message)
                }
              })
              .catch(() => {
              })
          }
        })
      },
      handleCancel() {
        this.modalData.visible = false
      },
      getGridTree() {
        gridTree()
          .then(res => {
            if (res.code === 200) {
              this.treeData = res.result
            }
          })
          .catch(() => {
          })
      },
      getGridDepTree() {
        getSubCompanyTree()
          .then(res => {
            if (res.code === 200) {
              this.depTreeData = res.result
            }
          })
          .catch(() => {
          })
      },
      getGridDepUserTree() {
        getSubCompanyUserTree()
          .then(res => {
            if (res.code === 200) {
              this.depUserTreeData = res.result
            }
          })
          .catch(() => {
          })
      },
      //为组织结构树中的分部节点增加disabled属性
      parseTree (treeData,type) {
        for(var i in treeData) {
          if(treeData[i].type === "subCompany") {
            treeData[i].disabled = true
            if(treeData[i]["children"] && treeData[i]["children"].length > 0 ) {
              this.parseTree(treeData[i]["children"],type)
            }
          }
          if(treeData[i].type === "department" && type==1) {
            treeData[i].disabled = true
          }
        }
      },
      checkName (rule, value, callback){
        const name = value;
        let id = '';//新增
        if(this.modalData.title == '编辑网格管理')
        {
          id = this.modalData.record.id;
        }
        const param = 'name='+name+'&id='+id;
        if (name) {
          if (/\s/.test(name)) {
            callback('输入存在空格,请检查', 'input Spaces, please check');
            return;
          }
          checkGridName(param).then((res) => {
            if(res.code == 500)
            {
              callback('网格名称已存在', 'GridName  already exists');
              return;
            }else {
              callback();
            }
          })
        } else {
          callback('该字段是必填项', 'The field is required');
          return;
        }

      },
      initTelephone(id){
        const param = 'id='+id;
        getTelephone(param)
          .then(res => {
            if (res.code === 200) {
              if(res.result!=undefined && res.result !="")
              {
                this.form.setFieldsValue({'managerContactNum':res.result});
              }
            }
          })
          .catch(() => {
          })
      }

    }
  }
</script>