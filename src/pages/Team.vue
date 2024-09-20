<template>
  <div>
    <van-search v-model="searchValue" :placeholder="'请输入学生'+searchType" @search="onSearch" />
    <van-dropdown-menu>
      <van-dropdown-item title="搜索类型" v-model="searchType" :options="searchOptions" />
      <van-dropdown-item :options="options1" v-model="value1" @change="onSearch" />
<!--      <van-dropdown-item :options="options2" v-model="value2" @change="onSearch" />-->
      <van-dropdown-item :options="options3" v-model="value3" @change="onSearch" />

    </van-dropdown-menu>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
    <div
      v-for="(student, index) in displayedStudents"
      :key="student.id"
      class="student-info"
      :class="{ 'student-info-even': index % 2 === 0, 'student-info-odd': index % 2 !== 0 }"
    >
      <van-cell :title="'姓名: ' +student.studentName" class="student-info-cell" />
      <van-cell :title="'学号: ' +student.studentID" class="student-info-cell" />
      <van-cell :title="'专业: ' + student.profession" class="student-info-cell" />
      <van-cell :title="'性别: ' + (student.gender === 1 ? '男' : '女')" class="student-info-cell" />
      <van-cell :title="'班级: ' + student.studentClass" class="student-info-cell" />
      <van-cell :title="'年级: ' + student.studentGrade+'级'" class="student-info-cell" />
      <van-cell :title="'手机号: ' +student.phone" class="student-info-cell" />
    </div>
  </van-list>
    <van-back-top right="5vw" bottom="10vh" />
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {getStudents} from '../api/services';
import {closeToast, showFailToast, showLoadingToast} from "vant";

const students = ref([

]);

let loading = ref(false);
let finished = ref(false);
let searchValue = ref('');
let value1 = ref('请选择');
let searchType = ref('姓名');
let page = ref(1);
let pageSize = ref(10);

const options1 = ref([
  { text: '选择性别', value: '请选择' },
  { text: '男', value: '男' },
  { text: '女', value: '女' },
]);
let searchOptions = ref([
  { text: '搜索姓名', value: '姓名' },
  { text: '搜索专业', value: '专业' },
]);
let value3 = ref('请选择'); // 新增年级选择变量

const options3 = ref([ // 新增年级选项
  { text: '选择年级', value: '请选择' },
  { text: '2018', value: '2018' },
  { text: '2019', value: '2019' },
  { text: '2020', value: '2020' },
  { text: '2021', value: '2021' },
  { text: '2022', value: '2022' },
]);


const displayedStudents = computed(() => {
  return students.value ? students.value.slice(0, page.value * pageSize.value) : [];
});

const onLoad = async () => {
  const gender = value1.value === '男' ? 1 : value1.value === '女' ? 0 : undefined;
  const studentGrade = value3.value !== '请选择' ? value3.value : undefined; // 修改这里
  showLoadingToast({
    duration: 0,
    message: '加载中...',
    forbidClick: true,
  });
  const newStudents = await getStudents({
    page: page.value,
    size: pageSize.value,
    studentGrade: studentGrade,
    studentName: searchValue.value,
    gender: gender
  });
  if (newStudents) {
    students.value = students.value.concat(newStudents);
    if (newStudents.length < pageSize.value) {
      finished.value = true;
    } else {
      page.value++;
    }
    closeToast();
  } else {
    finished.value = true;
    showFailToast('加载失败');
  }

  loading.value = false;
};



const onSearch = async () => {
  students.value = [];
  page.value = 1;
  finished.value = false;
  loading.value = true;

  const searchParams = {
    page: page.value,
    size: pageSize.value,
  };

  if (searchType.value === '姓名') {
    searchParams.studentName = searchValue.value;
  } else if (searchType.value === '专业') {
    searchParams.profession = searchValue.value;
  }

  const newStudents = await getStudents(searchParams);
  students.value = newStudents;
  loading.value = false;
};
onMounted(onSearch);
</script>

<style scoped>
.student-info-cell .van-cell{
  border-bottom: none !important;
}
.student-info:not(:last-child) {
  border-bottom: 1px solid #ebedf0;
}
.student-info-even {
  background-color: #f8f8f8;
}
.student-info-odd {
  background-color: #ffffff;
}
.student-info-even .van-cell {
  background-color: #f8f8f8 !important;
}
.student-info-odd .van-cell {
  background-color: #ffffff !important;
}
</style>
