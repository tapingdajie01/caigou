<style  scoped>
.search {
  padding: 20px 0 0 20px;
  margin-bottom: 50px;
}
.charts {
  width: 100%;
  height: 400px;
}
</style>
<template>
  <div v-loading="loading" element-loading-text="正在初始化，请稍候...">
    <div class="search">
      <span style="font-size: 14px">部门：</span>
      <el-select
        :disabled="selectDisabled"
        @visible-change="handleChange"
        @remove-tag="removeChange"
        v-model="departIds"
        multiple
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
    </div>
    <el-row>
      <el-col :span="12">
        <div ref="leftCharts" :style="charts"></div>
      </el-col>
      <el-col :span="12">
        <div ref="rightCharts" :style="charts"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Api from "@/assets/api/Api";
import GbObject from "@/project/var/GbObject";
export default {
  name: "assetCharts",
  data() {
    return {
      loading: false,
      departIds: [],
      selectDisabled: false,
      deptOptions: [],
      charts: {
        width: "100%",
        height: "",
      },
    };
  },
  methods: {
    initDept() {
      this.$ajax
        .request(Api.assetsEntry.getDept, {})
        .then((resp) => {
          this.deptOptions = resp;
          let tokenKey = process.env.NODE_ENV !== 'development' ?'cache_app_h5login_user_cache_production' : 'cache_app_h5login_user_cache';
          let userInfo = localStorage.getItem(tokenKey);
          let roleId = JSON.parse(userInfo).roleId;
          if (roleId == "9") {
            this.selectDisabled = false;
          } else {
            this.departIds = [JSON.parse(userInfo).departId];
            this.selectDisabled = true;
          }
          this.getInfo();
        })
        .catch(() => {
          alert("查询出错，请联系系统管理员");
        });
    },
    handleChange(val) {
      if (!val) {
        this.getInfo();
      }
    },
    removeChange() {
      this.getInfo();
    },
    getInfo() {
      this.loading = true;
      this.$ajax
        .request(Api.assetsEntry.inventoryAsset, {
          departIds: this.departIds.join(),
        })
        .then((resp) => {
          if (resp && resp instanceof Array) {
            this.createLeftCharts(resp);
            this.createRightCharts(resp);
          } else {
            this.createLeftCharts(false);
            this.createRightCharts(false);
          }
        })
        .finally(() => (this.loading = false));
    },
    createLeftCharts(data) {
      let xdata = [];
      let echartsData = [];
      let sum = 0;
      if (data) {
        echartsData = data.map((item) => {
          let temp = {
            value: item.materialCount,
            name: item.materialName,
          };
          return temp;
        });
        xdata = data.map((item) => {
          return item.materialName;
        });
        sum = data.reduce(function (prev, cur) {
          return cur.materialCount + prev;
        }, 0);
      }
      let myCharts = GbObject.echarts.init(this.$refs.leftCharts);
      let option = {
        graphic: [
          {
            type: "text",
            left: "center",
            top: "60%",
            style: {
              fill: "#000",
              text: "总量",
              color: "#000",
            },
          },
          {
            type: "text",
            left: "center",
            top: "50%",
            z: 10,
            style: {
              text: sum,
              font: "16px Microsoft YaHei bold",
              fill: "#000",
            },
          },
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          data: xdata,
        },
        color: [
          "#5470c6",
          "#91cc75",
          "#fac858",
          "#ee6666",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
        ],
        series: [
          {
            name: "资产明细",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: echartsData,
          },
        ],
      };
      myCharts.setOption(option, true);
    },
    createRightCharts(data) {
      let xData = [];
      let usingData = [];
      let freeData = [];
      let brokenData = [];
      let lossData = [];
      let usingRate = [];
      if (data) {
        usingData = data.map((item) => {
          return item.materialUsing;
        });
        freeData = data.map((item) => {
          return item.materialFree;
        });
        brokenData = data.map((item) => {
          return item.materialBroken;
        });
        lossData = data.map((item) => {
          return item.materialLoss;
        });
        usingRate = data.map((item) => {
          return item.materialRate;
        });
        xData = data.map((item) => {
          return item.materialName;
        });
      }
      let myCharts = GbObject.echarts.init(this.$refs.rightCharts);
      let option = (option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["在用", "闲置", "损坏", "耗损", "在用率"],
          bottom: 10,
        },
        xAxis: [
          {
            type: "category",
            data: xData,
            axisPointer: {
              type: "shadow",
            },
            axisLabel:{
              textStyle: {
                fontSize : 10      //更改坐标轴文字大小
              }
              
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
          },
          {
            type: "value",
            name: "占用率",
            min: 0,
            max: 100,
            axisLabel: {
              formatter: "{value} %",
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },

            splitLine: {
              //网格线
              show: false,
            },
          },
        ],
        color: [
          "#5470c6",
          "#91cc75",
          "#fac858",
          "#ee6666",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
        ],
        dataZoom: [
          {
            type: "inside",
          },
        ],
        series: [
          {
            name: "在用",
            type: "bar",
            data: usingData,
          },
          {
            name: "闲置",
            type: "bar",
            data: freeData,
          },
          {
            name: "损坏",
            type: "bar",
            data: brokenData,
          },
          {
            name: "耗损",
            type: "bar",
            data: lossData,
          },
          {
            name: "在用率",
            type: "line",
            smooth: true,
            yAxisIndex: 1,
            data: usingRate,
          },
        ],
      });
      myCharts.setOption(option, true);
    },
  },
  created() {
    this.charts.height = window.innerHeight - 250 + "px";
  },
  mounted() {
    this.initDept();
  },
};
</script>

<style>
</style>