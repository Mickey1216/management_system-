<template>
  <div>
    <el-card style="margin:20px 0px;">
      <!-- 三级联动全局组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene !== 0" />
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
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm title="确定删除此项内容？" @onConfirm="deleteSpu(row)">
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
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
      <SkuForm v-show="scene === 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
      <el-dialog :title="`${spu.spuName}的列表`" :visible.sync="dialogTableVisible">
        <el-table :data="skuList" style="width: 100%" border v-loading="loading" :before-close="close">
          <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
          <el-table-column prop="price" label="价格" width="width"></el-table-column>
          <el-table-column prop="weight" label="重量" width="width"></el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" style="width:100px;height:100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
      scene: 0, //0:展示spu列表数据；1：添加spu|修改spu；2：添加sku。
      dialogTableVisible: false, //控制对话框的显示与隐藏
      spu: {},
      skuList: [], //存储sku列表的数据
      loading:true
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
    addSpu() {
      this.scene = 1;
      //通知子组件SupForm发请求，获取品牌和销售属性
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //【edit按钮】，修改某一个spu
    updateSpu(row) {
      this.scene = 1;
      //获取SpuForm子组件
      this.$refs.spu.initSpuData(row);
    },
    //SpuForm的自定义事件回调
    changeScene({ scene, flag }) {
      this.scene = scene;
      //flag：区分保存按钮是添加还是修改
      if (flag === "修改") {
        //停在当前页
        //子组件通知父组件切换场景后，还需要再次获取spu列表进行展示
        this.getSpuList(this.page);
      } else {
        //回到第一页
        this.getSpuList();
      }
    },
    //【删除】按钮
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code === 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //【添加sku】按钮
    addSku(row) {
      this.scene = 2;
      //父组件调用子组件的方法，让子组件发请求--三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //SkuForm通知父组件切换场景
    changeScenes(scene) {
      this.scene = scene;
    },
    //查看spu的sku列表的回调
    async handler(spu) {
      //让对话框可见
      this.dialogTableVisible = true;
      //保存spu信息
      this.spu = spu;
      //获取sku列表数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code === 200) {
        this.skuList = result.data;
        //loading隐藏
        this.loading = false
      }
    },
    //关闭对话框的回调
    close(done){
      this.loading = true
      //清除sku列表的数据
      this.skuList = []
      //关闭对话框
      done()
    }
  }
};
</script>

<style scoped>
</style>