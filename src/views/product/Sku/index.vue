<template>
  <el-card class="sku-list">
    <!-- 
      table:
       stripe:斑马线,各行变色
     -->
    <el-table
      style="width: 100%"
      border
      stripe
      :data="skuList"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
        row-key="id"
      >
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="150" align="center">
        <template slot-scope="{ row }">
          <div class="info">
            <div class="pic">
              <img
                :src="row.skuDefaultImg"
                alt="商品图片"
                style="width: 100px; height: 100px"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="width">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <HintButton
            v-if="row.isSale == 0"
            title="上架"
            type="info"
            size="mini"
            icon="el-icon-top"
            @click="onSale(row.id)"
          />
          <HintButton
            v-if="row.isSale == 1"
            title="下架"
            type="success"
            size="mini"
            icon="el-icon-bottom"
            @click="cancelSale(row.id)"
          />
          <HintButton
            title="修改"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="toUpdateSku(row.id)"
          />
          <HintButton
            title="查看详情"
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="showSkuInfo(row.id)"
          />
          <el-popconfirm
            :title="`确定删除 ${row.skuName}吗`"
            @onConfirm="deleteSku(row.id)"
          >
            <hint-button
              style="margin-left: 10px"
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除"
            ></hint-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="changeSize"
      @current-change="getSkuList"
      :current-page="page"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      style="padding: 20px 0; text-align: center"
    >
    </el-pagination>

    <!-- 详情 -->
    <el-drawer :visible.sync="isahowSkuInfo" :with-header="false" size="50%"  :before-close="handleClose">
      <el-row :gutter="80" style="margin-top: 40px">
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <!-- gutter:设置列的间距  span:设置字号-->
      <el-row :gutter="80">
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            style="margin-right: 5px"
            v-for="value in skuInfo.skuSaleAttrValueList"
            :key="value.id"
          >
            {{ value.attrId + "-" + value.valueId }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16" style="margin-top: 20px">
          <el-carousel class="sku-carousel" trigger="click" height="400px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      skuList: [],
      loading: false,
      total: 0,
      page: 1,
      limit: 10,

      skuInfo: {},
      isahowSkuInfo: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    /* ------------------------发请求----------------------------------- */
    //获取指定页码的SKU列表
    async getSkuList(page = 1) {
      this.page = page;
      this.loading = true;
      let result = await this.$API.sku.getList(this.page, this.limit);
      if (result.code == 200) {
        this.skuList = result.data.records;
        this.total = result.data.total;
        this.loading = false;
      }
    },
    /* ------------------------分页器---------------------------- */
    changeSize() {},

    /* ----------------------------操作--------------------------------- */
    //上架操作
    onSale(SkuId) {
      this.$API.sku.onSale(SkuId).then((result) => {
        this.$message({
          type: "success",
          message: "上架成功!",
        });
        this.getSkuList(this.page);
      });
    },
    //下架操作
    cancelSale(SkuId) {
      this.$API.sku.cancelSale(SkuId).then((result) => {
        this.$message({
          type: "success",
          message: "下架成功！",
        });
        this.getSkuList(this.page);
      });
    },
    //修改
    toUpdateSku() {
      this.$message.info("正在开发中...");
    },
    //查看详情
    async showSkuInfo(id) {
      this.isahowSkuInfo = true;
      let result = await this.$API.sku.get(id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
    //删除SKU
    async deleteSku(skuId) {
      try {
        let result = await this.$API.sku.remove(skuId);
        if (result.code == 200) {
          this.$message.success("删除成功！");
          this.getSkuList(this.page);
        }
      } catch (error) {
        this.$message({
          message: error.message || "删除SKU失败",
          type: "error",
        });
      }
    },
    //关闭抽屉
     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
  },
};
</script>

<style lang="scss" scoped>
// 一部分组件内的元素，我们使用类添加样式是生效的
// 还有一部分组件内的元素，我们添加样式不生效
// 原因？ 如何解决？
// 第一种解决方案： 添加样式不生效的样式全部放到style标签当中，不加scoped,
// 在跟标签添加一个类,目的是让这个样式不影响其它的组件

// 第二种解决方案（添加scoped）： 使用深度作用选择器
// 深度作用选择器的写法    ********************
//   如果是原生css 深度作用选择器
//       父元素 >>> 选中的元素
//   如果是less  scss 预编译的css文件
//       /deep/ 用于less
//       ::v-deep  都行

.sku-list {
  .el-row {
    height: 40px;
    .el-col {
      line-height: 40px;
      &.el-col-5 {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
    }
  }

  .sku-carousel {
    width: 400px;
    border: 1px solid #ccc;
    img {
      width: 400px;
      height: 400px;
    }
  }

  ::v-deep .el-carousel__indicator {
    button {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: hotpink;
    }
    &.is-active {
      button {
        background-color: purple;
      }
    }
  }
}
</style>