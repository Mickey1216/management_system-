//此模块:获取平台属性的数据模块
import request from '@/utils/request'

//获取一级分类数据 url:/admin/product/getCategory1 请求方式:get
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

//获取二级分类数据 url:/admin/product/getCategory2/{category1Id} 请求方式:get
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

//获取三级分类数据 url:/admin/product/getCategory3/{category2Id} 请求方式:get
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

//获取平台属性 url：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 请求方式:get
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

//添加属性与属性值 url:/admin/product/saveAttrInfo 请求方式:post
export const reqAddAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data })