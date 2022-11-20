<template>
  <div class="write">
    <el-input placeholder="请输入标题" v-model="form.title" class="title">
      <template slot="prepend">标题:</template>
    </el-input>
    <div class="tagBox">
      <el-tag :key="item" v-for="item in tags" closable :disable-transitions="false" @close="handleClose(item)">
        {{item}}
      </el-tag>
      <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
        @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">添加标签</el-button>
    </div>
    <el-upload drag action="http://127.0.0.1:3001/article/upload" :on-change="handleAvatarChange"
      :on-success="handleAvatarSuccess" :headers="headers" name="img" :auto-upload="false" ref="upload">
      <img v-if="imgUrl" :src="imgUrl" class="coverImg">
      <div v-else>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text" style="font-size:16px;">拖拽上传封面，或<em>点击上传</em></div>
        <div class="el-upload__text" style="font-size:16px;">只能上传jpg/png文件，且不超过500kb</div>
      </div>
    </el-upload>
    <wang-editor :catchData="catchData" :content="form.content"></wang-editor>
    <div class="footer">
      <el-switch v-model="secret" active-text="公开" inactive-text="私密" @change="switchChange">
      </el-switch>
      <el-button type="primary" size="middle" @click="onSubmit">发布</el-button>
    </div>
  </div>
</template>

<script>
  import WangEditor from '@/components/wangEditor.vue';
  import {
    post_updateArticle,
    get_content
  } from '@/network/article'
  export default {
    components: {
      WangEditor
    },
    data() {
      return {
        article_id: 0,
        form: {
          title: '',
          tag: '',
          img: '',
          secret: '',
          content: '',
          user_id: '',
          createdTime: 0
        },
        inputVisible: false,
        inputValue: '',
        secret: true,
        headers: {
          Authorization: sessionStorage.getItem("token")
        },
        imgUrl: '',
        tags: [],
        oldImg:''
      }
    },
    computed: {
      getFormImg() {
        let date = new Date()
        let year = date.getFullYear()
        let month = (date.getMonth() + 1).toString().padStart(2, '0')
        let day = date.getDate()
        let fileName = Date.now()
        return `http://127.0.0.1:3000/public/uploads/${year}${month}${day}/${fileName}`
      }
    },
    methods: {
      //编辑器的内容赋值
      catchData(content) {
        this.form.content = content;
      },
      switchChange(isTrue) {
        this.form.secret = isTrue ? '0' : '1'
      },
      //清除标签
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1)
      },
      // 添加标签
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //输入标签内容
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //上传成功后把图片路径保存
      async handleAvatarSuccess(res) {
        this.form.user_id = sessionStorage.getItem('message').split(',')[0]
        this.form.tag = JSON.stringify(this.tags)
        this.form.createdTime = Date.now()
        this.form.img = res.body
        let {
          data
        } = await post_updateArticle(this.form)
        this.$message.success(data.msg)
        this.$router.push('/mine')
      },
      //前端显示图片
      handleAvatarChange(file) {
        this.imgUrl = URL.createObjectURL(file.raw)
      },
      //提交数据发布
      async onSubmit() {
        if (this.imgUrl !== this.oldImg) {
          this.$refs.upload.submit()
          return
        }
        this.form.user_id = sessionStorage.getItem('message').split(',')[0]
        this.form.tag = JSON.stringify(this.tags)
        this.form.createdTime = Date.now()
        let {
          data
        } = await post_updateArticle(this.form)
        this.$message.success(data.msg)
        this.$router.push('/mine')
      },

      async getContent() {
        this.article_id = this.$store.state.article_id
        if(this.article_id!==0){
          sessionStorage.setItem('article_id',this.article_id)
        }
        await get_content(sessionStorage.getItem('article_id')).then(data => {
          if(data?.data?.body?.length!==0){
            this.form = data.data.body[0]
            this.secret=this.form.secret==='0'
            this.tags= data.data.body[0].tag
            this.imgUrl=data.data.body[0].img
            this.oldImg=data.data.body[0].img
          }
        })

      }
    },
    created() {
      // this.$bus.$on('getArticleId', data => {
      //   console.log(data)
      //   this.article_id = data
      // })
      this.getContent()
    },
    destroyed() {
      // this.$bus.$off('getArticleId')
    }
  }
</script>

<style scoped>
  .title {
    margin: 8px 8px 0 20px;
    width: 98%;
  }

  .write>>>#wangeditor {
    margin: -40px 8px 0 20px;
  }

  .write>>>.w-e-full-screen-editor {
    margin: 0 !important;
  }

  .tagBox {
    margin: 8px 8px 0 20px;
  }

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 0;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .el-tag+.button-new-tag {
    margin-left: 10px;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 0;
    vertical-align: bottom;
  }

  .el-tag+.input-new-tag {
    margin-left: 10px;
  }

  .write>>>.el-upload--text {
    transform: translate(-52px, -20px)scale(0.6);
  }

  .write>>>.el-upload-list--text {
    display: none;
  }

  .coverImg {
    width: 100%;
    height: 100%;
  }

  .footer {
    display: flex;
    margin: 8px 8px 0 80%;
  }

  .footer .el-switch {
    flex: 4;
    margin: 8px;
  }

  .footer button {
    width: 80px;
    flex: 1;
    height: 35px;
    margin-right: 16px;
  }
</style>