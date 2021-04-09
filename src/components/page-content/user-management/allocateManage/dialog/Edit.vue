<template>
  <div class="StockEntryAddDialog">
    <el-dialog
      :visible="visible"
      @open="open"
      @close="close"
      title="编辑"
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
            <el-form-item label="申请部门" prop="departId">
              <el-input v-model="stockEntry.departId" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调配单号" prop="smartAllotId">
              <el-input v-model="stockEntry.smartAllotId" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="createId">
              <el-input v-model="stockEntry.createId" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="stockEntry.remark" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">
            <el-form-item label="目前状态" prop="condition">
              <el-select v-model="stockEntry.condition" clearable>
                <el-option label="初始录入" value="1"></el-option>
                <el-option label="审核中" value="2"></el-option>
                <el-option label="审核通过" value="3"></el-option>
                <el-option label="审核不通过" value="4"></el-option>
                <el-option label="已完成" value="5"></el-option>
              </el-select>
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
import Api from "@/assets/api/Api";

export default {
  name: "assetsEditDialog",
  props: {
    visible: {
      default: false,
    },
    data: {
      default: {},
    },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入数量"));
      } else if (value > this.stockEntry.currentNum) {
        callback(new Error("修改数量不能大于目前数量"));
      } else {
        callback();
      }
    };
    return {
      stockEntry: {
        departId: "",
        materialCode: "",
        materialName: "",
        materialUsing: "",
        materialFree: "",
        materialBroken: "",
        oldStatus: "",
        newStatus: "",
        currentNum: "",
        num: "",
      },
      rules: {
        oldStatus: [
          { required: true, message: "请选择目前状态", trigger: "change" },
        ],
        newStatus: [
          { required: true, message: "请选择目标状态", trigger: "change" },
        ],
        num: [
          { required: true, message: "请输入", trigger: "change" },
          { type: "number", message: "数量必须为数字值" },
          { validator: validatePass, trigger: "blur" },
        ],
      },
      deptOptions: [],
      materialOptions: [],
      loading: false,
    };
  },
  methods: {
    open() {
      this.stockEntry.currentNum = "";
      if (this.$refs.form) {
        this.$refs["form"].resetFields();
      }
      this.stockEntry = Object.assign(this.stockEntry, this.data);
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
      let api = Api.assetsEntry.updateList;
      this.$ajax
        .request(api, this.stockEntry)
        .then(() => {
          this.loading = false;
          this.close();
          this.$emit("finish");
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) "~style/all.less";

</style>