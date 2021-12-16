<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px;" @click="showDialog">添加</el-button>
    <!-- 表格组件
    data:表格组件显示的数据,数组类型;border:表格边框;label:显示标题;width:对应列的宽度;align:标题的对齐方式;
    prop:对应列内容的字段名;
    注意1:数据是以一列一列的形式进行展示
    -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="width:100px;height:100px;" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
    current-page:	当前第几页;page-size:每一页展示条数;total:数据总条数;page-sizes:设置每一页展示多少条;
    layout:实现分页器布局;pager-count:页码按钮的数量
    -->
    <el-pagination
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3,5,10]"
      style="margin-top:20px;text-align:center;"
      :pager-count="7"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 对话框
    :visible.sync：控制对话框显示与隐藏；
    Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
    并将 Form-Item 的 prop 属性设置为需校验的字段名即可；
    -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单 
      :model:把表单的数据收集到这个对象身上，将来表单验证时也需要这个属性。
      -->
      <el-form style="width:80%;" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 图片上传
          这里收集数据不能使用v-model，因为不是表单元素；action：设置图片上传地址；
          on-success:可以检测到图片上传成功，当图片上传成功，会执行一次；before-upload：在图片上传之前，会执行一次；
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
    const validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称在2-10位"));
      } else {
        callback();
      }
    };
    return {
      page: 1, //当前第几页
      limit: 3, //每页展示的条数
      total: 0, //总共条数
      list: [], //列表展示的数据
      dialogFormVisible: false, //对话框显示与隐藏控制属性
      imageUrl: "", //上传图片使用的属性
      tmForm: {
        //收集品牌信息（对象身上的属性不能瞎写，需要参考接口文档）
        tmName: "",
        logoUrl: ""
      },
      rules: {
        //表单验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //自定义校验规则
          { validator: validateTmName, trigger: "change" }
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }]
      }
    };
  },
  mounted() {
    //组件挂载完毕就要发请求
    this.getPageList();
  },
  methods: {
    //获取品牌列表的数据
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //当分页器某一页需要展示数据条数发生变化时会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //点击添加品牌的按钮
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true;
      //清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改某一个品牌
    updateTradeMark(row) {
      //row:当前用户选中的这个品牌信息
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tmForm进行展示
      //将服务器返回品牌的信息直接赋值给了tmForm进行展示，也就是tmForm存储即为服务器返回品牌信息。
      this.tmForm = { ...row }; //浅拷贝
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res：上传成功之后返回给前端的数据；file：上传成功之后返回给前端的数据
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //确定按钮（添加品牌|修改品牌）
    addOrUpdateTradeMark() {
      //全部验证字段都通过时，再去书写业务逻辑
      this.$refs.ruleForm.validate(async success => {
        if (success) {
          this.dialogFormVisible = false;
          //发请求（添加品牌|修改品牌）
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            //弹出信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功"
            });
            //添加或者修改品牌成功之后，需要再次获取品牌列表进行展示
            //如果是添加品牌，则停留在第一页；如果是修改品牌，则停留在当前页。
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除品牌
    deleteTradeMark(row) {
      //弹框
      this.$confirm(`你确定删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //当用户点击确定按钮时触发
          //发请求
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            //再次获取品牌列表
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          //当用户点击取消按钮时触发
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>