<template>
  <div
    class="appap"
    style="width: 90%; margin: 0 auto"
    v-loading="loading"
    element-loading-text="加载中"
  >
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <p class="title">全量数据维护</p>

        <el-upload
          :multiple="false"
          ref="upload"
          :limit="1"
          :disabled="disFlag"
          action
          :on-exceed="onExceed"
          :on-change="onChange"
          :on-remove="onRemove"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="default" :disabled="disFlag"
            >选择文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            :disabled="disFlag"
            type="success"
            icon="el-icon-upload2"
            @click="importAllData"
            >导入全部数据</el-button
          >
          <el-button
            type="primary"
            :disabled="disFlag"
            icon="el-icon-download"
            size="small"
            @click.native="download"
            >导出全部数据
          </el-button>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <p class="title">使用单位数据维护</p>
        <el-upload
          :multiple="false"
          ref="upload2"
          :limit="1"
          action
          :on-exceed="onExceed2"
          :on-change="onChange2"
          :on-remove="onRemove2"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="default"
            >选择文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            icon="el-icon-upload2"
            @click="importAllData2"
            >导入使用单位数据</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-download"
            size="small"
            @click.native="download2"
            >导出使用单位数据
          </el-button>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DialogUtil from "@/util/DialogUtil";
import Api from "@/assets/api/Api";
import axios from "axios";
import UserHandle from "@/project/user/UserHandle";
import Config from "@/assets/Config";

export default {
  name: "aappap",
  data() {
    return {
      loading: false,
      fileList: [],
      fileList2: [],
      disFlag: true
    };
  },
  methods: {
    onChange(file, fileList) {
      this.fileList = fileList;
    },
    onExceed() {
      this.$alert("一次最多只能上传一个文件", "提示", { type: "error" });
    },
    onRemove(file, fileList) {
      this.fileList2 = fileList;
    },
    onChange2(file, fileList) {
      this.fileList2 = fileList;
    },
    onExceed2() {
      this.$alert("一次最多只能上传一个文件", "提示", { type: "error" });
    },
    onRemove2(file, fileList) {
      this.fileList2 = fileList;
    },
    importAllData() {
      if (this.fileList.length == 0) {
        return this.$alert("请先选择需要导入的文件!", "提示", {
          type: "error",
        });
      }
      this.loading = true;
      let form = new FormData();
      for (let i = 0; i < this.fileList.length; i++) {
        form.append("sqlFile", this.fileList[i].raw);
      }
      axios({
        baseURL: Config.domain,
        url: "/database",
        method: "post",
        headers: {
          Authorization: UserHandle.getLoginUser().token,
          "content-type": "multipart/form-data",
        },
        data: form,
      })
        .then((res) => {
          this.loading = false;
          if(res.data.code == 200){
            DialogUtil.toastSuccess("导出成功！");
          }else {
            this.$alert(res.data.data, "提示", { type: "error" });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$alert("操作失败，请稍后再试！", "提示", { type: "error" });
        });
    },
    download() {
      // 下载表格
      this.loading = true;
      let req = {
        responseType: "blob",
      };
      axios({
        method: "get",
        baseURL: Config.domain,
        url: "/database",
        params: req,
        contentType: "application/json",
        responseType: "blob",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: UserHandle.getLoginUser().token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          this.loading = false;
          DialogUtil.toastSuccess("下载成功！");
          let obj = res.data;
          if (window.navigator && window.navigator.msSaveBlob) {
            //ie浏览器
            window.navigator.msSaveBlob(
              obj,
              decodeURIComponent("返回数据.zip")
            );
          } else if (window.URL && window.URL.createObjectURL) {
            //其他浏览器
            let url = window.URL.createObjectURL(obj);
            let a = document.createElement("a");
            a.href = url;
            a.download = decodeURIComponent("返回数据.zip");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            this.$alert("您的浏览器不支持下载此文件", "下载文件失败", {
              type: "error",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          alert("操作失败，请稍后再试！");
        });
    },
    importAllData2() {
      if (this.fileList2.length == 0) {
        return this.$alert("请先选择需要导入的文件!", "提示", {
          type: "error",
        });
      }
      this.loading = true;
      let form = new FormData();
      for (let i = 0; i < this.fileList2.length; i++) {
        form.append("sqlFile", this.fileList2[i].raw);
      }
      axios({
        baseURL: Config.domain,
        url: "/database/departInventory",
        method: "post",
        headers: {
          Authorization: UserHandle.getLoginUser().token,
          "content-type": "multipart/form-data",
        },
        data: form,
      })
        .then(res => {
          this.loading = false;
          if(res.data.code == 200){
            DialogUtil.toastSuccess("导入成功！数据同步已完成");
          }else {
            this.$alert(res.data.data, "提示", { type: "error" });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$alert("操作失败，请稍后再试！", "提示", { type: "error" });
        });
    },
    download2() {
      // 下载表格
      this.loading = true;
      let req = {
        responseType: "blob",
      };
      axios({
        method: "get",
        baseURL: Config.domain,
        url: "/database/departInventory",
        params: req,
        contentType: "application/json",
        responseType: "blob",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: UserHandle.getLoginUser().token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          this.loading = false;
          DialogUtil.toastSuccess("下载成功！");
          let obj = res.data;
          if (window.navigator && window.navigator.msSaveBlob) {
            //ie浏览器
            window.navigator.msSaveBlob(
              obj,
              decodeURIComponent("返回数据.txt")
            );
          } else if (window.URL && window.URL.createObjectURL) {
            //其他浏览器
            let url = window.URL.createObjectURL(obj);
            let a = document.createElement("a");
            a.href = url;
            a.download = decodeURIComponent("返回数据.txt");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            this.$alert("您的浏览器不支持下载此文件", "下载文件失败", {
              type: "error",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          alert("操作失败，请稍后再试！");
        });
    }
  },
  mounted(){
    let tokenKey = process.env.NODE_ENV !== 'development' ?'cache_app_h5login_user_cache_production' : 'cache_app_h5login_user_cache';
    let userInfo = localStorage.getItem(tokenKey);
    let roleId = JSON.parse(userInfo).roleId;
    if (roleId == "9") {
      this.disFlag = false;
    } else {
       this.disFlag = true;
    }
  }
};
</script>

<style scoped>
@import url("/ /unpkg.com/element-ui@2.15.0/lib/theme-chalk/index.css");
</style>