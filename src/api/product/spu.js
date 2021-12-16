import request from '@/utils/request'

//获取SPU列表数据 url:/admin/product/{page}/{limit} 请求方式：get 参数：page，limit，category3Id
export const reqSpuList = (page,limit,category3Id)=> request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})
 
//获取spu信息 url:/admin/product/getSpuById/{spuId} 请求方式：get
export const reqSpu = (spuId)=> request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

//获取品牌信息 url:/admin/product/baseTrademark/getTrademarkList 请求方式：get
export const reqTradeMarkList = ()=> request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})

//获取spu图片 url:/admin/product/spuImageList/{spuId} 请求方式：get
export const reqSpuImageList = (spuId)=> request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取平台全部销售属性--整个平台销售属性一共3个 url:/admin/product/baseSaleAttrList 请求方式：get
export const reqBaseSaleAttrList = ()=> request({url:'/admin/product/baseSaleAttrList',method:'get'})