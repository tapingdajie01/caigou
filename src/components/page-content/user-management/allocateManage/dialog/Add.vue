<template>
  <div class="StockEntryAddDialog">
    <el-dialog
      :visible="visible"
      @open="open"
      @close="close"
      title="新增调配单"
      :close-on-click-modal="false"
    >
      <div class="cont_body">
        <el-form
        v-if="flag_tt"
          ref="form"
          v-loading="loading"
          element-loading-text="提交中，请稍候..."
          :model="stockEntry"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="使用单位"
                prop="departId"
                :rules="[
                  {
                    required: true,
                    message: '请选择申请部门',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-select
                  clearable
                  v-model="stockEntry.departId"
                  @change="deptChange"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in deptOptions"
                    :key="item.departKey"
                    :label="item.departValue"
                    :value="item.departKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-for="(item, index) in stockEntry.idList"
            :key="index"
            style="
              margin-top: 10px;
              border-bottom: 1px solid #ccc;
              position: relative;
            "
          >
            <el-col :span="10">
              <el-form-item label="资产名称">
                <el-select
                  v-model="item.materialId"
                  @change="handleChange(index)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in materialOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="数量">
                <el-input
                  v-model="item.applicationNum"
                  @change="handleChange(index)"
                ></el-input>
              </el-form-item>
            </el-col>
            <div
              v-for="(items, indexs) in item.supportDepartList"
              :key="indexs"
            >
              <el-col :span="8">
                <el-form-item
                  :label="items.sourceId == '0' ? '部门' : '仓库'"
                >
                  <el-input v-model="items.departName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="闲置数量">
                  <el-input v-model="items.materialFreeNum" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="提供数量">
                  <el-input v-model="items.supportNum"></el-input>
                </el-form-item>
              </el-col>
            </div>
            <i
              v-if="item.index == 0"
              class="el-icon-circle-plus-outline add_btn"
              @click="addList"
              title="点击新增其他资产"
            ></i>
            <i
              v-else
              class="el-icon-remove-outline add_btn"
              @click="deleteList(item.index)"
            ></i>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="20">
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  v-model="stockEntry.remark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        
        <div class="text-center mt-xs">
          <el-button type="primary" @click.native="clickSubmit('form')"
            >保存提交
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/assets/api/Api";
import DialogUtil from "@/util/DialogUtil";
export default {
  name: "allocateManageAddDialog",
  components: {},
  props: {
    visible: {
      default: false,
    },
  },
  data() {
    return {
      stockEntry: {
        departId: "",
        remark: "",
        idList: [
          {
            materialId: "",
            applicationNum: "",
            supportDepartList: [],
            index: 0,
          },
        ],
      },
      deptOptions: [],
      materialOptions: [],
      loading: false,
      index: 1,
      flag_tt: true
    };
  },
  methods: {
    addList() {
      this.stockEntry.idList.push({
        materialId: "",
        applicationNum: "",
        supportDepartList: [],
        index: this.index,
      });
      this.index++;
    },
    deleteList(i) {
      let tempobj = this.stockEntry.idList.find((o) => {
        return o.index == i;
      });
      this.stockEntry.idList.splice(this.stockEntry.idList.indexOf(tempobj), 1);
    },
    deptChange() {
      this.stockEntry.idList = [
        {
          materialId: "",
          applicationNum: "",
          supportDepartList: [],
          index: 0,
        },
      ];
    },
    handleChange(index) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (
            this.stockEntry.idList[index].materialId == "" ||
            this.stockEntry.idList[index].applicationNum == ""
          ) {
            return false;
          }
          this.loading = true;
          let reqData = {
            departId: this.stockEntry.departId,
            materialId: this.stockEntry.idList[index].materialId,
            num: this.stockEntry.idList[index].applicationNum,
          };
          this.$ajax
            .request(Api.assetsEntry.scheme, reqData)
            .then((resp) => {
              if(resp =="数量不足"){
                this.loading = false;
                DialogUtil.toastWarning("数量不足");
              }else{
                this.stockEntry.idList[index].supportDepartList = resp;
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
              alert("查询出错，请联系系统管理员");
            });
        } else {
          return false;
        }
      });
    },
    open() {
      this.initDept();
      this.initMarial();
      if (this.$refs.form) {
        this.$refs["form"].resetFields();
        this.stockEntry.idList = [
          {
            materialId: "",
            applicationNum: "",
            supportDepartList: [],
            index: 0,
          },
        ];
      }
    },
    initDept() {
      this.$ajax
        .request(Api.assetsEntry.getDept, {})
        .then((resp) => {
          this.deptOptions = resp;
        })
        .catch(() => {
          alert("查询出错，请联系系统管理员");
        });
    },
    initMarial() {
      this.$ajax
        .request(Api.material.list, {})
        .then((resp) => {
          this.materialOptions = resp.list;
        })
        .catch(() => {
          alert("查询出错，请联系系统管理员");
        });
    },
    close() {
      this.$emit("update:visible", false);
    },
    clickSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      this.loading = true;
      let api = Api.assetsEntry.insertList;
      let reqData = Object.assign({}, this.stockEntry);
      let tokenKey = process.env.NODE_ENV !== 'development' ?'cache_app_h5login_user_cache_production' : 'cache_app_h5login_user_cache';
      let userInfo = localStorage.getItem(tokenKey);
      reqData.proposer = JSON.parse(userInfo).userName;
      this.$ajax
        .request(api, reqData)
        .then(() => {
          this.loading = false;
          this.close();
          DialogUtil.toastSuccess('提交成功！');
          this.$emit("finish");
        })
        .catch(() => {
          this.loading = false;
          alert('系统出错，请稍后再试！')
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) "~style/all.less";
.cont_body {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.add_btn {
  color: #409eff;
  font-size: 18px;
  font-weight: 550;
  position: absolute;
  right: 20px;
  top: 5px;
}
</style>