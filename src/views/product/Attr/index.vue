<template>
  <div>
    <el-card style="margin:20px 0px;">
      <CategorySelect @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 平台属性展示结构 -->
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table border style="width: 100%;" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag
                type="success"
                v-for="(attrValue,index) in row.attrValueList"
                :key="attrValue.id"
                style="margin:0px 10px;"
              >{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性结构 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
        >添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table border style="width: 100%;margin:20px 0px;" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里的结构需要span与input进行来回切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <span v-else @click="row.flag=true" style="display:block;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [], //平台属性数据
      isShowTable: true, //控制table表格显示与隐藏
      attrInfo: {
        //新增属性|修改属性
        attrName: "", //属性名
        attrValueList: [], //属性值，有多个属性值所以是数组，每一个属性值都是一个对象，有两个字段：attrId,valueName
        categoryId: 0, //三级分类id
        categoryLevel: 3 //服务器需要区分是几级的id
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //发请求获取品牌属性数据
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值
    addAttrValue() {
      //向属性值数组中添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一属性时，可以在已有属性值基础之上添加新的属性值（得把已有的属性的id带上）
        valueName: "", //属性值名称
        flag:true //给每一个属性值添加一个标志，用于切换查看模式与编辑模式，好处是每一个属性值可以控制自己的模式切换
      });
    },
    //【添加属性】按钮的回调
    addAttr() {
      //切换table的显示与隐藏
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id, //收集三级分类的id
        categoryLevel: 3
      };
    },
    //修改某个属性
    updateAttr(row) {
      //切换table的显示与隐藏
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      //由于数据结构中存在对象中套数组，数组里面套对象，因此需要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row);
    },
    //失去焦点|键盘回车的事件--切换为查看模式，展示span
    toLook(row){ //row:是当前用户添加的最新的属性值
      if(row.valueName.trim() === ''){ //属性值不能为空
        this.$message('请你输入一个正常的属性值')
        return
      }
      //新增的属性值不能与已有的属性值重复
      let isRepeat = this.attrInfo.attrValueList.some(item=>{
        if(row !== item){ //将row从数组中去掉
          return row.valueName === item.valueName
        }
      })
      if(isRepeat) return 
      row.flag = false
    }
  }
};
</script>

<style scoped>
</style>