import request from '@/utils/request'

//获取spu列表数据 url:/admin/product/{page}/{limit} 请求方式：get 参数：page，limit，category3Id
export const reqSpuList = (page,limit,category3Id)=> request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})
 
//获取spu信息 url:/admin/product/getSpuById/{spuId} 请求方式：get
export const reqSpu = (spuId)=> request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

//获取品牌信息 url:/admin/product/baseTrademark/getTrademarkList 请求方式：get
export const reqTradeMarkList = ()=> request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})

//获取spu图片 url:/admin/product/spuImageList/{spuId} 请求方式：get
export const reqSpuImageList = (spuId)=> request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取平台全部销售属性--整个平台销售属性一共3个 url:/admin/product/baseSaleAttrList 请求方式：get
export const reqBaseSaleAttrList = ()=> request({url:'/admin/product/baseSaleAttrList',method:'get'})

//修改spu|添加spu：对于添加和修改，唯一不同的是携带的参数中是否有id
export const reqAddOrUpdateSpu = (spuInfo) => {
    if(spuInfo.id){ //修改spu
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    }else{ //添加spu
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
    }
}

//删除spu
export const reqDeleteSpu = (spuId) => request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

//获取图片数据 /admin/product/spuImageList/{spuId} get
export const reqSpuImgList = (spuId)=> request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取销售属性的数据 /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId)=> request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

//获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=> request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//添加sku /admin/product/saveSkuInfo post
export const reqAddSku = (skuInfo) => request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

//获取sku列表数据 /admin/product/findBySpuId/{spuId} get
export const reqSkuList = (spuId) => request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})