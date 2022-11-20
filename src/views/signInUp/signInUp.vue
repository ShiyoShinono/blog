<template>
  <div class="P_signInUp">
    <div class="container" :class="active?'right-panel-active':''" v-if="!isReset">
      <!-- 注册 -->
      <div class="container_form container--signup">
        <el-form class="form" :rules="signUpRules" :model="signUpForm" ref="signUp">
          <h2 class="form_title">注册</h2>
          <el-form-item prop="user_name">
            <el-input type="text" class="input" placeholder="请输入用户名" v-model="signUpForm.user_name"></el-input>
          </el-form-item>
          <el-form-item prop="user_pwd">
            <el-input type="password" class="input" placeholder="请输入密码" v-model="signUpForm.user_pwd"></el-input>
          </el-form-item>
          <el-form-item prop="user_email">
            <el-input type="email" class="input" placeholder="请输入邮箱" v-model="signUpForm.user_email"></el-input>
          </el-form-item>
          <el-form-item prop="user_email2">
            <el-input type="text" class="input" placeholder="再次输入邮箱" v-model="signUpForm.user_email2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btn on_btn" @click="signUp(signUpForm)">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 登录 -->
      <div class="container_form container--signin">
      <a class="tourist" @click="visit">
        <div></div>
        <h4>游客访问</h4>
      </a>
        <el-form class="form" :rules="signInRules" :model="signInForm" ref="signIn">
          <h2 class="form_title">登录</h2>
          <el-form-item prop="user_name">
            <el-input type="text" class="input" placeholder="请输入用户名" v-model="signInForm.user_name"></el-input>
          </el-form-item>
          <el-form-item prop="user_pwd">
            <el-input type="password" class="input" placeholder="请输入密码" v-model="signInForm.user_pwd"></el-input>
          </el-form-item>
          <a class="link" @click="showReset">忘记密码?</a>
          <el-form-item>
            <el-button type="primary" class="btn" @click="signIn(signInForm)">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 浮层 -->
      <div class="container_overlay">
        <div class="overlay">
          <div class="overlay_panel overlay--left">
            <button class="btn" id="signIn" @click="removeActive">切换登录</button>
          </div>
          <div class="overlay_panel overlay--right">
            <button class="btn" id="signUp" @click="addActive">切换注册</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container resetContainer" v-else>
      <a class="back" @click="onBack">
        <div></div>
        <h4>返回登录</h4>
      </a>
      <el-form class="resetForm" :model="resetForm" v-show="!showResetPwd" :rules="resetFormRules" ref="resetForm1">
        <h2 class="form_title">重置密码</h2>
        <el-form-item prop="user_name">
          <el-input type="text" class="input" placeholder="请输入用户名" v-model="resetForm.user_name" key="user_name"></el-input>
        </el-form-item>
        <el-form-item prop="user_email">
          <el-input type="email" class="input" placeholder="请输入邮箱" v-model="resetForm.user_email" key="user_email"></el-input>
        </el-form-item>
        <el-form-item prop="user_valid">
          <el-input type="valid" class="input" placeholder="请输入验证码" v-model="resetForm.user_valid" key="user_valid"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" round @click="sendEmail(resetForm)" v-show="!isDisabled">发送</el-button>
          <el-button type="info" round disabled v-show="isDisabled">{{count}}</el-button>
          <el-button type="primary" size="medium" round @click="checkValid(resetForm)">确认</el-button>
        </el-form-item>
      </el-form>
      <el-form class="resetForm" :model="resetForm" :rules="resetFormRules" ref="resetForm2" v-show="showResetPwd">
        <h2 class="form_title">设置新密码</h2>
        <el-form-item prop="user_pwd">
          <el-input type="text" class="input" placeholder="请输入新密码" v-model="resetForm.user_pwd" key="user_pwd"></el-input>
        </el-form-item>
        <el-form-item prop="user_pwd2">
          <el-input type="text" class="input" placeholder="请重复新密码" v-model="resetForm.user_pwd2" key="user_pwd2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="resetPwd(resetForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <vue-particles color="#fff" :particleOpacity="0.7" :particlesNumber="60" shapeType="circle" :particleSize="4"
      linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2"
      :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="particles">
    </vue-particles>
  </div>
</template>

<script>
  import {
    post_signIn,
    post_signUp,
    post_sendEmail,
    post_checkValid,
    post_resetPwd
  } from '@/network/signInUp'
  export default {
    data() {
      //自定义的邮箱和手机验证规则
      const checkEmail = (rule, value, callback) => {
        const regEmail =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regEmail.test(value)) {
          return callback();
        }
        callback(new Error("请输入合法的邮箱"));
      }
      const checkRepeat = (rule, value, callback) => {
        if (this.resetForm.user_pwd === this.resetForm.user_pwd2 && this.resetForm.user_pwd !== '' && this.resetForm
          .user_pwd2 !== '') {
          return callback();
        }
        callback(new Error("两次密码不一致"));
      }
      const checkRepeat2 = (rule, value, callback) => {
        if (this.signUpForm.user_email === this.signUpForm.user_email2 && this.signUpForm.user_email !== '' && this.signUpForm
          .user_email2 !== '') {
          return callback();
        }
        callback(new Error("两次邮箱不一致"));
      }
      return {
        isDisabled:false,
        count:30,
        showResetPwd: false,
        isReset: false,
        active: false,
        resetFormRules: {
          user_name: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }],
          user_pwd2: [{
              required: true,
              message: "请输入密码",
              trigger: "blur"
            },
            {
              validator: checkRepeat,
              trigger: "blur"
            }
          ],
          user_email: [{
              required: true,
              message: "请输入邮箱",
              trigger: "blur"
            },
            {
              validator: checkEmail,
              trigger: "blur"
            },
          ]
        },
        signInRules: {
          user_name: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }],
          user_pwd: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }],
        },
        signUpRules: {
          user_name: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }],
          user_pwd: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }],
          user_email: [{
              required: true,
              message: "请输入邮箱",
              trigger: "blur"
            },
            {
              validator: checkEmail,
              trigger: "blur"
            }
          ],
          user_email2: [{
              required: true,
              message: "请输入邮箱",
              trigger: "blur"
            },
            {
              validator: checkEmail,
              trigger: "blur"
            },
            {
              validator: checkRepeat2,
              trigger: "blur"
            },
          ],
        },
        resetForm: {
          user_name: '',
          user_email: '',
          user_valid: '',
          user_pwd: '',
          user_pwd2: ''
        },
        signUpForm: {
          user_name: '',
          user_pwd: '',
          user_email: '',
          user_email2: ''
        },
        signInForm: {
          user_name: '',
          user_pwd: ''
        }
      }
    },
    methods: {
      // 返回登陆
      onBack() {
        this.$refs.resetForm1.resetFields()
        this.$refs.resetForm2.resetFields()
        this.isReset = false
        this.showResetPwd = false
      },
      // 切换注册
      addActive() {
        this.active = true
        this.$refs.signIn.resetFields()
      },
      // 切换登录
      removeActive() {
        this.active = false
        this.$refs.signUp.resetFields()
      },
      // 切换到重置密码
      showReset() {
        this.isReset = true
      },
      // 登录
      async signIn(signInForm) {
        let {
          data
        } = await post_signIn(signInForm.user_name, signInForm.user_pwd)
        if (data.code !== '0') {
          return this.$message.error(data.msg)
        }
        sessionStorage.setItem('message',[data.body.user_id,data.body.user_role])
        sessionStorage.setItem('token', data.body.token)
        this.$router.push('/home')
        this.$message.success(data.msg)
      },
      countDown() {
        this.isDisabled=true
        let timer=setInterval(()=>{
          this.count--
        },1000)
        setTimeout(()=>{
          clearInterval(timer)
          this.isDisabled=false
          this.count=30
        },30000)
      },
      // 注册
      signUp(user) {
        let createdTime=Date.now()
        this.$refs.signUp.validate(async (valid) => {
          if (!valid) return false
          let {
            data
          } = await post_signUp(createdTime,user)
          if (data.code !== '0') {
            return this.$message.error(data.msg)
          }
          this.$message.success(data.msg)
          setTimeout(() => {
            this.$refs.signUp.resetFields()
            this.active = false
          }, 500);
        })
      },
      // 发送验证码
      async sendEmail(resetForm) {
        let {
          data
        } = await post_sendEmail(resetForm)
        if (data.code !== '0') {
          return this.$message.error(data.msg)
        }
        this.$message.success(data.msg)
        this.countDown()
      },
      // 校验验证码
      async checkValid(resetForm) {
        let {
          data
        } = await post_checkValid(resetForm)
        if (data.code !== '0') {
          return this.$message.error(data.msg)
        }
        this.$message.success(data.msg)
        this.showResetPwd = true
      },
      // 重置密码
      async resetPwd(resetForm) {
        let {
          data
        } = await post_resetPwd(resetForm)
        if (data.code !== '0') {
          return this.$message.error(data.msg)
        }
        this.$message.success(data.msg)
        setTimeout(()=>{
          this.onBack()
        },500)
      },
      async visit() {
        let {
          data
        } = await post_signIn('我是游客捏', '123456')
        sessionStorage.setItem('message',[data.body.user_id,data.body.user_role])
        sessionStorage.setItem('token', data.body.token)
        this.$router.push('/home')
      }
    }
  }
