<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动  @getCategoryId="getCategoryId"全局组件自定义事件，把三级分类的ID传递给父组件 -->
      <CategorySelect @getCategoryId="getCategoryId" />
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
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="records"
          v-loading="loading"
          element-loading-text="拼命加载中..."
          el-loading-spinner="el-icon-loading"
        >
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
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
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
                  @click="addSku"
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
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <!-- 场景1  添加SPU|修改SPU-->
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"/>
      <!-- 场景2 添加SKU-->
      <SkuForm v-show="scene == 2" />
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
          this.loading = true;
          this.getSpuList();
          break;
      }
    },
    //获取SPU类的列表进行展示
    async getSpuList() {
      this.loading = true;
      //整理参数
      const { page, limit, category3Id } = this;
      //获取列表数据
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        //存储数据
        this.total = result.data.total;
        this.records = result.data.records;
        this.loading = false;
      }
    },
    //点击分页器的第几页按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //当pageSize发生变化时触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },

    //子组件业务
    //SPUForm自定义事件的回调
    changeScene({scene,flag}){
      //切换场景
      this.scene = scene;
      //再次获取最新的类的数据
      // 当CV切换场景的时候，如果修改，留在当前页、如果添加留在第一个
      if(flag == '修改'){
        this.getSpuList(this.page);
      }else{
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
     async deleteSpu(row) {
      try {
        await this.$API.spu.reqDeleteSpu(row.id);
        //获取数据
        this.getSpuList(this.records.length>1?this.page:this.page-1);
        //提示信息
        this.$message({ type: "success", message: "删除成功" });
      } catch (error) {
        
      }
     },

    addSku(){
    },
    lookSku() {},
   
  },
};
</script>

<style>
</style>