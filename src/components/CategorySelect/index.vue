<template>
  <div>
    <!-- inline代表是行内表单 -->
    <el-form :inline="true" class="demo-form-inline" :model="cform">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cform.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            v-for="c1 in list1"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cform.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            v-for="c2 in list2"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cform.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            v-for="c3 in list3"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      //一级分类数据
      list1: [],
      list2: [],
      list3: [],
      cform: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    //组件挂载完毕获取一级分类数组
    this.getCategory1List();
  },
  methods: {
    //获取一级分类
    async getCategory1List() {
      let result = await this.$API.attr.reqGetCategory1();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //一级分类的select事件回调
    async handler1() {
      //清除数据
      this.list2 = [];
      this.list3 = [];
      this.cform.category2Id = "";
      this.cform.category3Id = "";
      //解构一级分类ID
      const { category1Id } = this.cform;
      //将ID传递给父组件
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      //通过一级分类的id,获取二级分类数据
      let result = await this.$API.attr.reqGetCategory2(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    //二级分类的select事件回调
    async handler2() {
      //清除数据
      this.list3 = [];
      this.cform.category3Id = "";
      //解构二级分类ID
      const { category2Id } = this.cform;
      //将ID传递给父组件
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      //通过二级分类的id,获取三级分类数据
      let result = await this.$API.attr.reqGetCategory3(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    //三级分类的Select事件回调
    handler3() {
      //获取三级分类的Id
      const { category3Id } = this.cform;
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    },

    onSubmit() {},
  },
};
</script>

<style></style>
