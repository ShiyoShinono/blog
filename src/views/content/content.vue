<template>
  <div class="blog">
    <div class="box">
      <div class="header">
        <h1 class="title">{{article.title}}</h1>
        <div class="message">
          <div class="username">{{article.username}}</div>
          <el-button size="mini" round class="connection" @click="changeConnection" v-if="getRole!=='-1'">{{connection}}</el-button>
          <div class="createdTime"><i class="fa fa-clock-o"></i>于{{article.createdTime}}发布</div>
          <div class="eye"><i class="fa fa-eye"></i>{{article.read}}</div>
        </div>
        <div class="tags">文章标签:<el-tag type="info" size="mini" v-for="(item,index) in article.tags" :key="index">
            {{item}}</el-tag>
        </div>
      </div>
      <div class="content">
        <div v-html="article.content"></div>
      </div>
      <div class="footer">
        <comment :commentNum="commentList.length" :commentList="commentList" @doSend="sendComment"></comment>
      </div>
    </div>
  </div>


</template>

<script>
  import {
    get_content
  } from '@/network/article'
  import {
    get_connection,
    post_editUserConnection
  } from '@/network/connection'
  import {
    get_comment,
    add_comment
  } from '@/network/comment'
  import {
    formatDate
  } from '@/common/formatDate'
  import comment from 'bright-comment'
  export default {
    components: {
      comment
    },
    data() {
      return {
        connection: '',
        id: 0,
        article: {},
        commentList: [{
          id: 0,
          commentUser: {
            id: 0,
            nickName: '',
            avatar: ''
          },
          content: '',
          createDate: ''
        }]
      }
    },
    computed: {
      getFansId() {
        return sessionStorage.getItem('message').split(',')[0]
      },
      getRole() {
        return sessionStorage.getItem('message').split(',')[1]
      }
    },
    methods: {
      // 转换时间戳为日期
      format(date) {
        const newDate = new Date(date)
        return formatDate(newDate, 'yyyy-MM-dd hh:mm:ss')
      },
      async getContent() {
        this.id = this.$route.path.split('/')[2]
        let {
          data
        } = await get_content(this.id)
        this.article = data.body.map(item => {
          return {
            user_id: item.user_id,
            title: item.title,
            content: item.content,
            username: item.user.user_name,
            createdTime: this.format(item.createdTime),
            tags: item.tag,
            read: item.read
          }
        })[0]
        let params = {
          up_id: this.article.user_id,
          fans_id: parseInt(this.getFansId)
        }
        let {
          data: res
        } = await get_connection(params)
        this.connection = res.msg
      },
      async getComment() {
        this.id = this.$route.path.split('/')[2]
        let {
          data
        } = await get_comment(this.id)
        this.commentList = data.body.map(item => {
          return {
            id: item.id,
            commentUser: item.commentUser,
            content: item.content,
            createDate: this.format(item.createDate)
          }
        })
      },
      async sendComment(content) {
        const user_id = sessionStorage.getItem('message').split(',')[0]
        const params = {
          content,
          user_id,
          article_id: this.id,
          createdTime: Date.now()
        }
        let {
          data
        } = await add_comment(params)
        if (data.code === '0') {
          this.getComment()
          return this.$message.success(data.msg)
        }
        this.$alert('评论内容不能为空', '', {
          confirmButtonText: '确定',
        })
      },
      async changeConnection() {
        let params = {
          up_id: this.article.user_id,
          fans_id: parseInt(this.getFansId)
        }
        await post_editUserConnection(params)
        this.getContent()
      }
    },
    created() {
      this.getContent()
      this.getComment()
    }

  }
</script>

<style scoped>
  @import url('~@/assets/css/wangEditor.css');

  .blog {
    /* position: relative; */
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(91vh + 5px);
    /* display: flex; */
    padding: 10px;
  }

  .box {
    /* flex: 1;
    position: absolute; */
    min-height: 88vh;
    width: 85vw;
    box-shadow: 0 0 8px #999;
    background-color: #fffdfa;
    font-size: 14px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
  }

  .header {
    margin-bottom: 10px;
  }

  .title {
    color: rgb(34, 34, 38);
    font-size: 28px;
    margin-bottom: 8px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .message {
    display: flex;
    background-color: rgb(248, 248, 248);
    padding-top: 3px;
  }

  .username {
    color: #555666;
    margin-right: 5px;
  }

  .connection {
    color: #555666;
    margin-right: 10px;
    transform: scale(0.9);
    margin-top: -2px;
  }

  .createdTime {
    margin-right: 12px;
    color: #999AAA;
  }

  .eye {
    color: #999AAA;
  }

  .tags {
    color: #999AAA;
    background-color: rgb(248, 248, 248);
  }

  .el-tag {
    margin: 3px 6px 3px 6px;
    color: #5094D5;
  }

  .content {
    flex: 1;
    padding-top: 16px;
  }

  .footer {
    /* border: 1px solid black; */
    margin-top: 50px;
  }

  .footer>>>.emoj,
  .footer>>>.reply-fa {
    display: none !important;
  }
</style>