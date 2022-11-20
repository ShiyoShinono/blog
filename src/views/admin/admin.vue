<template>
  <div class="mine">
    <div class="searchBox">
      <el-input placeholder="请搜索标题" v-model="searchInput" class="searchInput" @keyup.enter.native="search">>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <!-- <el-button type="primary" class="addBtn" @click="showWrite">写博客</el-button> -->
    <el-table border style="width:70%" class="table" :data="tableData">
      <el-table-column prop="user_name" label="作者">
      </el-table-column>
      <el-table-column prop="title" label="标题">
      </el-table-column>
      <el-table-column prop="createdTime" label="日期">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="showContent(scope.row)" type="text" size="small">
            查看
          </el-button>
          <!-- <el-button @click="editRow(scope.row)" type="text" size="small">
            编辑
          </el-button> -->
          <el-button @click="deleteRow(scope.row)" type="text" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    get_AllArticle,
    post_deleteArticleByAdmin,
    get_ArticleByFuzzy
  } from '@/network/article'
  import {
    formatDate
  } from '@/common/formatDate'
  export default {
    name: 'mine',
    data() {
      return {
        tableData: [],
        searchInput: ''
      }
    },
    methods: {
      // 转换时间戳为日期
      format(date) {
        const newDate = new Date(date)
        return formatDate(newDate, 'yyyy-MM-dd hh:mm:ss')
      },
      //获取表格数据
      async getTable() {
        let {
          data
        } = await get_AllArticle()
        this.tableData = data.body.map((item) => {
          return {
            id: item.id,
            user_name: item.user.user_name,
            title: item.title,
            createdTime: this.format(item.createdTime)
          }
        })
      },
      // 删除博客
      deleteRow(row) {
        this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params={id:row.id,role:sessionStorage.getItem('message').split(',')[1]}
          let {data} = await post_deleteArticleByAdmin(params)
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.getTable()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      editRow(row) {
        // this.$bus.$emit('getArticleId',row.id)
        this.$store.commit('getArticleId', row.id)
        this.$router.push('/rewrite')
      },
      showContent(data) {
        this.$router.push(`/content/${data.id}`)
      },
      showWrite() {
        this.$router.push('/write')
      },
      async search() {
        let {
          data
        } = await get_ArticleByFuzzy(this.searchInput)
        this.tableData = data.body.map(item => {
          return {
            id: item.id,
            user_name: item.user.user_name,
            title: item.title,
            createdTime: this.format(item.createdTime)
          }
        })
        this.searchInput = ''
      }
    },
    created() {
      this.getTable()
    }
  }
</script>

<style scoped>
  .searchBox {
    display: flex;
    flex-direction: row-reverse;
  }

  .searchInput {
    width: 400px;
    margin: 8px 6% 0 8px;
  }

  .mine .addBtn {
    margin-left: calc(64% + 2px);
    margin-bottom: 8px;
    margin-top: 8px;
  }

  .mine .table {
    margin-left: 8px;
    height: 90%;
    margin-top: 8px;

  }

  .mine>>>.el-table__empty-block {
    height: 600px !important;
  }
</style>