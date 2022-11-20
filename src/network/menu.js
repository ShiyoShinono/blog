import { request } from "@/network/request.js";
// 登录
export function get_menu(role){
  return request({
    method:'get',
    url:'/menu/getMenu',
    params:{
      role
    }
  })
}