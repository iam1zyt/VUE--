import request from "@/utils/request";

//获取三级分类下的SPU(类的列表的数据接口)
export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}?category3Id=${category3Id}`,
    method: "get",
  });
//通过类的ID获取类的信息
///admin/product/getSpuById/{spuId}  get
export const reqSpuById = (spuId) =>
  request({ url: `/admin/product/getSpuById/${spuId}`, method: "get" });

//通过类的ID获取照片墙的数据
///admin/product/spuImageList/{spuId}  get
export const reqSpuImageList = (spuId) =>
  request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

//获取下拉框品牌的数据
///admin/product/baseTrademark/getTrademarkList  GET
export const reqTrademarkList = () =>
  request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: "get",
  });

//获取项目中全部的销售属性值---[颜色、尺寸、尺码]
///admin/product/baseSaleAttrList get
export const reqSaleAttrList = () =>
  request({ url: `/admin/product/baseSaleAttrList`, method: "get" });

//新增SPU||修改SPU的接口
export const reqAddOrUpdateSpu = (data) => {
  if (data.id) {
    return request({
      url: `/admin/product/updateSpuInfo`,
      method: "post",
      data,
    });
  } else {
    return request({ url: `/admin/product/saveSpuInfo`, method: "post", data });
  }
};

//某一个类的平台属性
export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

//某一个类的销售属性
export const reqSaleAttrLists = (spuId) =>
  request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: "get" });

//添加SKU的接口
export const reqAddSku = (data) =>
  request({ url: `/admin/product/saveSkuInfo`, method: "post", data });

//删除SPU业务
export const reqDeleteSpu = (spuId) =>
  request({ url: `/admin/product/deleteSpu/${spuId}`, method: "delete" });

//通过SpuId查看SKU
export const reqFindSku = (spuId) =>
  request({ url: `/admin/product/findBySpuId/${spuId}`, method: "get" });
