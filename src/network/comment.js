import {
  request
} from "@/network/request.js"

export function get_comment(id) {
  return request({
    method: 'get',
    url: '/comment/getComment',
    params:{
      article_id:id
    }
  })
}

export function add_comment(params) {
  return request({
    method: 'post',
    url: '/comment/addComment',
    data:{
      content:params.content,
      user_id:params.user_id,
      article_id:params.article_id,
      createdTime:params.createdTime
    }
  })
}