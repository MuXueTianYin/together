<template>
  <div class="home">
    <van-swipe class="my-swipe" autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <van-image :src="image" alt="banner" class="video-thumbnail" >
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
      </van-swipe-item>
    </van-swipe>

    <div class="content">
      <van-card
        v-for="(item, index) in cardItems"
        :key="index"
        :title="item.title"
        :desc="item.desc"
        :thumb="item.thumb"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import imageProps1 from '../assets/images/wallhaven-8596q2.jpg'
import imageProps2 from '../assets/images/wallhaven-jxyopy.png'
import imageProps3 from '../assets/images/wallhaven-o56ewl_1920x1080.png'
import imageProps4 from '../assets/images/wallhaven-rrpy5q.png'
import imageProps5 from '../assets/images/wallhaven-vqdo2p.jpg'
import imageProps6 from '../assets/images/wallhaven-gpmwpq.jpg'

const router = useRouter();
const images = ref([
  imageProps1,
  imageProps2,
  imageProps3,
  imageProps4,
  imageProps5,
  imageProps6
]);
const cardItems = ref([
  { 
    title: '创新设计', 
    desc: '我们的设计团队致力于创新，打造出独一无二的设计风格，让你的产品在众多竞品中脱颖而出。', 
    thumb: imageProps1
  },
  { 
    title: '优质服务', 
    desc: '我们提供全方位的客户服务，无论你遇到任何问题，我们的专业团队都会在第一时间为你解答。', 
    thumb: imageProps2
  },
  { 
    title: '卓越品质', 
    desc: '我们坚持高品质的原则，所有产品都经过严格的质量检测，确保每一件产品都能满足你的需求。', 
    thumb: imageProps6
  },
  { 
    title: '快速响应', 
    desc: '我们的团队始终保持高度的警觉，无论何时何地，只要你有需求，我们都能快速响应。', 
    thumb: imageProps3
  },
  { 
    title: '专业团队', 
    desc: '我们的团队由一群专业的设计师和工程师组成，他们有丰富的经验和专业的技能，能够为你提供最优质的服务。', 
    thumb: imageProps4
  },
  // ...更多卡片数据
]);
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}

.my-swipe {
  width: 100%;
  height: 200px;
}

.content {
  padding: 10px;
}
.van-card {
  margin-bottom: 10px;
}
.van-card__title, .van-card__desc {
  white-space: normal;
overflow: visible;
}
</style>