<template>
  <el-card class="box-card" style="margin:10px 0px;">
    <!-- 头部区域   -->
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visity"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          class="date"
          size="mini"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="-"
        ></el-date-picker>
      </div>
    </div>
    <!-- 内容区域 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6" class="right">
          <h3>门店{{title}}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">1422534265</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>麦当劳</span>
              <span class="rvalue">424243533</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">14422415</span>
            </li>
            <li>
              <span class="rindex">4</span>
              <span>海底捞</span>
              <span class="rvalue">14242332</span>
            </li>
            <li>
              <span>5</span>
              <span>德克士</span>
              <span class="rvalue">1314242</span>
            </li>
            <li>
              <span>6</span>
              <span>汉堡王</span>
              <span class="rvalue">324412</span>
            </li>
            <li>
              <span>7</span>
              <span>真功夫</span>
              <span class="rvalue">23243</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs'
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      date:[]
    };
  },
  computed: {
    title() {
      return this.activeName === "sale" ? "销售额" : "访问量";
    }
  },
  watch: {
    title() {
      //重新修改图标的配置数据
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势"
        }
      });
    }
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text: this.title + "趋势"
      },
      xAxis: {
        type: "category",
        data: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ],
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "Direct",
          data: [120, 200, 150, 80, 70, 110, 130, 110, 98, 167, 123, 44],
          type: "bar",
          barWidth: "60%",
          color: "yellowGreen"
        }
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      }
    });
  },
  methods:{
    setDay(){ //今天
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day,day]  
    },
    setWeek(){ //本周
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start,end]
    },
    setMonth(){//本月
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start,end]  
    },
    setYear(){//本年
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start,end]   
    },
  }
};
</script>

<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.right span {
  margin: 0px 10px;
}
.date {
  width: 250px;
  margin: 0px 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  width: 20px;
  height: 20px;
  float: left;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>