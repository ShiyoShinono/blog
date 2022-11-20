<template>
  <div id="homeAside">
    <el-menu class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409bff"
      :default-active="activePath" @select="routerPush">
      <!-- 菜单 -->
      <el-menu-item :index="item.menu_path" v-for="(item,index) in menus" :key="item.id">
        <div v-show="item.menu_path!=='classification'||$route.path!=='/homePage'">
          <i :class="iconAside[index]"></i>
          <span>{{item.menu_name}}</span>
        </div>
        <el-tooltip class="item" effect="light" content="Right Center 提示文字" placement="right"
          v-show="item.menu_path==='classification'&&$route.path==='/homePage'">
          <div slot="content" class="content">
            <el-input placeholder="请搜索标签" v-model="searchInput" class="searchInput" @keyup.enter.native="searchTag">
              <el-button slot="append" icon="el-icon-search" @click="searchTag"></el-button>
            </el-input>
            <div class="tags">
              <el-tag v-for="(item,index) in tags" :key="index" effect="dark" size="small" :title="item.tag_name" @click="getArticleByTag(item.tag_name)">
                {{item.tag_name}}
              </el-tag>
            </div>
          </div>
          <div>
            <i :class="iconAside[index]"></i>
            <span>{{item.menu_name}}</span>
          </div>
        </el-tooltip>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {
    get_menu
  } from '@/network/menu.js'
  import {
    get_tagByDesc
  } from '@/network/tag.js'
  import {
    get_ArticleByTag
  } from '@/network/article.js'
  export default {
    name: "homeAside",
    data() {
      return {
        activePath: '',
        menus: [],
        iconAside: [],
        searchInput: '',
        tags: []
      }
    },
    methods: {
      async getMenu() {
        const role = sessionStorage.getItem('message').split(',')[1]
          this.iconAside = ['el-icon-s-home', 'el-icon-s-grid', 'el-icon-connection','el-icon-user-solid', 'el-icon-s-custom']
        let {
          data
        } = await get_menu(role)
        this.menus = data.body.menu
      },
      routerPush(index, indexPath) {
        if (index !== 'classification') {
          this.$router.push(`/${index}`)
          this.activePath = index
        }else {
          this.activePath = index
          this.$router.push('/homePage')
        }
      },
      async getTagByDesc() {
        const {
          data
        } = await get_tagByDesc()
        this.tags = data.body
      },
      async getArticleByTag(tag) {
        let {data}=await get_ArticleByTag(tag)
        this.$store.commit('getCover',data.body)
      },
      async searchTag() {
        let {data} = await get_ArticleByTag(this.searchInput)
        this.$store.commit('getCover',data.body)
        this.searchInput=''
      }
    },
    computed: {
      isAddTag() {
        return this.$store.state.isAddTag
      }
    },
    watch: {
      isAddTag(newVal, oldVal) {
        this.getTagByDesc()
      }
    },
    created() {
      this.activePath = this.$route.path.split('/')[1]
      this.getMenu()
      this.getTagByDesc()
    }
  }
</script>

<style scoped>
  #homeAside .el-menu {
    border-right: none;
  }

  .content {
    width: 400px;
    height: 400px;
  }

  .tags {
    width: 400px;
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
</style>