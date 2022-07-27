<template>
  <el-form label-width="80px" :model="skuForm">
    <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="sku名称" v-model="skuForm.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="skuForm.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)" v-model="skuForm.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" v-model="skuForm.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item
          v-for="attr in attrList"
          :key="attr.id"
          :label="attr.attrName"
        >
          <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item
          v-for="saleAttr in saleList"
          :key="saleAttr.id"
          :label="saleAttr.saleAttrName"
        >
          <el-select placeholder="请选择" v-model="saleAttr.idAndValueId">
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        style="width: 100%"
        border
        :data="imgList"
        @selection-change="handler"
      >
        <el-table-column prop="prop" type="selection" width="60">
        </el-table-column>
        <el-table-column prop="prop" label="图片">
          <template slot-scope="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称"> </el-table-column>
        <el-table-column prop="prop" label="操作">
          <template slot-scope="{ row, $index }">
            <el-button type="info" v-if="row.isDefault == 0" @click="setDefault(row)">设置默认</el-button>
            <el-button type="success" v-else>默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addSku">保存</el-button>
      <el-button  @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      //平台属性
      attrList: [],
      //销售属性
      saleList: [],
      //图片列表
      imgList: [],
      //存储spu
      spu: {},
      //将来携带给服务器的参数
      skuForm: {
        category3Id: "",
        spuId: "",
        tmId: "",
        skuName: "", //V-model收集的，类的实例的名字
        price: "",
        weight: "",
        skuDesc: "",
        skuDefaultImg: "", //默认图
        skuAttrValueList: [
          //收集平台属性的
          // {
          //   attrId: 0, //平台属性的ID
          //   valueId: 0, //平台属性值的ID
          // },
        ],
        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          // },
        ],
        skuSaleAttrValueList: [
          //销售属性
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
      },
    };
  },
  methods: {
    /* ---------------------发请求-------------------------- */
    async getData(category1Id, category2Id, spu) {
      this.spu = spu;
      this.skuForm.category3Id = spu.category3Id;
      this.skuForm.spuId = spu.id;
      this.skuForm.tmId = spu.tmId;
      //获取图片的数据
      let result1 = await this.$API.spu.reqSpuImageList(spu.id);
      if (result1.code == 200) {
        this.imgList = result1.data;
        this.imgList = this.imgList.map((item)=>{
          return{
            ...item,
            isDefault:0
          };
        });
      };
      //获取销售属性的数据
      let result2 = await this.$API.spu.reqSaleAttrLists(spu.id);
      if (result2.code == 200) {
        this.saleList = result2.data;
      }
      //获取全部的平台属性
      let result3 = await this.$API.spu.reqAttrList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result3.code == 200) {
        this.attrList = result3.data;
      }
    },
    /* ---------------------图片列表----------------- */
    //selection-change   当选择项发生变化时会触发该事件
    handler(params){
      this.skuForm.skuImageList = params;
    },
    setDefault(row){
      //先把全部的数据归零
      this.imgList.forEach((item)=>{
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //收集默认图片地址
      this.skuForm.skuDefaultImg = row.imgUrl;
    },
    /* ------------------------保存和取消--------------------------------- */
    async addSku(){
      //整理参数
      //平台属性
      this.skuForm.skuAttrValueList = this.attrList.reduce((prev,item)=>{
        //prev=>起始空数组  item
        if(item.attrIdAndValueId){
          let [attrId , valueId] =item.attrIdAndValueId.split(":");
          let newObj = {attrId , valueId};
          prev.push(newObj);
        }
        return prev;
      },[]);
      //销售属性
      this.skuForm.skuSaleAttrValueList = this.saleList.reduce((prev,item)=>{
        if(item.idAndValueId){
          let [saleAttrId , saleAttrValueId] = item.idAndValueId.split(":");
          let newObj = {saleAttrId,saleAttrValueId};
          prev.push(newObj);
        }
        return prev;
      },[]);
      //发请求
      try {
        //添加SKU请求
       await this.$API.spu.reqAddSku(this.skuForm);
        //通知父亲切换场景
        this.$emit('changeScene',{scene:0,flag:''});
        Object.assign(this._data,this.$options.data());
      } catch (error) {
        
      }
    },
    //取消
    cancel(){
      this.$emit('changeScene',{scene:0,flag:''});
      //清空数据
       Object.assign(this._data,this.$options.data());
    }
  },
};
</script>

<style>
</style>