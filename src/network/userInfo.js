import {
  request
} from "@/network/request.js"

export function post_editUserInfo(params) {
  return request({
    method: 'post',
    url: '/userInfo/editUserInfo',
    data:{
      user_id:params.user_id,
      sex:params.sex,
      address:params.address,
      birthday:params.birthday,
      personalIntroduction:params.personalIntroduction,
      img:params.img
    }
  })
}

export function get_userInfo(user_id) {
  return request({
    method: 'get',
    url: '/userInfo/getUserInfo',
    params:{
      user_id,
    }
  })
}