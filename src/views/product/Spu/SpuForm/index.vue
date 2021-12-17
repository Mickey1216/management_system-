<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm,index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="SPU描述" type="textarea" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect,index) in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <!-- 展示的是当前spu属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <!-- 展示已有属性的属性值列表 -->
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >{{tag.saleAttrValueName}}</el-tag>
              <!-- @keyup.enter.native="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              ></el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
              >添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index,1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        spuName: "",
        description: "",
        tmId: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [], //全部销售属性
      attrIdAndAttrName: "" //收集未选择的销售属性的id和name
    };
  },
  computed: {
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName;
        });
      });
      return result;
    }
  },
  methods: {
    //照片墙删除某一张图片时会触发
    handleRemove(file, fileList) {
      //file：删除的那张图片；fileList：照片墙删除某一张图片后剩余的图片
      //收集照片墙图片的数据
      this.spuImageList = fileList;
    },
    //照片墙预览的回调
    handlePictureCardPreview(file) {
      //file.url：图片地址
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //照片墙图片上传成功时的回调
    handleSuccess(response, file, fileList) {
      //收集照片墙图片的数据
      this.spuImageList = fileList;
    },
    //初始化SpuForm数据
    async initSpuData(spu) {
      //获取spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }

      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      //获取spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code === 200) {
        let listAttr = spuImageResult.data;
        //想要照片墙的照片进行展示，必须有name和url这两个属性
        listAttr.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listAttr;
      }

      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //添加新的销售属性
    addSaleAttr() {
      const { baseSaleAttrId, saleAttrName } = this.attrIdAndAttrName.split(
        ":"
      );
      //向spu对象的spuSaleAttrist中添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrIdAndAttrName = "";
    },
    //【添加】按钮：为某属性添加一个新的属性值
    addSaleAttrValue(row) {
      //点击添加按钮后，需要从button变为input，通过inputVisible字段控制
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //el-inpiut失去焦点时的回调
    handleInputConfirm(row) {
      //修改inputVisible为false
      row.inputVisible = false;
      //解构出销售属性中的数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值不能为空
      if (inputValue.trim() === "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复(也可以用some()函数)
      let result = row.spuSaleAttrValueList.every(
        item => item.saleAttrValueName !== inputValue
      );
      if (!result) return;
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
    },
    //【保存】按钮回调
    async addOrUpdateSpu(){
      //整理参数：照片墙的数据
      //照片需要携带的参数：imageName、imageUrl
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return{
          imageName:item.name,
          imageUrl:(item.response&&item.response.data) || item.url
        }
      })
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code === 200){
        this.$message({type:'success',message:'保存成功'})
        //通知父组件回到场景0
        this.$emit('changeScene',{scene:0,flag:this.spu.id ? "修改" : "添加"})
      }
      //清除数据
      Object.assign(this._data,this.$options.data())
    },
    //点击【添加SPU】按钮时，发请求的函数
    async addSpuData(category3Id){
      //收集三级分类的id
      this.spu.category3Id = category3Id
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //【取消】按钮
    cancel(){
      //通知父亲切换场景为0
      this.$emit('changeScene',{scene:0,flag:''})
      //清除数据
      //Object.assign()可以合并对象；this._data可以操作data中的响应式数据；
      //this.$options可以获取配置对象，配置对象的data函数执行后返回的响应式数据为空
      Object.assign(this._data,this.$options.data())
    },
    
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>