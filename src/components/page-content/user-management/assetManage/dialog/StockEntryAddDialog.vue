<template>
  <div class="StockEntryAddDialog">
    <el-dialog
      :visible="visible"
      @open="open"
      @close="close"
      title="新增"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        v-loading="loading"
        element-loading-text="提交中，请稍候..."
        :model="stockEntry"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="使用单位" prop="departId">
              <el-select
                clearable
                v-model="stockEntry.departId"
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
          <el-col :span="12">
            <el-form-item label="资产编码" prop="materialCode">
              <el-select v-model="stockEntry.materialCode" placeholder="请选择">
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
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="12">
            <el-form-item label="数量" prop="num">
              <el-input v-model.number="stockEntry.num"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center mt-xs">
        <el-button type="primary" @click.native="clickSubmit('form')"
          >保存提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StockEntryModel from "@/project/model/StockEntryModel";
import ElButtonSubmit from "@/components/common/button/ElButtonSubmit";
import Api from "@/assets/api/Api";
import DialogUtil from "@/util/DialogUtil";

export default {
  name: "assetsAddDialog",
  components: { ElButtonSubmit },
  props: {
    visible: {
      default: false,
    },
  },
  data() {
    return {
      stockEntry: {
        departId: "",
        materialCode: "",
        num: "",
      },
      rules: {
        departId: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        materialCode: [
          { required: true, message: "请选择资产名称", trigger: "change" },
        ],
        num: [
          { required: true, message: "请输入数量", trigger: "change" },
          { type: "number", message: "数量必须为数字值" },
        ],
      },
      deptOptions: [],
      materialOptions: [],
      loading: false
    };
  },
  methods: {
    open() {
      this.initDept();
      this.initMarial();
      if(this.$refs.form){
        this.$refs['form'].resetFields();
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
    submit(){
      this.loading = true;
      let api = Api.assetsEntry.insert;
      this.$ajax.request(api, this.stockEntry).then((resp) => {
        this.loading = false;
        this.close();
        DialogUtil.toastSuccess(resp.data || '提交成功');
        this.$emit("finish");
      }).catch(()=>{
        this.loading = false;
        alert('系统出错，请稍后再试！')
        this.close();
      });
    }
  },
};
</script>

<style lang="less" scoped>
@import (reference) "~style/all.less";

.StockEntryAddDialog {
}
</style>