import {
  request
} from "@/network/request.js"

export function get_tagByDesc() {
  return request({
    method: 'get',
    url: '/tag/getTagByDesc'
  })
}

export function post_addTag(tag_name) {
  return request({
    method: 'post',
    url: '/tag/addTag',
    data: {
      tag_name
    }
  })
}

