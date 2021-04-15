<template>
  <div class="t_container">
        <header class="t_h_bg">
            <span>领导看板</span>
        </header>
        <el-row :gutter="10">
            <el-col :span="12">
                <div class="t_box">
                    <header class="t_title">
                        <span>本月采购额：</span>
                        <span class="t_number" style="color: aquamarine;">230000.00</span>
                    </header>
                    <div id="chart_1" class="echart" style="width: 100%; height: 300px;"></div>
                </div>
                
            </el-col>
            <el-col :span="12">
                <div class="t_box">
                    <header class="t_title">
                    <span>分类采购统计</span>
                </header>
                <div id="chart_2" class="echart" style="width: 100%; height: 300px;"></div>
                </div>
                
            </el-col>
            </el-row>
            <el-row style="margin-top:15px" :gutter="10">
            <el-col :span="12">
                <div class="t_box">
                    <header class="t_title">
                    <span>年度采购额走势图</span>
                </header>
                <div id="chart_3" class="echart" style="width: 100%; height: 355px;"></div>
                </div>
                
            </el-col>
            <el-col :span="12">
                <div class="t_box">
                    <div class="tb" style="font-size: 10px;">
                        <h3>库存情况</h3>
                        <table class="table1">
                            <tr style="height:30px;" class="tb_title"><td></td><td>2017/11/8</td><td>2017/11/15</td><td>2017/11/22</td><td>2017/11/29</td></tr>
                            <td>家纺成品</td><td>87,892,687</td><td>82,954,627</td><td>75,825,942</td><td>80,094,867</td></tr>
                        <tr><td>坯布</td><td>79,616,338</td><td>63,914,752</td><td>8,4783,826</td><td>9,8170,970</td></tr>
                        <tr><td>印染布</td><td>93,435,263</td><td>80,879,546</td><td>72,900,346</td><td>95,863,826</td></tr>
                        <tr><td>面纱</td><td>75,013,325</td><td>72,443,447</td><td>68,968,409</td><td>99,197,853</td></tr>
                        <tr><td>原棉</td><td>64,657,032</td><td>95,932,747</td><td>67,671,029</td><td>75,813,436</td></tr>
                        <tr><td>其他</td><td>64,549,296</td><td>81,638,306</td><td>70,066,027</td><td>63,719,823</td></tr>
                        <tr><td>总计</td><td>755,0149,41</td><td>745,430,494</td><td>716,866,157</td><td>800,212,856</td></tr>
                        </table>
                    </div>
                </div>
                
            </el-col>
        </el-row>
        
    </div>
</template>

