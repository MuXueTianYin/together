<template>
  <van-nav-bar
      :title="title"
      :left-arrow="!router.currentRoute.value.meta.showHeaderFooter"
      :left-text="!router.currentRoute.value.meta.showHeaderFooter?'返回':router.currentRoute.value.meta.showExport?'导出':''"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      v-if="router.currentRoute.value.meta.showHeaderFooter"
  >
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div :class="router.currentRoute.value.meta.showHeaderFooter&&'content'">
    <router-view></router-view>
  </div>
  <van-tabbar route @change="onChange" v-if="router.currentRoute.value.meta.showHeaderFooter">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>

  <footer class="custom-footer" v-if="router.currentRoute.value.meta.showHeaderFooter">
    <div class="footer-content">
      <span>{{ currentYear }} 版权归苏永儿所有</span>
      <div class="footer-links">
        <a href="https://www.muxuetianyin.cn" target="_blank">暮雪天音</a>
        <a href="https://github.com/MuXueTianYin" target="_blank">
          <van-icon name="github-o"/>
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
</template>

<script setup>
import {useRouter} from "vue-router";
import {ref, watchEffect} from "vue";
import {useStudentStore} from "../store/studenStore";

const router = useRouter()
const title = ref('苏永儿的主页')
const store = useStudentStore()
const handleExport = store.handleExport
const onClickLeft = () => {
  if (router.currentRoute.value.meta.showExport) {
    const fileName = window.prompt("请输入文件名", "file.xlsx");
    if (fileName) {
      handleExport(router.currentRoute.value.meta.showExport, fileName)
    }
    return
  }
  router.back();
}
watchEffect(() => {
  const route = router.currentRoute.value;
  if (route.meta && route.meta.title) {
    title.value = route.meta.title;
    document.title = route.meta.title;
  }
});

const onClickRight = () => {
  router.push('/search')
}
const onChange = (index) => {
  console.log(index)
}

</script>

<style scoped>
.content {
  /*
  这里需要减去tabbar和bar高度
  */
  height : calc(100vh - 195px);
  overflow-y : auto;
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
