<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="addDialog"
      >添加</el-button
    >
    <!-- 表格 -->
    <!-- data:表格组件将来要展示的数据-----数组类型 
         dorder:是否有边框
         label:显示的标题
         width:对应列的宽度
         align:标题的对齐方式
         prop:对应列内容的字段名
         注意：elementUI当中的table组件，展示的数据是一列列地展示数组
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="prop"
        label="品牌Logo"
        width="width"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
        当前第几页、数据总条数、每一页展示的条数
        pager-count:按钮的数量 如果为9 连续页码是7
        @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
     -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3, 5, 10]"
      layout=" prev, pager, next, jumper,->,total, sizes"
      @size-change="handleSizeChange"
      @current-change="getPageList"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      center
    >
      <!-- from表单：model属性，把表单的数据收集到哪个对象的身上,将来表单验证需要-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item
          label="品牌名称"
          label-width="100px"
          label-position="left"
          prop="tmName"
        >
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTraderMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    //elmentUI提供的自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      // 当前展示数据条数
      limit: 3,
      //总数据的条数
      total: 0,
      //列表展示的数据
      list: [],
      //控制对话框显示与隐藏的数据
      dialogFormVisible: false,
      //收集品牌信息
      tmForm: {
        tmName: "", //品牌的名字
        logoUrl: "", //品牌的图片
      },
      rules: {
        //品牌名称的验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        //LOGO的验证规则
        logoUrl: [
          { required: true, message: "请选择品牌图片", trigger: "change" },
        ],
      },
    };
  },
  // 组件关注挂载完毕，发请求
  mounted() {
    // 获取列表数据方法
    this.getPageList();
  },
  methods: {
    //获取品牌列表的数据
    async getPageList(pager = 1) {
      this.page = pager;
      //解构出参数
      const { page, limit } = this;
      // 获取品牌列表的接口
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //展示数据的总条数与列表展示的数组
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // handleCurrentChange(pager){
    //   //修改参数
    //   this.page = pager;
    //   this.getPageList();
    // },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //添加品牌
    addDialog() {
      this.dialogFormVisible = true;
      //清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改某一个品牌
    updateTradeMark(row) {
      //row当前用户展示的信息
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },
    //上传图片相关的回调
    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res是上传成功后返回前端的数据
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
    //添加按钮（添加||修改）
    addOrUpdateTraderMark() {
      //当全部验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false;
          //发请求
          let result = await this.$API.tradeMark.reqAddOrUpadateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改成功" : "添加成功",
            });
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
       this.$confirm(`确定删除${row.tmName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //当用户点击确定按钮时触发
          //向服务器发请求
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if(result.code==200){
             this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList(this.list.length>1 ?this.page:this.page-1);
          }
         
        }).catch(() => {
          //点击取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
  },
};
</script>

<style >
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