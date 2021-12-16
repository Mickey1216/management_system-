<template>
  <div>
    <el-card style="margin:20px 0px;">
      <!-- 三级联动全局组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="!show" />
    </el-card>
    <el-card>
      <!-- 这里是有三部分进行切换的，通过scene变量进行控制 -->
      <!-- 展示spu列表 -->
      <div v-show="scene === 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- hintButton组件 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加spu"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"></hint-button>
              <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align:center;"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
      <!-- 添加spu|修改spu结构 -->
      <SpuForm v-show="scene === 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <!-- 添加sku结构 -->
      <SkuForm v-show="scene === 2"></SkuForm>
    </el-card>
  </div>
</template>

<script>
//引入子组件
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      show: true, //控制三级联动的可操作性
      page: 1,
      limit: 3,
      records: [], //spu列表数据
      total: 0,
      scene: 0 //0:展示spu列表数据；1：添加spu|修改spu；2：添加sku。
    };
  },
  methods: {
    //三级联动自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        //清除2，3级id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        //清除3级id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //发请求获取Spu列表数据
        this.getSpuList();
      }
    },
    //获取Spu列表数据
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //分页器每一页展示数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //【添加SPU按钮】
    addSpu(){
      this.scene = 1
    },
    //【edit按钮】，修改某一个spu
    updateSpu(row){
      this.scene = 1
      //获取SpuForm子组件
      this.$refs.spu.initSpuData(row)
    },
    //SpuForm的自定义事件回调
    changeScene(scene){
      this.scene = scene
    },
  }
};
</script>

<style scoped>
</style>