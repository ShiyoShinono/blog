import {
  request
} from "@/network/request.js"

export function get_cover() {
  return request({
    method: 'get',
    url: '/article/getCover'
  })
}

export function post_upload() {
  return request({
    method: 'post',
    url: '/article/upload'
  })
}

export function post_addArticle(params) {
  let {title,tag,img,secret,content,user_id,createdTime} = params
  return request({
    method: 'post',
    url: '/article/addArticle',
    data: {
      title,
      tag,
      img,
      secret,
      content,
      user_id,
      createdTime
    }
  })
}

export function post_delete(id) {
  return request({
    method: 'post',
    url: '/article/delete',
    data:{
      id
    }
  })
}

export function get_content(id) {
  return request({
    method: 'get',
    url: '/article/getContent',
    params:{
      id
    }
  })
}

export function post_updateArticle(params) {
  return request({
    method: 'post',
    url: '/article/updateArticle',
    data:{
      img:params.img,
      title:params.title,
      content:params.content,
      tag:params.tag,
      user_id:params.user_id,
      secret:params.secret,
      createdTime:params.createdTime,
      id:params.id
    }
  })
}

export function get_AllArticle() {
  return request({
    method: 'get',
    url: '/article/getAllArticle'
  })
}

export function get_ArticleById(user_id) {
  return request({
    method: 'get',
    url: '/article/getArticleById',
    params:{
      user_id
    }
  })
}

export function get_ArticleByFuzzy(key) {
  return request({
    method: 'get',
    url: '/article/getArticleByFuzzy',
    params:{
      key
    }
  })
}

export function get_ArticleByTag(tag) {
  return request({
    method: 'get',
    url: '/article/getArticleByTag',
    params:{
      tag
    }
  })
}

export function post_updateRead(id) {
  return request({
    method: 'post',
    url: '/article/updateRead',
    data:{
      id
    }
  })
}

export function post_deleteArticleByAdmin(params) {
  return request({
    method: 'post',
    url: '/article/deleteArticleByAdmin',
    data:{
      id:params.id,
      role:params.role
    }
  })
}

