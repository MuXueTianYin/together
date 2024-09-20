<template>
  <div class="report-page">
    <van-search v-model="searchValue" show-action placeholder="搜索报表" @search="onSearch" />

    <van-dropdown-menu>
      <van-dropdown-item v-model="timeRange" :options="timeOptions" />
      <van-dropdown-item v-model="category" :options="categoryOptions" />
    </van-dropdown-menu>

    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <van-card
          v-for="(report, index) in reports"
          :key="index"
          :title="report.title"
          :desc="report.desc"
          :thumb="report.thumb"
      />
    </van-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchValue = ref('');
const timeRange = ref('今天');
const category = ref('所有类别');
const reports = ref([]);
const loading = ref(false);
const finished = ref(false);

const timeOptions = ['今天', '本周', '本月', '今年'];
const categoryOptions = ['所有类别', '类别1', '类别2', '类别3'];

const onSearch = (value) => {
  // 在这里执行搜索操作
};

const onLoad = () => {
  // 在这里加载更多报表数据
};
</script>

<style scoped>
.report-page {
  padding: 10px;
}
</style>