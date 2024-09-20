<template>

  <div class="user-profile"  data-intro="欢迎来到用户页面，请配置用户信息">

      <!-- 用户基本信息 -->
      <div class="user-info" data-intro="这是用户的基本信息" data-step="1">
        <van-image
            width="100"
            height="100"
            fit="cover"
            :src="user?.avatarUrl"
            class="avatar"
        />
        <h2 class="username">{{ user?.username }}</h2>
        <p class="bio">{{ user?.signature }}</p>
      </div>

      <!-- 用户内容 -->
      <div class="user-content" data-intro="这是用户的内容。" data-step="2">
        <h3 class="content-title">用户标签</h3>
        <!-- 这里可以根据你的需求添加用户的内容，如视频，文章等 -->
        <div class="content-item" >
          <div class="tag-container">
            <van-tag
                v-for="(tag, index) in (user && user.tags ? user.tags.split(',') : [])"
                :key="index"
                type="primary"
                size="large"
            >
              {{ tag.trim() }}
            </van-tag>
          </div>
        </div>
        <h3 class="content-title">用户资料</h3>
        <van-cell-group>
          <van-cell title="用户名" :value="user.username" />
          <van-cell title="性别" :value="user.gender === 1 ? '男' : '女'" />
          <van-cell title="电话" :value="user.phone" />
          <van-cell title="邮箱" :value="user.email" />
          <van-cell title="创建时间" :value="new Date(user.createTime).toLocaleString()" />
        </van-cell-group>
      </div>
      <!-- 编辑用户信息 -->
      <van-button type="primary" @click="editUserInfo" data-intro="点击这里可以编辑用户信息。" data-step="3">编辑用户信息</van-button>
    <van-dialog v-model:show="showEditDialog">
      <template #title>编辑用户信息</template>
      <van-form>
        <van-field v-model="editableUser.username" label="用户名" />
        <van-field v-model="editableUser.signature" label="个性签名" type="signature" />
        <van-field name="uploader" label="头像">
          <template #input>
            <van-uploader :file-list="editableUser.avatarUrl ? [editableUser.avatarUrl] : []" :after-read="afterRead" label="头像" :max-count="1"  @oversize="onOversize" multiple :max-size="5000 * 1024"/>
            <van-image
                width="100"
                height="100"
                fit="cover"
                :src="editableUser.avatarUrl"
                class="avatar"
            />
          </template>
        </van-field>
<!--        -->
        <van-field
            v-model="editableUser.tags"
            is-link
            readonly
            name="picker"
            label="标签"
            placeholder="点击标签"
            @click="showPopup = true"
        />
        <van-popup v-model:show="showPopup" position="bottom" :style="{ height: '70vh' }">
          <div class="popup-content">
            <div class="tag-container">
              <van-tag
                  v-for="tag in tagList"
                  :key="tag"
                  :type="selectedTags.includes(tag) ? 'primary' : 'default'"
                  plain
                  shape="square"
                  @click="toggleTag(tag)"
              >
                {{ tag }}
              </van-tag>
            </div>
            <div class="action-buttons">
              <van-button type="default" @click="showPopup = false">取消</van-button>
              <van-button type="primary" @click="onConfirm">确定</van-button>
            </div>
          </div>
        </van-popup>
<!--        -->
        <van-field v-model="editableUser.email" label="邮箱" type="email" />
        <van-field v-model="editableUser.phone" label="电话" type="tel" />
        <van-field  label="性别" >
          <template #input>
            <van-radio-group v-model="editableUser.gender" direction="horizontal">
              <van-radio :name="0">男</van-radio>
              <van-radio :name="1">女</van-radio>
              <van-radio :name="2">未知</van-radio>
<!--              <van-radio :name="3">其他</van-radio>-->
            </van-radio-group>
          </template>
        </van-field>

      </van-form>
      <template #footer>
        <div class="dialog-footer">
          <van-button type="default" @click="showEditDialog = false">取消</van-button>
          <van-button type="primary" @click="saveUserInfo">保存</van-button>
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {getCurrent, uploadImage,updateUser} from '../api/services';
import {closeToast, showFailToast, showLoadingToast, showToast} from "vant";
import introJs from 'intro.js'
const user = ref({});

const refreshing = ref(false);
const showEditDialog = ref(false);

const editableUser = reactive({});
//获取用户信息
const fetchUserInfo = async () => {
  showLoadingToast({
    duration: 0,
    message: '加载中...',
    forbidClick: true,
  });
  const userInfo = await getCurrent();
  user.value=userInfo
  if (userInfo) {
    closeToast();
    // console.log('获取用户信息成功:', userInfo);
    startIntro();
  } else {
    showFailToast('加载失败');
    console.log('获取用户信息失败');
  }
};
fetchUserInfo();

const editUserInfo = () => {
  Object.assign(editableUser, user.value);
  delete editableUser.createTime;
  showEditDialog.value = true;
};
const afterRead = async (file) => {
  // 保存文件信息，但不上传文件
  editableUser.avatarFile = file.file;
  // 创建一个 URL 指向用户选择的文件，以便预览
  editableUser.avatarUrl = URL.createObjectURL(file.file);
  console.log(file.file,editableUser.avatarUrl)
};
const onOversize = (file) => {
  console.log(file);
  showToast('文件大小不能超过 500kb');
};
//用户指引
function startIntro() {
  if (!user.value.username) {
    introJs().setOptions({
      nextLabel: '下一步',
      prevLabel: '上一步',
      skipLabel: '跳过',
      doneLabel: '完成',
    }).start();
  }
}

const saveUserInfo = async () => {
  // console.log({...editableUser},"editableUser")
  if (editableUser.avatarFile) {
    try {
      const response = await uploadImage(editableUser.avatarFile);
      if (response) {
        // 如果上传成功，更新 editableUser.avatarUrl
        editableUser.avatarUrl = response;
        // 在这里保存用户信息
        // 你可以调用API来保存用户信息
          const res = await updateUser({...editableUser});
          if (res.code===0){
            Object.assign(user.value, editableUser);
          }
      } else {
        console.error('上传失败:', response.message);
      }
    } catch (error) {
      console.error('上传错误:', error);
    }
  }
  showEditDialog.value = false;
};

//表签方法
const tagList = ref([]); // 标签列表
const showPopup = ref(false); // 控制 popup 的显示
const selectedTags = ref([]); // 用户选择的标签

// 模拟获取标签列表
const fetchTags = async () => {
  // 这里是模拟的标签列表
  const data = Array.from({ length: 100 }, (_, i) => `标签${i + 1}`);
  tagList.value = data;
};

// 处理用户选择的标签
const onConfirm = () => {
  editableUser.tags = selectedTags.value.join(', ');
  showPopup.value = false;
};

// 切换标签的选中状态
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

// 在组件创建时获取标签列表
onMounted(()=>{
  fetchTags()
});

</script>

<style scoped>
.user-profile {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
}

.bio {
  margin-top: 10px;
  font-size: 16px;
  color: #666;
  /*line-height: 1.5;*/
}

.user-content {
  width: 100%;
  padding-bottom: 18px;
}

.content-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.content-item {
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}


.popup-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
  flex-grow: 1;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 设置标签之间的间距 */
  overflow-x: auto; /* 当标签多的时候可以滑动 */

}

</style>
