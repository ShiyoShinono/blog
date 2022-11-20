<template>
  <div class="homePage">
    <!-- <div class="searchBox">
      <el-input placeholder="请搜索标题" v-model="searchInput" class="searchInput" @keyup.enter.native="search">>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div> -->
    <ul class="main">
      <li class="box" v-for="(item,index) in blogArr" :key="index">
        <el-button type="danger" icon="el-icon-delete" circle class="deleteBtn" size="mini" @click="showDelete(item)" v-if="getRole==='1'"></el-button>
        <img :src="item.img" @click="showContent(item.id)">
        <span class="title" @click="showContent(item.id)">{{item.title}}</span>
        <div class="tags">
          <el-tag v-for="(item2,index) in item.tag" :key="index" effect="dark" size="small" :title="item.tag">
            {{item2}}
          </el-tag>
        </div>
        <div class="boxFooter">
          <span class="createdTime">{{format(item.createdTime)}}</span>
          <span class="username" :title="item.user.user_name">{{item.user.user_name}}</span>
          <span class="read">
            <i class="el-icon-view"></i>
            {{item.read}}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {
    get_cover,
    post_updateRead,
    post_deleteArticleByAdmin,
  } from '@/network/article'
    import {
    get_userConnection
  } from '@/network/connection'

  import {
    formatDate
  } from '@/common/formatDate'
  export default {
    name: 'homePage',
    data() {
      return {
        blogArr: [],
        searchInput: ''
      }
    },
    computed: {
      getRole() {
        return sessionStorage.getItem('message').split(',')[1]
      },
      getUserId() {
        return sessionStorage.getItem('message').split(',')[0]
      }
    },
    methods: {
      // 转换时间戳为日期
      format(date) {
        const newDate = new Date(date)
        return formatDate(newDate, 'yyyy-MM-dd hh:mm:ss')
      },
      // 获取封面数据
      async getCover() {
        let {
          data
        } = await get_userConnection(this.getUserId)
        console.log(data)
        this.blogArr = data.body
      },
      async showContent(id) {
        await post_updateRead(id)
        this.$router.push(`/content/${id}`)
      },
      // async search() {
      //   let {
      //     data
      //   } = await get_ArticleByFuzzy(this.searchInput)
      //   this.blogArr = data.body
      //   this.$store.commit('getCover',this.blogArr)
      //   this.searchInput=''
      // },
      showDelete(row) {
        this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let params={id:row.id,role:sessionStorage.getItem('message').split(',')[1]}
          let {data} = await post_deleteArticleByAdmin(params)
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.getCover()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })   
        })
      }
    },
    created() {
      this.getCover()
    }
  }
</script>

<style scoped>
.homePage {
  height:92vh;
  overflow-y: auto;
  overflow-x: hidden;
}
  .searchBox {
    display: flex;
    flex-direction: row-reverse;
  }
  .searchInput {
    width: 400px;
    margin: 8px 6% 0 8px;
  }

  .main {
    background: rgba(255, 255, 255, 0.877);
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin-bottom: 5px;
  }

  .main .box {
    position: relative;
    border-radius: 5px;
    display: flex;
    width: 300px;
    height: 200px;
    flex-direction: column;
    padding: 10px 10px;
    border: 1px solid rgba(128, 128, 128, 0.459);
    margin: 8px;
  }

.deleteBtn {
  position: absolute;
  right: 4px;
}
  .main .box img {
    cursor: pointer;
    margin: 0 auto;
    border-radius: 5px;
    height: 100px;
    width: 200px;
    transition: all 0.5s;
  }

  .main .box .title {
    cursor: pointer;
    text-align: center;
    font-weight: 700;
    transition: all 0.5s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .main .box img:hover,
  .title:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }

  .tags {
    width: 250px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tags .el-tag {
    margin-top: 8px;
    margin-bottom: 5px;
    margin-right: 10px;
    width: 70px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }

  .boxFooter {
    margin-top: 8px;
    display: flex;
  }

  .boxFooter .createdTime {
    padding-left: 18px;
    font-size: 12px;
    line-height: 12px;
    flex: 3;
  }

  .boxFooter .username {
    font-size: 12px;
    line-height: 12px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 5px;
  }
  .boxFooter .read {
    font-size: 12px;
    line-height: 12px;
    flex: 1;
  }
</style>