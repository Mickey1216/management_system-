<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import echarts from "echarts";
export default {
  name: "barChart",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: "category"
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: "bar",
          data: [10, 7, 33, 12, 48, 9, 28, 32, 21, 90]
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    });
  }
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>