<script>
import echarts from "echarts";
export default {
  methods: {
    echart_1() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("chart_1"));
      var xAxisData = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
      ];
      var legendData = ["3月", "4月"];
      var title = "2021年度3月,4月采购额"; //标题
      var serieData = [];
      var metaDate = [
        [
          1200,
          1400,
          1000,
          1200,
          3000,
          2300,
          1300,
          1700,
          1400,
          1200,
          3000,
          2300,
          2400,
          2100,
          2800,
          3100,
          3000,
          2800,
          2700,
          2900,
        ],
        [
          2000,
          1200,
          3000,
          2000,
          1700,
          3000,
          2000,
          1800,
          2000,
          1900,
          3000,
          2000,
          2500,
          2200,
          2600,
          2700,
          2900,
          3000,
          3200,
          3100,
        ],
      ];
      for (var v = 0; v < legendData.length; v++) {
        var serie = {
          name: legendData[v],
          type: "line",
          symbol: "circle",
          symbolSize: 10,
          data: metaDate[v],
        };
        serieData.push(serie);
      }
      var colors = ["#036BC8", "#FFF", "#5EBEFC", "#2EF7F3"];
      var option = {
        // backgroundColor: '#0f375f',
        title: {
          text: title,
          textAlign: "left",
          textStyle: {
            color: "#fff",
            fontSize: "12",
            fontWeight: "bold",
          },
        },
        legend: {
          show: true,
          left: "center",
          data: legendData,
          y: "5%",
          itemWidth: 18,
          itemHeight: 12,
          textStyle: {
            color: "#fff",
            fontSize: 14,
          },
        },
        toolbox: {
          orient: "vertical",
          right: "1%",
          top: "20%",
          iconStyle: {
            color: "#fff",
            borderColor: "#fff",
            borderWidth: 1,
          },
          feature: {
            saveAsImage: {},
            magicType: {
              // show: true,
              type: ["line", "bar", "stack", "tiled"],
            },
          },
        },
        color: colors,
        grid: {
          left: "2%",
          top: "12%",
          bottom: "5%",
          right: "5%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#6173A3",
              },
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: "#9ea7c4",
                fontSize: 12,
              },
            },
            axisTick: {
              show: false,
            },
            data: xAxisData,
          },
        ],
        yAxis: [
          {
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#9ea7c4",
                fontSize: 12,
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#6173A3",
              },
            },
          },
        ],
        series: serieData,
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    echart_2() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("chart_2"));
      var giftImageUrl =
        "data:image/png;base64,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";
      myChart.setOption({
        graphic: {
          elements: [
            {
              type: "image",
              style: {
                image: giftImageUrl,
                width: 30,
                height: 30,
              },
              left: "73%",
              top: "center",
            },
          ],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["销售额"],
          left: "27%",
        },
        grid: {
          left: "1%",
          right: "60%",
          top: "10%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          position: "top",
          splitLine: { show: false },
          boundaryGap: [0, 0.01],
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#9ea7c4",
              fontSize: 12,
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#6173A3",
            },
          },
        },
        yAxis: {
          type: "category",
          data: ["办公用品", "信息话项目", "日用品", "劳保用品", "工程设备	"],
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#9ea7c4",
              fontSize: 12,
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#6173A3",
            },
          },
        },
        series: [
          {
            name: "",
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = [
                    "#C1232B",
                    "#B5C334",
                    "#FCCE10",
                    "#E87C25",
                    "#27727B",
                    "#FE8463",
                    "#9BCA63",
                    "#FAD860",
                    "#F3A43B",
                    "#60C0DD",
                    "#D7504B",
                    "#C6E579",
                    "#F4E001",
                    "#F0805A",
                    "#26C0C0",
                  ];
                  return colorList[params.dataIndex];
                },
                shadowBlur: 20,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            type: "bar",
            data: [260, 210, 190, 170, 170],
          },
          {
            type: "pie",
            radius: [30, "80%"],
            center: ["75%", "50%"],
            roseType: "radius",
            color: [
              "#C1232B",
              "#B5C334",
              "#FCCE10",
              "#E87C25",
              "#27727B",
              "#FE8463",
              "#9BCA63",
              "#FAD860",
              "#F3A43B",
              "#60C0DD",
              "#D7504B",
              "#C6E579",
              "#F4E001",
              "#F0805A",
              "#26C0C0",
            ],
            data: [
              {
                value: 26,
                name: "办公用品",
              },
              {
                value: 21,
                name: "信息化项目",
              },
              {
                value: 19,
                name: "日用品",
              },
              {
                value: 17,
                name: "劳保用品",
              },
              {
                value: 17,
                name: "工程设备",
              },
            ],
            label: {
              normal: {
                textStyle: {
                  fontSize: 14,
                },
                formatter: function (param) {
                  return param.name + ":\n" + Math.round(param.percent) + "%";
                },
              },
            },
            labelLine: {
              normal: {
                smooth: true,
                lineStyle: {
                  width: 2,
                },
              },
            },
            itemStyle: {
              normal: {
                shadowBlur: 30,
                shadowColor: "rgba(0, 0, 0, 0.4)",
              },
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      });
    },
    echart_3() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("chart_3"));

      let option = {
        // backgroundColor: "#404A59",
        color: ["#036BC8", "#5EBEFC", "#2EF7F3"],

        title: [
          {
            text: "",
            left: "1%",
            top: "6%",
            textStyle: {
              color: "#fff",
            },
          },
          {
            text: "",
            left: "83%",
            top: "6%",
            textAlign: "center",
            textStyle: {
              color: "#fff",
              fontSize: 16,
            },
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          x: 300,
          top: "7%",
          textStyle: {
            color: "#ffd285",
          },
          data: ["2016年", "2017年", "2018年"],
        },
        grid: {
          left: "1%",
          right: "28%",
          top: "16%",
          bottom: "6%",
          containLabel: true,
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          boundaryGap: false,
          data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#fff",
            },
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#fff",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          type: "value",
        },
        series: [
          {
            name: "",
            smooth: true,
            type: "line",
            symbolSize: 9,
            symbol: "circle",
            data: [90, 50, 39, 50, 120, 82, 80, 89, 92, 80, 102, 77],
          },
          {
            name: "",
            smooth: true,
            type: "line",
            symbolSize: 9,
            symbol: "circle",
            data: [70, 50, 50, 87, 90, 80, 70, 77, 86, 94, 96, 99],
          },
          {
            name: "",
            smooth: true,
            type: "line",
            symbolSize: 9,
            symbol: "circle",
            data: [100, 112, 80, 132, 60, 70, 90, 131, 121, 102, 95, 105],
          },
          {
            type: "pie",
            center: ["83%", "33%"],
            radius: ["30%", "35%"],
            label: {
              normal: {
                position: "center",
              },
            },
            data: [
              {
                value: 335,
                name: "销售分析",
                itemStyle: {
                  normal: {
                    color: "#FF7E45",
                  },
                },
                label: {
                  normal: {
                    formatter: "{d} %",
                    textStyle: {
                      color: "#ffd285",
                      fontSize: 14,
                    },
                  },
                },
              },
              {
                value: 180,
                name: "占位",
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: "#fff",
                  },
                },
                label: {
                  normal: {
                    textStyle: {
                      color: "#ffd285",
                    },
                    formatter: "\n采购渠道",
                  },
                },
              },
            ],
          },

          {
            type: "pie",
            center: ["83%", "72%"],
            radius: ["30%", "35%"],
            label: {
              normal: {
                position: "center",
              },
            },
            data: [
              {
                value: 435,
                name: "销售分析",
                itemStyle: {
                  normal: {
                    color: "#4834CB",
                  },
                },
                label: {
                  normal: {
                    formatter: "{d} %",
                    textStyle: {
                      color: "#fff",
                      fontSize: 14,
                    },
                  },
                },
              },
              {
                value: 100,
                name: "占位",
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: "#fff",
                  },
                },
                label: {
                  normal: {
                    textStyle: {
                      color: "#fff",
                    },
                    formatter: "\n采购方向",
                  },
                },
              },
            ],
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  },
  mounted() {
    this.echart_1();
    this.echart_2();
    this.echart_3();
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
/*正文内容*/
.t_container {
  background: url(img/bg.png) no-repeat;
  background-size: 100% 100%;
overflow-x: hidden;
}
.t_h_bg {
  width: 100%;
  height: 80px;
  line-height: 80px;
  background: url(img/t_header.png) no-repeat;
  background-size: 100% 100%;
  text-align: center;
}
.t_h_bg span {
  font-size: 32px;
  color: #fff;
  display: inherit;
}
.t_main {
  text-align: center;
}
.t_box {
    width: 100%;
  background: url(img/t_bg.png) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
  float: left;
  position: relative;
}
.t_title {
  text-align: center;
  color: #fff;
  font-weight: bold;
  width: 100%;
}
.t_list {
  width: 100%;
  text-align: center;
}
.t_min {
  display: inline-block;
  background: url(img/t_border.png) no-repeat;
  background-size: 100% 100%;
  color: #fff;
  position: relative;
}
.t_min i {
  position: absolute;
  display: inline-block;
  background: url(img/top.png) no-repeat;
  background-size: 100% 100%;
  top: 0;
  bottom: 0;
  margin: auto;
}
.t_min i.down {
  background: url(img/down.png) no-repeat;
  background-size: 100% 100%;
}
.t_number {
}
.main_table {
  font-size: 16px;
}
.main_table tr {
  height: 42px;
}
.main_table {
  width: 88%;
  margin-top: 25px;
  margin: 0 auto;
}
.main_table table {
  width: 100%;
}
.main_table thead tr {
  height: 42px;
}
.main_table th {
  font-size: 14px;
  font-weight: 600;
  color: #61d2f7;
  text-align: center;
}

.main_table td {
  color: #fff;
  font-size: 14px;
  text-align: center;
}
.main_table tbody tr:nth-child(1),
.main_table tbody tr:nth-child(3),
.main_table tbody tr:nth-child(5) {
  width: 98%;
  background-color: #2b3aa8;
  box-shadow: -10px 0px 15px #2c58a6 inset,
    /*左边阴影*/ 10px 0px 15px #2c58a6 inset; /*右边阴影*/
}
.tb {
  width: 880px;
  height: 350px;

  background: linear-gradient(to left, #003bcf, #003bcf) left top no-repeat,
    linear-gradient(to bottom, #003bcf, #003bcf) left top no-repeat,
    linear-gradient(to left, #003bcf, #003bcf) right top no-repeat,
    linear-gradient(to bottom, #003bcf, #003bcf) right top no-repeat,
    linear-gradient(to left, #003bcf, #003bcf) left bottom no-repeat,
    linear-gradient(to bottom, #003bcf, #003bcf) left bottom no-repeat,
    linear-gradient(to left, #003bcf, #003bcf) right bottom no-repeat,
    linear-gradient(to left, #003bcf, #003bcf) right bottom no-repeat;
  background-size: 2px 10px, 10px 2px, 2px 10px, 10px 2px;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 10px;
  position: relative;
}
.tb_left {
  float: left;
}
.tb_right {
  float: right;
  margin-right: 10px;
}
div.tb1 {
  width: 525px;
  /*margin-right: 10px;*/
  margin-top: 50px;
  background: none;
}
td {
  /*text-align: left !important;*/
}
.heji {
  text-align: right;
}
div.tb2 {
  width: 609px;
  /*margin-right: 10px;*/
  margin-top: 50px;
  background: none;
}

div.tb3 {
  width: 621px;
  margin-top: 50px;
  background: none;
}
.tb1 table,
.tb2 table,
.tb3 table {
  margin-top: 20px;
  background: linear-gradient(to left, #003bcf, #003bcf) left top no-repeat,
    linear-gradient(to bottom, #003bcf, #003bcf) left top no-repeat,
    linear-gradient(to left, #003bcf, #003bcf) right top no-repeat,
    linear-gradient(to bottom, #003bcf, #003bcf) right top no-repeat,
    linear-gradient(to left, #003bcf, #003bcf) left bottom no-repeat,
    linear-gradient(to bottom, #003bcf, #003bcf) left bottom no-repeat,
    linear-gradient(to left, #003bcf, #003bcf) right bottom no-repeat,
    linear-gradient(to left, #003bcf, #003bcf) right bottom no-repeat;
  background-size: 2px 10px, 10px 2px, 2px 10px, 10px 2px;
  background-color: #0b0f2a;
  padding: 12px;
}
.tb .h3title {
  position: absolute;
  top: -50px;
  left: 0px;
  background-color: transparent;
}
.tb > h3 {
  /* background: url(img/titleioc.png) left center no-repeat; */
  text-indent: 27px;
  margin-left: 20px;
  margin-top: 15px;
  height: 33px;
  line-height: 33px;
  font-size: 24px;
  width: 90%;
  color: #fff;
  font-weight: 100;
}

.tb > table {
  width: 78%;
  margin-left: 2%;
  color: #fff;
  text-align: center;
  border: none;
  border-spacing: 0;
}
.tb > table td {
  border: none;
  height: 30px;
}
.tb_title {
  color: #487bff;
  height: 35px;
  line-height: 35px;
  font-size: 16px;
}
</style>