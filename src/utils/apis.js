/*
 * @Author: wudongxue
 * @Date: 2019-12-24
 * @Last Modified by: wudongxue
 * @Last Modified time: 2019-12-24
 */

// 本文件用于定义接口地址

let apis = {
	getDataSource: '/tableList', // 表格列表-动态数据渲染表格-Mock
	getOpenCity: '/cityManagementList', // 城市管理列表
	cityOpenSubmit: '/cityOpen', // 开通城市
	getOrderManageList: '/orderList', // 订单管理列表
	endOrderInfor: '/endOrderInfor', // 结束订单
	finishOrder: '/finishOrder', // 结束订单确认
	orderDetail: '/orderDetail', // 订单管理菜单之订单详情页面
	StaffManageList: '/StaffManage', // 员工管理列表
	userDelete: '/userDelete', // 员工管理之删除员工
	userAdd: '/userAdd',
	userEdit: '/userEdit',
	bikeMap: '/mapBikeList', // 车辆地图
	roleList: '/roleList', // 权限设置之角色列表
	roleCreate: '/roleCreate', // 权限设置之创建角色
	permissionEdit: '/permissionEdit', // 权限设置之修改角色权限/permissionEdit
	roleUserList: '/roleUserList', // 权限设置之获取角色下已有的用户列表
	userRoleEdit: '/role/userRoleEdit', // 权限设置之用户授权提交按钮
	login: '/userLogin',
}
export { apis }
