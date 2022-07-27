import request from "@/utils/request";

//下架SKU
export const cancelSale = (skuId) =>
  request({ url: `/admin/product/cancelSale/${skuId}`, method: "get" });

//上架SKU
export const onSale = (skuId) =>
  request({ url: `/admin/product/onSale/${skuId}`, method: "get" });

//删除指定id的sku
export const remove = (skuId) =>
  request({ url: `/admin/product/deleteSku/${skuId}`, method: "delete" });

//根据指定的SPU id查询所有对应的SKU列表
export const getListbySpuId = (spuId) =>
  request({ url: `/admin/product/findBySpuId/${spuId}`, method: "get" });

//根据sku的id查询sku的详细信息
export const get = (skuId) =>
  request({ url: `/admin/product/getSkuById/${skuId}`, method: "get" });

//获取sku的分页列表
export const getList = (page, limit) =>
  request({ url: `/admin/product/list/${page}/${limit}`, method: "get" });

//保存sku
export const addUpdate = (skuInfo) =>
  request({
    url: `/admin/product/${skuInfo.id ? "update" : "save"}SkuInfo`,
    skuInfo,
    method: "post",
  });

//获取指定spu的id对应的图片列表
export const getSpuImageList = (spuId) =>
  request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

/* 
  获取指定SPU的id对应的销售属性列表
  */
export const getSpuSaleAttrList = (spuId) =>
  request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: "get" });
