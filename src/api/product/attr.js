//平台属性管理模块请求文件

import request from "@/utils/request";

//获取一级分类
export const reqGetCategory1 = () =>
  request({ url: "/admin/product/getCategory1", method: "get" });

//二级分类
export const reqGetCategory2 = (category1Id) =>
  request({ url: `/admin/product/getCategory2/${category1Id}`, method: "get" });
//三级分类
export const reqGetCategory3 = (category2Id) =>
  request({ url: `/admin/product/getCategory3/${category2Id}`, method: "get" });

//获取品牌属性
export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

//新增或修改平台属性
export const reqAddOrUpdateAttr = (data) => {
  //修改
  if (data.id) {
    return request({
      url: '/admin/product/saveAttrInfo',
      method: "post",
      data,
    });
  } else {
    //新增
    return request({
      url: '/admin/product/saveAttrInfo',
      method: "post",
      data,
    });
  }
};

//删除属性值
export const reqDeleteAttrById = (attrId) =>
  request({ url: `/admin/product/deleteAttr/${attrId}`, method: "delete" });
