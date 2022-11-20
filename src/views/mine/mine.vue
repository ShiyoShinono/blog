<template>
  <div class="mine">
    <div class="box">
      <el-button type="primary" class="addBtn" @click="showWrite">写博客</el-button>
      <el-button type="primary" class="changeFlag" @click="changeFlag">{{flag?'切换至博客列表':'切换至关注列表'}}</el-button>
      <el-table border class="table" :data="tableData" v-show="!flag">
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="createdTime" label="日期">
        </el-table-column>
        <el-table-column prop="secret" label="公开">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showContent(scope.row)" type="text" size="small">
              查看
            </el-button>
            <el-button @click="editRow(scope.row)" type="text" size="small">
              编辑
            </el-button>
            <el-button @click="deleteRow(scope.row)" type="text" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table border class="table" :data="connectionData" v-show="flag">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="关注人">
                <span>{{ props.row.user_name }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ props.row.sex }}</span>
              </el-form-item>
              <el-form-item label="生日">
                <span>{{ props.row.birthday }}</span>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="个人简介">
                <span>{{ props.row.personalIntroduction }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="关注人">
        </el-table-column>
        <el-table-column prop="sex" label="性别">
        </el-table-column>
        <el-table-column prop="birthday" label="生日">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column prop="personalIntroduction" label="个人简介">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteConnection(scope.row)" type="text" size="small">
              取消关注
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-card class="box-card">
      <el-upload drag action="http://127.0.0.1:3001/article/upload" :on-change="handleAvatarChange"
        :on-success="handleAvatarSuccess" :headers="headers" name="img" :auto-upload="false" ref="upload"
        class="avatar-uploader" :disabled="isChange">
        <img v-if="imgUrl" :src="imgUrl" style="width:100%;height:100%;">
        <div v-else>
          <i class="el-icon-plus" style="font-size:20px;margin-top:35px;"></i>
        </div>
      </el-upload>
      <div v-if="isChange">
        <el-row>
          <el-col :span="6" :offset="4">用户名:</el-col>
          <el-col :span="14">{{userInfo.user.user_name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">性别:</el-col>
          <el-col :span="14">{{userInfo.sex==='1'?'男':'女'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">出生日期:</el-col>
          <el-col :span="14">{{userInfo.birthday}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">所在地区:</el-col>
          <el-col :span="14">{{userInfo.address}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">个人简介:</el-col>
          <el-col :span="14">{{userInfo.personalIntroduction}}</el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row>
          <el-col :span="6" :offset="4">用户名:</el-col>
          <el-col :span="14">{{userInfo.user.user_name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">性别:</el-col>
          <el-select v-model="userInfo.sex" placeholder="请选择">
            <el-option v-for="item in sexOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">出生日期:</el-col>
          <el-date-picker v-model="userInfo.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">所在地区:</el-col>
          <v-distpicker :province="address.province" :city="address.city" :area="address.area"
            @province="provinceChange" @city="cityChange" @area="areaChange"></v-distpicker>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="4">个人简介:</el-col>
          <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" resize="none" style="width:180px"
            v-model="userInfo.personalIntroduction"></el-input>
        </el-row>
      </div>
      <div class="footerBtn">
        <el-button size="medium" round type="success" @click="editInformation" :disabled="!isChange">编辑</el-button>
        <el-button size="medium" round type="success" @click="saveInformation" :disabled="isChange">保存</el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
  import VDistpicker from 'v-distpicker'
  import {
    get_ArticleById,
    post_delete
  } from '@/network/article'
  import {
    post_editUserInfo,
    get_userInfo
  } from '@/network/userInfo'
  import {
    formatDate
  } from '@/common/formatDate'
  import {
    get_connectionList,
    post_editUserConnection
  } from '@/network/connection'
  export default {
    name: 'mine',
    components: {
      VDistpicker
    },
    data() {
      return {
        flag: false,
        headers: {
          Authorization: sessionStorage.getItem("token")
        },
        oldImg: '',
        user_id: 0,
        sexOption: [{
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }],
        imgUrl: require('@/assets/img/avatar.jpg'),
        tableData: [],
        connectionData: [],
        isChange: true,
        birthday: '',
        userInfo: {
          user: {
            user_name: ''
          },
          user_id: '',
          sex: '',
          birthday: '',
          address: '',
          personalIntroduction: '',
          img: ''
        },
        address: {
          province: '',
          city: '',
          area: '',
        }
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
        this.user_id = sessionStorage.getItem('message').split(',')[0]
        let {
          data
        } = await get_ArticleById(this.user_id)
        this.tableData = data.body.map((item) => {
          return {
            id: item.id,
            title: item.title,
            secret: item.secret === '0' ? '是' : '否',
            createdTime: this.format(item.createdTime)
          }
        })
      },
      async getConnectionList() {
        this.user_id = sessionStorage.getItem('message').split(',')[0]
        let {
          data
        } = await get_connectionList(this.user_id)
        console.log(data);
        this.connectionData = data.body.map(item => {
          let arr = item.address.split(',')
          return {
            ...item,
            birthday: item.birthday !== '' ? item.birthday : '空',
            sex: item.sex === '1' ? '男' : '女',
            user_name: item.user.user_name,
            personalIntroduction: item.personalIntroduction !== '' ? item.personalIntroduction : '空',
            address: arr.join('') !== '' ? `${arr[0]}${arr[1]}${arr[2]}` : '空'
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
          let {
            data
          } = await post_delete(row.id)
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
      deleteConnection(row) {
        let params={up_id:row.user_id,fans_id:this.user_id}
        this.$confirm('此操作将取消关注该博主, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let {
            data
          } = await post_editUserConnection(params)
          console.log(data)
          this.getConnectionList()
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
      async getUserInfo() {
        let {
          data
        } = await get_userInfo(this.user_id)
        if (data.code === '0') {
          this.userInfo = data.body[0]
          this.address = data.body[0].address.split(',')
          this.address = {
            province: data.body[0].address.split(',')[0],
            city: data.body[0].address.split(',')[1],
            area: data.body[0].address.split(',')[2]
          }
          this.userInfo.address = data.body[0].address.split(',').join('')
          this.imgUrl = data.body[0].img,
            this.oldImg = data.body[0].img
        }
      },
      editInformation() {
        this.isChange = false
        this.userInfo.user_id = sessionStorage.getItem('message').split(',')[0]
      },
      async saveInformation() {
        if (this.imgUrl !== this.oldImg && this.oldImg !== '') {
          this.$refs.upload.submit()
          return
        }
        this.userInfo.address = `${this.address.province},${this.address.city},${this.address.area}`
        await post_editUserInfo(this.userInfo)
        this.getUserInfo()
        this.isChange = true
      },
      //前端显示图片
      handleAvatarChange(file) {
        this.imgUrl = URL.createObjectURL(file.raw)
      },
      //上传成功后把图片路径保存
      async handleAvatarSuccess(res) {
        this.userInfo.img = res.body
        this.userInfo.address = `${this.address.province},${this.address.city},${this.address.area}`
        await post_editUserInfo(this.userInfo)
        this.isChange = true
      },
      provinceChange(data) { //省
        this.address.province = data.value
      },
      cityChange(data) { //市
        this.address.city = data.value
      },
      areaChange(data) { //区、县
        this.address.area = data.value
      },
      changeFlag() {
        this.flag = !this.flag
      }
    },
    created() {
      this.getTable()
      this.getConnectionList()
      this.getUserInfo()
    }
  }
</script>

<style scoped>
  .mine {
    display: flex;
  }

  .box {
    min-width: 60vw;
  }

  .box .addBtn {
    margin-left: 63%;
    margin-bottom: 8px;
    margin-top: 8px;
  }
  .changeFlag {
    margin-left: 10px;
    margin-bottom: 8px;
    margin-top: 8px;
  }
  .box .table {
    margin-left: 8px;
    width: 90%;
  }

  .box>>>.el-table__empty-block {
    height: 600px !important;
  }

  .el-card {
    margin-top: 57px;
    width: 25vw;
    height: 80vh;
  }

  .mine>>>.el-upload-list--text {
    display: none;
  }

  .uploadImg {
    font-size: 48px;
  }

  .mine>>>.el-upload-dragger {
    width: 90px;
    height: 90px;
    border-radius: 45px;
  }

  .mine>>>.el-upload {
    margin-left: 125px;
  }

  .el-col {
    word-wrap: break-word;
    color: #999AAA;
    margin-bottom: 8px;
  }

  .el-row {
    margin-bottom: 8px;
  }

  .mine>>>select {
    /* width: 90px;
    height: 30px;
    line-height: 30px;
    padding: 0;
    font-size: 14px; */
    margin-bottom: 5px;
    width: 180px;
    height: 30px;
    line-height: 30px;
    padding: 0;
    font-size: 14px;
  }

  .mine>>>.distpicker-address-wrapper label:last-child select {
    margin-left: 142px;
  }

  .mine>>>.distpicker-address-wrapper label:nth-child(2) select {
    margin-left: 142px;
  }

  /* .mine>>>.distpicker-address-wrapper label:first-child :first-child {
    width: 180px;
    height: 30px;
    line-height: 30px;
    padding: 0;
    font-size: 14px;
  } */

  .el-row .el-input,
  .el-select {
    width: 180px;
    height: 30px;
  }

  .el-row>>>.el-input__inner {
    height: 30px;
  }

  .el-row>>>.el-input__icon {
    height: 30px;
    line-height: 30px;
  }

  .footerBtn {
    display: flex;
    justify-content: center;
  }

  .footerBtn .el-button {
    width: 80px;
  }

  textarea {
    outline-color: rgb(179, 216, 255);
  }

  .mine>>>.demo-table-expand {
    font-size: 0;
  }

  .mine>>>.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .mine>>>.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .mine>>>.el-table__expanded-cell{
    padding-left: 10px;
  }
</style>