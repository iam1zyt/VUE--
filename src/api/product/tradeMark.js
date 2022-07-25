// 这个模板主要获取的是品牌管理的数据的模块
import request from "@/utils/request";

// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) =>
  request({url: `/admin/product/baseTrademark/${page}/${limit}`, method:'get' });

// 处理添加品牌的操作
export const reqAddOrUpadateTradeMark = (data)=>{
  //data请求题携带参数
  //区分是添加|修改，通过携带的参数是否有ID
  if(data.id){
    //修改
    return  request({url:`/admin/product/baseTrademark/update`,method:'put',data})
  }else{
    //新增
    return request({url:'/admin/product/baseTrademark/save', method: 'post', data})
  }
}

//删除品牌接口
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});