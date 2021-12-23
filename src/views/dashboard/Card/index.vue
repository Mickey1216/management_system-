<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 126560">
            <template slot="charts">
              <span>
                周同比 &nbsp;&nbsp; 56.67%
                <svg
                  t="1640242501630"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5727"
                  width="16"
                  height="16"
                >
                  <path
                    d="M255.998 488.11h167.253l0.909 322.563h166.4v-322.56l167.253 0.455L506.819 165.61l-250.821 322.5z"
                    fill="#1296DB"
                    p-id="5728"
                  />
                </svg>
              </span>
              <span>
                日同比 &nbsp;&nbsp; 19.96%
                <svg
                  t="1640242666915"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="7599"
                  width="16"
                  height="16"
                >
                  <path
                    d="M768.002 535.89H600.749l-0.909-322.563h-166.4v322.56l-167.253-0.455L517.181 858.39l250.821-322.5z"
                    fill="#FD3333"
                    p-id="7600"
                  />
                </svg>
              </span>
            </template>
            <template slot="footer">
              <span>日销售额￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <lineChart></lineChart>
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <barChart></barChart>
            </template>
            <template slot="footer">
              <span>转换率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <progressChart></progressChart>
            </template>
            <template slot="footer">
              <span>
                周同比 &nbsp;&nbsp; 12%
                <svg
                  t="1640242501630"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5727"
                  width="16"
                  height="16"
                >
                  <path
                    d="M255.998 488.11h167.253l0.909 322.563h166.4v-322.56l167.253 0.455L506.819 165.61l-250.821 322.5z"
                    fill="#1296DB"
                    p-id="5728"
                  />
                </svg>
              </span>
              <span>
                日同比 &nbsp;&nbsp; 11%
                <svg
                  t="1640242666915"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="7599"
                  width="16"
                  height="16"
                >
                  <path
                    d="M768.002 535.89H600.749l-0.909-322.563h-166.4v322.56l-167.253-0.455L517.181 858.39l250.821-322.5z"
                    fill="#FD3333"
                    p-id="7600"
                  />
                </svg>
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChart from "./lineChart";
import barChart from "./barChart";
import progressChart from './progressChart'
export default {
  name: "Card",
  components: {
    Detail,
    lineChart,
    barChart,
    progressChart
  }
};
</script>

<style>
</style>