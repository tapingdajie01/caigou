<style scoped>
.line_charts {
  width: 100%;
  height: 400px;
}
</style>
<template>
  <el-dialog
    width="80%"
    title="数据分析"
    :visible="visible"
    @open="open"
    @close="close"
  >
    <div v-loading="loading" element-loading-text="加载中，请稍候...">
      <div id="line_charts" class="line_charts"></div>
    </div>
  </el-dialog>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: false,
      xData: ["行政部", "仓储部", "财务部", "人资部", "研发部"],
      legendData: ["物资一", "物资二", "物资三", "物资四", "物资五"]
    };
  },
  methods: {
    initEcharts() {
    this.loading = false;
      let myChart = echarts.init(
        document.getElementById("line_charts"),
        "light"
      );
      let option = {
        xAxis: {
          data: this.xData,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 20,
          },
        },
        grid: {
          left: 30,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: this.legendData,
        },
        dataZoom: [
          {
            type: "inside",
          },
        ],
        series: [
          {
            name: "物资一",
            smooth: true,
            type: "line",
            data: ["100","300","500","200","600"],
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: "物资二",
            smooth: true,
            type: "line",
            data: ["400","800","500","700","300"],
            animationDuration: 2800,
            animationEasing: "quadraticOut",
          },
          {
            name: "物资三",
            smooth: true,
            type: "line",
            data: ["400","800","500","700","300"],
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: "物资四",
            smooth: true,
            type: "line",
            data: ["100","300","200","600","900"],
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: "物资五",
            smooth: true,
            type: "line",
            data: ["400","200","300","500","800"],
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          }
        ],
      };
      myChart.clear();
      myChart.setOption(option, true);
    },
    open() {
        this.loading = true;
        setTimeout(() =>{
            this.initEcharts();
        },500)
      
    },
    
    close() {
      this.$emit("update:visible", false);
    },
  },
};
</script>
