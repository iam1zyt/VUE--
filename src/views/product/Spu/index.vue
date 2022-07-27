<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动  @getCategoryId="getCategoryId"全局组件自定义事件，把三级分类的ID传递给父组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <!-- 底部 -->
    <el-card>
      <!-- 场景0 -->
      <div v-show="scene == 0">
        <!-- 展示SPU列表结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <!-- 展示SPU -->
        <el-table style="width: 100%; margin: 20px 0px" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" width="width" align="center">
            <template slot-scope="{ row, $index }">
              <!-- 这里按钮将用hintButton替换 -->
              <el-tooltip
                effect="light"
                content="添加SKU"
                placement="bottom-start"
              >
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-plus"
                  @click="addSku(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="light"
                content="修改SPU"
                placement="bottom-start"
              >
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-edit"
                  @click="updateSpu(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="light"
                content="查看全部SKU"
                placement="bottom-start"
              >
                <el-button
                  type="info"
                  size="mini"
                  icon="el-icon-info"
                  @click="lookSku(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="light"
                content="删除SPU"
                placement="bottom-start"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteSpu(row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器    -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
        >
        </el-pagination>
      </div>
      <!-- 场景1  添加SPU|修改SPU-->
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" />
      <!-- 场景2 添加SKU-->
      <SkuForm v-show="scene == 2" ref="sku" @changeScene="changeScene" />

      <!-- 展示sku列表 -->
      <el-dialog
        :title="`${spu.spuName}`"
        :visible.sync="dialogTableVisible"
        :before-close="close"
      >
        <el-table :data="skuList" border v-loading="loading">
          <el-table-column
            prop="skuName"
            label="名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="weight"
            label="重量"
            width="width"
          ></el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 分页器数据
      page: 1, //当前页码
      limit: 3, //每页展示几条数据
      total: 0, //总共数据条数
      records: [], //展示类的数据
      loading: false, //控制loading加载的属性
      scene: 0, //切换场景属性
      diaglogTableVisible: false, //控制对话显示与隐藏
      skuList: [], //存储某一个类的全部实例
      //控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [], //存储sku列表的数据
    };
  },
  methods: {
    //三级联动的自定义事件
    getCategoryId({ categoryId, level }) {
      switch (level) {
        case 1:
          this.category1Id = categoryId;
          this.category2Id = "";
          this.category3Id = "";
          break;
        case 2:
          this.category2Id = categoryId;
          this.category3Id = "";
          break;
        case 3:
          this.category3Id = categoryId;
          //发请求-获取SPU列表进行数据展示
          //发请求前loading
          this.getSpuList();
          break;
      }
    },
    /* ------------------------------------------------- */
    //获取SPU类的列表进行展示
    async getSpuList(pager = 1) {
      this.page = pager;
      //整理参数
      const { page, limit, category3Id } = this;
      //获取列表数据
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        //存储数据
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    /* --------------------------------------------------- */
    /*     //点击分页器的第几页按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList(page);
    }, */
    //当pageSize发生变化时触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },

    /* -------------子组件业务--------------- */
    //SPUForm自定义事件的回调   切换场景的函数
    changeScene({ scene, flag }) {
      //切换场景
      this.scene = scene;
      //再次获取最新的类的数据
      // 当CV切换场景的时候，如果修改，留在当前页、如果添加留在第一个
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //添加SPu
    addSpu() {
      this.scene = 1;
      this.$refs.spu.initSpuData(this.category3Id);
    },
    //修改某一个spu
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initData(row);
    },
    //删除一个SPU
    async deleteSpu(row) {
      try {
        // 发请求
        await this.$API.spu.reqDeleteSpu(row.id);
        //获取数据
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
        //提示信息
        this.$message({ type: "success", message: "删除成功" });
      } catch (error) {}
    },
    //添加SKU
    addSku(row) {
      //切换场景为2
      this.scene = 2;
      // 父组件调用子组件的方法让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //查看SKU
    async lookSku(spu) {
      this.dialogTableVisible = true;
      this.spu = spu;
      this.loading = true;
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqFindSku(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    //关闭对话框
    close(done) {
      this.loading = true;
      this.skuList = [];
      //关闭对话框
      done();
    },
  },
};
</script>

<style>
</style>