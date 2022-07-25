<template>
  <!-- 行内form: form inline = true -->
  <el-form :model="form" label-width="80px">
    <h1>{{}}</h1>
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌">
        <el-option value=""> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- 照片墙 -->
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="apuImageList"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img :src="dialogImageUrl" alt="" width="100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <!-- 展示的是当前这个类未选择的销售属性 -->
      <el-form label="销售属性">
        <el-select v-model="model" placeholder="还有三个未选择">
          <el-option label="label" value=""></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin:0 10px;">添加销售属性</el-button>
        <el-table style="width: 100% ;margin-top:10px;" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
          </el-table-column>
        </el-table>
      </el-form>
    </el-form-item>
    <el-form-item >
        <el-button type="primary">保存</el-button>
        <el-button style="margin:10px 10px;">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      //照片墙的属性
      dialogImageUrl: "",
      dialogVisible: false,
      //存储当前类的情况
      //修改SPU类情况：当前类的信息qizhizhi
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    apuImageList() {},
    handleSuccess() {},
  },
};
</script>

<style>
</style>