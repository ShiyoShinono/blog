import { request } from "@/network/request.js";
// 登录
export function post_signIn(user_name,user_pwd){
  return request({
    method:'post',
    url:'/user/signIn',
    data:{
      user_name,
      user_pwd
    }
  })
}
// 注册
export function post_signUp(createdTime,user){
  let {user_name,user_pwd,user_email} = user
  return request({
    method:'post',
    url:'/user/signUp',
    data:{
      createdTime,
      user_name,
      user_pwd,
      user_email,

    }
  })
}
// 发送邮件
export function post_sendEmail(user){
  let {user_name,user_email} = user
  return request({
    method:'post',
    url:'/user/sendEmail',
    data:{
      user_name,
      user_email
    }
  })
}
// 校验验证码
export function post_checkValid(user){
  let {user_name,user_email,user_valid} = user
  return request({
    method:'post',
    url:'/user/checkValid',
    data:{
      user_name,
      user_email,
      user_valid
    }
  })
}

// 重置密码
export function post_resetPwd(user){
  let {user_name,user_email,user_valid,user_pwd} = user
  return request({
    method:'post',
    url:'/user/resetPwd',
    data:{
      user_name,
      user_email,
      user_valid,
      user_pwd
    }
  })
}