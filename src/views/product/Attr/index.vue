<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格展示平台属性 -->
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值列表"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag
                style="margin: 0 10px"
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteAttr(row)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column align="center" label="序号" type="index" width="80">
          </el-table-column>
          <el-table-column align="center" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row, $index)"
                :ref="$index"
              ></el-input>
              <span style="float: left" v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="!(attrInfo.attrValueList.length > 0)"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //平台属性
      attrList: [],
      isShowTable: true,
      //收集新增属性|修改属性
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的Id
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        //代表三级分类ID有,可发请求
        this.category3Id = categoryId;

        this.getAttrList();
      }
    },
    //获取平台属性是数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      //向属性值的数值里面添加元素
      this.attrInfo.attrValueList.push({
        //修改某一个值的时候，可以在已有是属性值基础上新增新的属性
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调
    addAttr() {
      this.isShowTable = false;
      //清除数据||收集三级分类的Id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      //由于数据结构复杂，因此需要使用深拷贝
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候，将相应的属性元素值加上flag标志
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //失去焦点的事件切换为查看模式
    toLook(row) {
      //如果属性值为空，不能作为新的属性值
      if (row.valueName.trim() == "") {
        this.$message({
          type: "warning",
          message: "请你输入一个正常属性值",
        });
        return;
      }
      //新增的属性值不能与有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message({
          type: "warning",
          message: "属性值重复",
        });
        return;
      }
      //row是当前用户添加的新属性值
      row.flag = false;
    },
    //点击span的事件回调：让input框自动聚焦
    toEdit(row, index) {
      row.flag = true;
      //获取input节点
      //$nextTick()当节点渲染完毕。会执行一次
      this.$nextTick(() => {
        //获取相应的input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    //删除选中的属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存属性值
    async addOrUpdateAttr() {
      //整理参数：1.属性值为空不应该提交给服务器2.提交给服务器的字段中不应该出现flag值
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤掉值不是空的
          if (item.valueName != "") {
            //删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message({
          type: "success",
          message: "保存成功",
        });
        this.getAttrList();
      } catch (error) {
        this.$message({
          type: "error",
          message: "保存失败",
        });
      }
    },
    //删除属性值
    async deleteAttr({ id }) {
      //发请求
      try {
        await this.$API.attr.reqDeleteAttrById(id);
        this.getAttrList();
        //elementUI组件
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
        });
      } catch (error) {
        //删除失败
        this.$message({ type: "error", message: "删除失败" });
      }
    },
  },
};
</script>

<style>
</style>