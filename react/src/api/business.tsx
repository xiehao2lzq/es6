import { GET, POST } from '@/utils/fetch'

export const getBusinessList = () => GET('/web/admin/business/businessList?key={"param":{"own_app_id":1}}')

// 保存公司信息
export const postChangeBusiness = (param) => POST('/web/admin/business/changeBusiness', param)

// 产品与服务列表
export const getProductList = (param) => GET('/web/admin/product/productList', param)

// x新增产品与服务列表
export const postAddProductList = (param) => POST('/web/admin/product/addProduct',param)

// 删除产品与服务
export const getDelProduct = (param) => GET('/web/admin/product/delProduct',param)

// 查看产品与服务详情
export const getProductDetail = (param) => GET('/web/admin/product/productDetail', param)

// 修改产品与服务
export const postEditProduct = (param) => POST('/web/admin/product/editProduct', param)

