//此模块:获取品牌管理的数据模块
import request from '@/utils/request'

//获取品牌列表 url:/admin/product/baseTrademark/{page}/{limit} 请求方式:get
export const reqTradeMarkList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

//添加品牌操作 url：/admin/product/baseTrademark/save 请求方式:post 参数：品牌名称、品牌logo
//切记：对于新增的品牌，给服务器传递数据时不需要传递id，因为id是由服务器生成的。
//修改品牌操作 url：/admin/product/baseTrademark/update 请求方式:put 参数：品牌id、品牌名称、品牌logo
//切记：对于修改某一品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一条数据。
export const reqAddOrUpdateTradeMark = (tradeMark)=> {
    if(tradeMark.id){  //修改
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
    }else{  //新增
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
    }
}

//删除品牌操作 url:/admin/product/baseTrademark/remove/{id} 请求方式:delete 
export const reqDeleteTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
