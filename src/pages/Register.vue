<template>
  <!-- ...existing code... -->
  <div class="register">
    <h2>注册</h2>
    <van-form>
      <van-field
          v-model="registerUsername"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' },{ min: 4, message: '用户名不能小于4位' }]"
      />
      <van-field
          v-model="registerPassword"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' },{ min: 8, message: '密码不能小于8位' }]"
      />
      <van-field
          v-model="checkPassword"
          type="password"
          name="确认密码"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true, message: '请确认密码' },{ min: 8, message: '密码不能小于8位' }]"
      />
      <van-button type="primary" @click="register">注册</van-button>
      <p>已有账号？<a @click="toggleForm">登录</a></p>
    </van-form>
    <footer class="custom-footer" >
      <div class="footer-content">
        <span>{{ currentYear }} 版权归苏永儿所有</span>
        <div class="footer-links">
          <a href="https://www.muxuetianyin.cn" target="_blank">暮雪天音</a>
          <a href="https://github.com/MuXueTianYin" target="_blank">
            <van-icon name="github-o" />
          </a>
          <a href="https://www.muxuetianyin.cn" target="_blank">muxeutianyin</a>
        </div>
        <div class="beian-info">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            备案号
          </a>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            粤ICP备2022126574号-2
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register as apiRegister } from '../api/services';
import {showFailToast, showSuccessToast} from "vant";
const registerUsername = ref('');
const registerPassword = ref('');
const checkPassword = ref('');
const router = useRouter();
const toggleForm = () => {
  router.push('/login');
};
const register = async () => {
  if (registerPassword.value !== checkPassword.value) {
    showFailToast('两次输入的密码不一致');
    return;
  }
  const response = await apiRegister(registerUsername.value, registerPassword.value, checkPassword.value);
  if (response.code === 0) {
    showSuccessToast('注册成功');
    router.push('/login');
  }else {
    showFailToast(response.description);
  }
};
</script>
<style scoped>
.register {
  min-height: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

h2 {
  color: #3f51b5; /* 更改标题颜色 */
  font-size: 24px; /* 更改标题字体大小 */
  margin-bottom: 20px; /* 添加标题下方的空间 */
}

.van-field {
  width: 100%;
  max-width: 300px; /* 限制输入框的最大宽度 */
  margin-bottom: 10px; /* 添加输入框之间的空间 */
  border-radius: 4px; /* 添加圆角 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 添加阴影 */
}

.van-button {
  width: 100%;
  max-width: 300px; /* 限制按钮的最大宽度 */
  background-color: #3f51b5; /* 更改按钮颜色 */
  color: white; /* 更改按钮文字颜色 */
  border-radius: 4px; /* 添加圆角 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 添加阴影 */
  margin-top: 10px; /* 添加按钮上方的空间 */
}


.custom-footer {
  background: none;
  padding: 10px 0;
  color: #807e7d;
  font-size: 14px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-links {
  margin: 10px 0;
}

.footer-links a {
  margin: 0 10px;
  color: #807e7d;
  text-decoration: none;
}

.beian-info {
  font-style: italic;
}

.beian-info a {
  margin-right: 10px;
  color: #807e7d;
  text-decoration: none;
}
</style>
