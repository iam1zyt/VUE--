<template>
  <!-- 行内form: form inline = true -->
  <el-form label-width="80px" :model="spu">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spu.tmId">
        <el-option
          v-for="tm in tradeMarkList"
          :key="tm.id"
          :label="tm.tmName"
          :value="tm.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" v-model="spu.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- 
        action:上传图片地址
        list-type:照片墙类型的
        on-preview:预览的钩子
        on-remove:删除按钮的钩子
        on-success:图片上传成功的回调
        file-list:照片墙需要展示数据的设置属性，数组,数组里面的元素要有name（图片的名字）与url（图片的地址）属性
       -->
      <!-- 照片墙 
      -->
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
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
        <el-select
          :placeholder="
            unSelectSaleAttr.length > 0
              ? `还有${unSelectSaleAttr.length}个未选择`
              : '没了'
          "
          v-model="saleAttrIdAndName"
        >
          <el-option
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="`${saleAttr.id}:${saleAttr.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 0 10px"
          :disabled="!saleAttrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table
          style="width: 100%; margin-top: 10px"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="100">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- el-tag:closable 是否可以关闭 disable-transition过渡动画 close：关闭tag事件 @close -->
              <el-tag
                style="margin: 0 5px"
                v-for="saleAttrValue in row.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                closable
                hit
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice($index, 1)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.show"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="toLook(row)"
                @blur="toLook(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="toEdit(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="80" align="center">
            <template slot-scope="{ row,$index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addOrUpdate">保存</el-button>
      <el-button style="margin: 10px 10px" @click="changeScene">取消</el-button>
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
      //存储spu信息属性
      spu: {
        category3Id: "", //三级分类的ID
        spuName: "", //收集SPU的名字
        tmId: "", //收集品牌的ID
        description: "", //收集类的描述信息
        spuImageList: [],
        spuSaleAttrList: [
          //销售属性地方
        ],
      },
      //存储品牌的信息
      tradeMarkList: [],
      //存储图片的数组
      spuImageList: [],
      //存储销售属性的数据
      saleAttrList: [],
      //收集销售属性
      saleAttrIdAndName: "",
    };
  },
  methods: {
    //预览照片
    handlePictureCardPreview(file) {
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示与隐藏
      this.dialogVisible = true;
    },
    //删除照片
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    //照片上传成功的回调
    handleSuccess(response, file, fileList) {
      //response：图片上传成功后，服务器返回的响应数据，包括远程图片的地址
      // file图片上传成功后，图片的信息
      //filelist：照片墙一共有的图片的信息
      this.spuImageList = fileList;
    }, 
    
    /* ------------------------销售属性-------------------------------- */
    // 添加销售属性值
    toEdit(row) {
        // 添加一个控制显示|隐藏的属性row=spuSaleAttrList
      this.$set(row, "show", true); //切换模式
      this.$set(row, "inputValue", ""); //收集用户输入的销售属性值
      //聚焦
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //el-input失去焦点时：切换为查看模式
    toLook(row) {
        // console.log(row);row=spuSaleAttrList
        // 解构出数据
      const { baseSaleAttrId, inputValue } = row;
    // 新增的销售属性值不能为空
      if (inputValue.trim() == "") {
        this.$message({ type: "error", message: "新的属性值不能为空" });
        return;
      }
    //   新增的销售属性值不能重复
      let repeat = row.spuSaleAttrValueList.find((item) => {
        return item.saleAttrValueName == inputValue;
      });
      if (repeat) {
        return;
      }

      //整理销售属性值的数据格式
      let newSaleAttrValue = {
        baseSaleAttrId,//Key:value一致省略了vlaue
        saleAttrValueName: inputValue,
      };
      //新增销售属性值
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.show = false;
    },
    // 点击添加销售属性值
    addSaleAttr() {
      //获取新增的销售属性Id与名字
      let [baseSaleAttrId, saleAttrName] = this.saleAttrIdAndName.split(":");
      //整理新的销售属性
      let newsaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //添加数组里面
      this.spu.spuSaleAttrList.push(newsaleAttr);
      //清空字符串
      this.saleAttrIdAndName = "";
    },

/* ------------------------------------------------------------------ */
    // 修改的请求
    async initData(spu) {
      //获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpuById(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTrademarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取图片的数组
      let spuImgResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImgResult.code == 200) {
        let listArr = spuImgResult.data;
        //整理数据
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //整理好的数据进行替换
        this.spuImageList = listArr;
      }
      let saleAttrResult = await this.$API.spu.reqSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    //添加的请求
    async initSpuData(category3Id) {
      //收集父组件传过来的三级Id
      this.spu.category3Id = category3Id;
      //1.获取品牌数据
      let tmResult = await this.$API.spu.reqTrademarkList();
      if(tmResult.code == 200){
        this.tradeMarkList = tmResult.data;
      }
      //第2个请求：获取整个项目的全部的销售属性
      let saleResult = await this.$API.spu.reqSaleAttrList();
      if(saleResult.code ==200){
        this.saleAttrList = saleResult.data;
      }
    },
   
/* ---------------------------------------------------------- */
    //取消按钮的回调函数
    changeScene() {
      //触发自定义事件
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清空数据
      //this.$option能获取当前VC的配置对象
      Object.assign(this._data, this.$options.data());
    },

    //新增|修改SPU     保存按钮
    async addOrUpdate() {
      //整理参数:category3Id(已收集)、description(已收集)、tmId(已收集)、spu(已收集)
      //照片墙spuImageList
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          iamgeName: item.name,
        //   如果是新增的图片看有没有response
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发请求
      try {
        //保存成功
        await this.$API.spu.reqAddOrUpdateSpu(this.spu);
        this.$message({ type: "success", message: "保存成功" });
        //通知父组件切换为场景0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "新增",
        });
        //清空数据  assign:合并
        Object.assign(this._data, this.$options.data());
      } catch (error) {
        alert(error.message);
      }
    },
  },

  computed: {
    //未选择的销售属性
    unSelectSaleAttr() {
      //全部销售属性 this.saleAttrList
      //当前类已有的销售属性 this.spu.spuSaleAttrList
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
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