<template>
  <div class="search-page">
    <div class="search-bar">
      <form action="/">
        <van-search
            v-model="value"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onCancel"
        />
      </form>
    </div>
<!-- 搜索历史-->
    <div class="search-history">
      <div class="search-history-header">
        <span>搜索历史</span>
        <van-button size="small" type="danger" @click="clearHistory">清除历史</van-button>
      </div>
      <van-cell
          v-for="(history, index) in searchHistory"
          :key="index"
          :title="history"
          clickable
          @click="onHistoryClick(history)"
      />
    </div>
<!-- 热门搜索   -->
    <div class="hot-search">
      <div class="hot-search-header">
        <span>热门搜索</span>
      </div>
      <div class="hot-search-tags">
        <van-tag
            v-for="(tag, index) in hotSearchTags"
            :key="index"
            type="primary"
            @click="onTagClick(tag)"
        >
          {{ tag }}
        </van-tag>
      </div>
    </div>

    <div class="search-results">
      <!-- 搜索分类 -->
      <div class="search-results-tabs">
        <van-tabs scrollable v-model:active="activeTab"  @click="onTabChange">
          <van-tab v-for="(tab, index) in tabs" :key="index" :title="tab.title"></van-tab>
        </van-tabs>

<!--        <van-dropdown-menu>-->
<!--          <van-dropdown-item :value="activeTab" :options="tabs.map((tab,index )=>{return {text:tab.title,value:index} })"></van-dropdown-item>-->
<!--        </van-dropdown-menu>-->
      </div>
      <!-- 搜索结果展示 -->
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" vertical>
        <van-swipe-item v-for="(result, index) in results" :key="index">
          <van-image   fit="cover" position="center" :src="result.url" alt="" class="video-thumbnail" >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <div class="video-info">
            <div class="video-title">{{ result.title }}</div>
            <!-- 显示更多信息 -->
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue';
import { useRouter } from "vue-router";
import { searchPhotoAlbum,getPhotoAlbumCategories } from '../api/services';
import {closeToast, showFailToast, showLoadingToast} from "vant";


let activeTab = ref(0);
const router = useRouter();
let tabs = ref([{ title: '全部', name: '全部' }]);
let value = ref('');
let results = ref([]);
let searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory')) || []);
let hotSearchTags = ref([
  '我们很好',
  'リセット',
  '自作多情',
]);
//请求所有标签添加上去
onMounted(async () => {
  const categories = await getPhotoAlbumCategories();
  if (categories) {
    tabs.value = [{ title: '全部', name: '全部' }, ...categories.map(category => ({ title: category, name: category }))];
  }
});

const onTabChange =async (index) => {
  await nextTick();
  onSearch(value.value, tabs.value[activeTab.value].title);
};
//获取图片信息
const onSearch = async (value, category) => {
  showLoadingToast({
    duration: 0,
    message: '加载中...',
    forbidClick: true,
  });
  let params={
    name:value,
    category
  }
  if (category === '全部'){
    params.category=''
  }
  const res = await searchPhotoAlbum(params);
  if (res) {
    results.value = res;
    closeToast();
  }else {
    showFailToast('加载失败');
  }
  if (!value) {
    return;
  }
  let history = localStorage.getItem('searchHistory');
  if (history) {
    history = JSON.parse(history);
    if (!history.includes(value)) {
      history.push(value);
    }
  } else {
    history = [value];
  }
  localStorage.setItem('searchHistory', JSON.stringify(history));
  searchHistory.value = history;
};
onSearch()
const onCancel = () => {
  value.value = '';
  router.back();
};

const clearHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
};

const onHistoryClick = async (history) => {
  value.value = history;
  onSearch(value.value, tabs.value[activeTab.value].title);
};

const onTagClick = async (tag) => {
  value.value = tag;
  onSearch(value.value, tabs.value[activeTab.value].title);
};
</script>

<style scoped>
.search-page {
  padding: 10px;
  overflow: auto;
}
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
form {
  width: 100%;
  height: 100%;
}
.search-results {
  margin-top: 20px;
}
.my-swipe {
  width: 100%;
  height: 200px;
}
.video-thumbnail {
  width: 100%;
  height: 100%;
}
.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}
.search-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.hot-search-header {
  padding: 10px;
}
.hot-search-tags {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.hot-search-tags .van-tag {
  margin: 5px;
}
.search-results-tabs{
  padding-bottom: 15px;
}
</style>
