<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import echarts from "echarts";
export default {
  name: "progressChart",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        show: false,
        min:0,
        max:100
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color:'orange',
          barWidth:10,
          showBackground:true,
          backgroundStyle:{
            color:'#eeeeee'
          },
          label:{
            show:true,
            formatter:"|",
            position:'right'
          }
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