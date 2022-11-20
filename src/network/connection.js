import {
  request
} from "@/network/request.js"
export function get_connection(data) {
  return request({
    method: 'get',
    url: '/userConnection/getConnection',
    params:{
      up_id:data.up_id,
      fans_id:data.fans_id
    }
  })
}
export function post_editUserConnection(params) {
  return request({
    method: 'post',
    url: '/userConnection/editUserConnection',
    data:{
      up_id:params.up_id,
      fans_id:params.fans_id
    }
  })
}

export function get_userConnection(id) {
  return request({
    method: 'get',
    url: '/userConnection/getUserConnection',
    params:{
      id
    }
  })
}

export function get_connectionList(id) {
  return request({
    method: 'get',
    url: '/userConnection/getConnectionList',
    params:{
      id
    }
  })
}