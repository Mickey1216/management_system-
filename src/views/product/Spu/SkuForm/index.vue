<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格（元）" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValue">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.skuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100%;height:100%;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault === 0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        //收集sku数据的字段
        //第一类：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要书写代码
        skuDefaultImg: "", //默认图片
        skuImageList: [ //图片
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [ //销售属性
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
        skuAttrValueList: [ //平台属性
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ]
      },
      spu: {},
      imageList:[], //收集图片字段
    };
  },
  methods: {
    //获取SkuForm数据
    async getData(category1Id, category2Id, spu) {
      //收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;

      //获取图片
      let imageListResult = await this.$API.spu.reqSpuImgList(spu.id);
      if (imageListResult.code === 200) {
        let list = imageListResult.data
        list.forEach(item=>{
          item.isDefault = 0
        })
        this.spuImageList = list;
      }
      //获取销售属性
      let saleAttrListResult = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (saleAttrListResult.code === 200) {
        this.spuSaleAttrList = saleAttrListResult.data;
      }
      //获取平台属性
      let attrInfoListResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrInfoListResult.code === 200) {
        this.attrInfoList = attrInfoListResult.data;
      }
    },
    //table表格复选框按钮的事件回调
    handleSelectionChange(params){
      //获取到用户选中图片的信息数据，注意：缺少isDefault字段
      this.imageList = params
    },
    //改变默认（排他操作）
    changeDefault(row){
      //图片列表的isDefault设为0
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      //点击那个图片的isDefault变为1
      row.isDefault = 1
      //收集默认图片的地址
      this.skuInfo.imgUrl = row.imgUrl
    },
    //【取消】按钮
    cancel(){
      this.$emit('changeScenes',0)
      //清除数据
      Object.assign(this._data,this.$options.data())
    },
    //【保存】按钮
    async save(){
      //解构数据
      const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this

      //整理平台属性
      let arr = []
      //把收集到的数据进行整理
      attrInfoList.forEach(item=>{
        //当前平台属性用户进行选择
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(':')
          //携带给服务器参数应该是一个对象
          let obj = {valueId,attrId}
          arr.push(obj)
        }
      })
      //将整理好的参数赋值给skuInfo.skuAttrValueList
      skuInfo.skuAttrValueList = arr

      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])

      //整理图片数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imageName:item.imgName,
          imageUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })

      //发请求，带给服务器
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if(result.code === 200){
        this.$message({type:'success',message:'添加成功'})
        this.$emit('changeScenes',0)
      }
    },
  }
};
</script>

<style scoped>
</style>