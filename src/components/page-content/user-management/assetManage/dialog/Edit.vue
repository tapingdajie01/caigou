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
            <el-form-item label="资产编码" prop="materialCode">
              <el-input v-model="stockEntry.materialCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产名称" prop="materialName">
              <el-input v-model="stockEntry.materialName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">
            <el-form-item label="目前状态" prop="oldStatus">
              <el-select @change="handleChange" v-model="stockEntry.oldStatus">
                <el-option label="使用中" value="using"></el-option>
                <el-option label="闲置中" value="free"></el-option>
                <el-option label="已损坏" value="broken"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目前数量" prop="currentNum">
              <el-input v-model="stockEntry.currentNum" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">
            <el-form-item label="目标状态" prop="newStatus">
              <el-select v-model="stockEntry.newStatus">
                <el-option label="使用中" value="using"></el-option>
                <el-option label="闲置中" value="free"></el-option>
                <el-option label="已损坏" value="broken"></el-option>
                <el-option label="已损耗" value="loss"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="num">
              <el-input
                v-model.number="stockEntry.num"
                :disabled="!stockEntry.currentNum"
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
    </el-dialog>
  </div>
</template>

<script>
import StockEntryModel from "@/project/model/StockEntryModel";
import Api from "@/assets/api/Api";
import DialogUtil from "@/util/DialogUtil";

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
    handleChange(val) {
      if (val) {
        switch (val) {
          case "using":
            this.stockEntry.currentNum = this.stockEntry.materialUsing;
            this.stockEntry.num = "";
            this.$refs["form"].clearValidate();
            break;
          case "free":
            this.stockEntry.currentNum = this.stockEntry.materialFree;
            this.stockEntry.num = "";
            this.$refs["form"].clearValidate();
            break;
          case "broken":
            this.stockEntry.currentNum = this.stockEntry.materialBroken;
            this.stockEntry.num = "";
            this.$refs["form"].clearValidate();
            break;
          case "loss":
            this.stockEntry.currentNum = this.stockEntry.materialLoss;
            this.stockEntry.num = "";
            this.$refs["form"].clearValidate();
            break;
        }
      } else {
        this.stockEntry.currentNum = "";
        this.stockEntry.num = "";
        this.$refs["form"].clearValidate();
      }
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
      let api = Api.assetsEntry.update;
      this.$ajax
        .request(api, this.stockEntry)
        .then((resp) => {
          this.loading = false;
          this.close();
          DialogUtil.toastSuccess(resp.data || '提交成功');
          this.$emit("finish");
        })
        .catch(() => {
          this.loading = false;
          alert('系统出错，请稍后再试！');
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) "~style/all.less";

.StockEntryAddDialog {
}
</style>