</script>

<style scoped>
  .resetForm {
    background-color: #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 3rem;
    height: 80%;
    text-align: center;
  }

  .resetForm .el-button {
    margin-top: 1.5rem;
    background-color: #095c91;
    background-image: linear-gradient(90deg, #095c91 0%, #0393a3 74%);
  }

  .resetForm .is-disabled {
    margin-top: 1.5rem;
    background-color: #C8C9CC;
    background-image: none;
  }
  .tourist {
    cursor: pointer;
    position: absolute;
    display: inline-block;
    text-decoration: none;
    padding: 10px 10px 10px 40px;
    margin-left: 10px;
  }

  .tourist h4 {
    color: #4A4F6A;
    font-size: 16px;
    transform: translateY(8px);
    transition: transform 0.3s;
  }

  .tourist div {
    top: 11px;
    left: 0;
    content: '';
    width: 30px;
    height: 30px;
    display: block;
    overflow: hidden;
    position: absolute;
    border-radius: 50%;
    transform: scale(1);
    background-color: #E9E7F2;
    transition: transform 0.3s;
  }

  .tourist div::after {
    top: 0;
    left: 0;
    content: '';
    width: 60px;
    height: 30px;
    position: absolute;
    background-position: 0 0;
    background-image: url('https://s3-eu-west-1.amazonaws.com/thomascullen-codepen/back.svg');
    transition: transform 0.3s;
  }

  .tourist:hover h4 {
    color: #171922;
  }

  .tourist:hover h4 {
    transform: translateY(0);
  }

  .tourist:hover div {
    transform: scale(1.1);
    background-color: white;
    box-shadow: 0 2px 10px 0 rgba(185, 182, 198), 0 1px 3px 0 rgba(175, 172, 189);
  }

  .tourist:hover div::after {
    transform: translateX(-30px);
  }
  .back {
    cursor: pointer;
    position: relative;
    display: inline-block;
    text-decoration: none;
    padding: 10px 10px 10px 40px;
    margin-left: 10px;
  }

  .back h4 {
    color: #4A4F6A;
    font-size: 16px;
    transform: translateY(8px);
    transition: transform 0.3s;
  }

  .back div {
    top: 11px;
    left: 0;
    content: '';
    width: 30px;
    height: 30px;
    display: block;
    overflow: hidden;
    position: absolute;
    border-radius: 50%;
    transform: scale(1);
    background-color: #E9E7F2;
    transition: transform 0.3s;
  }

  .back div::after {
    top: 0;
    left: 0;
    content: '';
    width: 60px;
    height: 30px;
    position: absolute;
    background-position: 0 0;
    background-image: url('https://s3-eu-west-1.amazonaws.com/thomascullen-codepen/back.svg');
    transition: transform 0.3s;
  }

  .back:hover h4 {
    color: #171922;
  }

  .back:hover h4 {
    transform: translateY(0);
  }

  .back:hover div {
    transform: scale(1.1);
    background-color: white;
    box-shadow: 0 2px 10px 0 rgba(185, 182, 198), 0 1px 3px 0 rgba(175, 172, 189);
  }

  .back:hover div::after {
    transform: translateX(-30px);
  }

  .P_signInUp .resetContainer {
    background-color: #e9e9e9;
  }

  .resetContainer h2 {
    text-align: center;
    margin-top: 1.25rem;
  }

  .el-steps {
    background-color: rgba(233, 233, 233, 0.8);
  }

  .particles {
    height: 100vh;
    background: url('~@/assets/img/bg.jpg');
  }

  .form_title {
    font-weight: 300;
    margin: 0;
  }

  .link {
    color: #333;
    font-size: 0.9rem;
    margin: 1.5rem 0;
    text-decoration: none;
    cursor: pointer;
  }

  .container {
    background-color: rgba(233, 233, 233, 0.8);
    border-radius: 0.7rem;
    box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
      0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
    height: 420px;
    max-width: 758px;
    overflow: hidden;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    width: 100%;
  }

  .container_form {
    height: 100%;
    position: absolute;
    top: 0;
    transition: all 0.6s ease-in-out;
  }

  .container--signin {
    left: 0;
    width: 50%;
    z-index: 5;
  }

  .container.right-panel-active .container--signin {
    transform: translateX(100%);
  }

  .container--signup {
    left: 0;
    opacity: 0;
    width: 50%;
    z-index: 4;
  }

  .container.right-panel-active .container--signup {
    animation: show 0.6s;
    animation: show 0.6s;
    opacity: 1;
    transform: translateX(100%);
    z-index: 8;
  }

  .container_overlay {
    height: 100%;
    left: 50%;
    overflow: hidden;
    position: absolute;
    top: 0;
    transition: transform 0.6s ease-in-out;
    width: 50%;
    z-index: 100;
  }

  .container.right-panel-active .container_overlay {
    transform: translateX(-100%);
  }

  .overlay {
    background-color: rgba(255, 255, 255, 0.25);
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    left: -100%;
    position: relative;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    width: 200%;
  }

  .container.right-panel-active .overlay {
    transform: translateX(50%);
  }

  .overlay_panel {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    position: absolute;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    width: 50%;
  }

  .overlay--left {
    transform: translateX(-20%);
  }

  .container.right-panel-active .overlay--left {
    transform: translateX(0);
  }

  .overlay--right {
    right: 0;
    transform: translateX(0);
  }

  .container.right-panel-active .overlay--right {
    transform: translateX(20%);
  }

  .btn {
    background-color: #095c91;
    background-image: linear-gradient(90deg, #095c91 0%, #0393a3 74%);
    border-radius: 20px;
    border: 0.2px solid #315a7491;
    color: #e9e9e9;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    padding: 0.9rem 4rem;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
  }

  .form>.btn {
    margin-top: 1.5rem;
  }

  .btn:active {
    transform: scale(0.95);
  }

  .btn:focus {
    outline: none;
  }

  .form {
    background-color: #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 3rem;
    height: 100%;
    text-align: center;

  }

  .input {
    background-color: #fff;
    border: none;
    padding: 0.9rem 0.9rem;
    margin: 0.5rem 0;
    width: 100%;
  }

  @keyframes show {

    0%,
    49.99% {
      opacity: 0;
      z-index: 4;
    }

    50%,
    100% {
      opacity: 1;
      z-index: 8;
    }
  }

  @keyframes show {

    0%,
    49.99% {
      opacity: 0;
      z-index: 4;
    }

    50%,
    100% {
      opacity: 1;
      z-index: 8;
    }
  }

  .el-form-item {
    width: 17.6875rem;
    height: 2.75rem;
  }

  .el-input {
    background-color: #e9e9e9;
  }

  .el-input__inner {
    width: 17.6875rem;
    height: 2.75rem;
  }

  .container>>>.el-form-item__error {
    position: absolute;
    top: 60px;
    left: 14px;
    z-index: 1;
  }

  .on_btn {
    margin-top: 1.25rem;
  }
</style>