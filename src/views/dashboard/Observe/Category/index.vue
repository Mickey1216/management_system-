<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道"
    };
  },
  mounted() {
    let mycharts = echarts.init(this.$refs.charts);
    mycharts.setOption({
      title: {
        left: "center",
        top: "center"
      },
      tooltip: {
        trigger: "item"
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: true,
            position: "outsize"
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 300, name: "视频广告" },
            { value: 484, name: "联盟广告" },
            { value: 580, name: "邮件营销" },
            { value: 735, name: "直接访问" },
            { value: 1048, name: "搜索引擎" }
          ]
        }
      ]
    });
    //绑定事件
    mycharts.on("mouseover", params => {
      //获取鼠标移上去的那条数据
      const { name, value } = params.data;
      //重新设置标题
      mycharts.setOption({
        title: {
          text: name,
          subtext: value,
        }
      });
    });
  }
};
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eeeeee;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>