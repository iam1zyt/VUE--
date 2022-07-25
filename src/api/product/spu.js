import request from "@/utils/request";

//获取三级分类下的SPU(类的列表的数据接口)
export const reqSpuList = (page, limit, category3Id) => request({url:`/admin/product/${page}/${limit}?category3Id=${category3Id}`,method:'get'});
