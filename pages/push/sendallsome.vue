<template>
  <view class="page">
	<view class="checkall" @click="checkall()">全选</view>
	<!-- <view class="recurrence" @click="goPath('../push/circle')"><返回</view> -->
    <scroll-view class="scrollList"
                 scroll-y
                 :scroll-into-view="scrollViewId"
                 :style="{height:winHeight + 'px'}">
      <uni-search-bar ref="searchBar2"
                      placeholder="搜索好友"
                      :show="false"
                      @confirm="search"
                      @search="search"></uni-search-bar>
      <view class="uni-list">

        <block>
          <view class="header"
                v-if="0">
            <navigator :url="'phone-search'"
                       hover-class="none"
                       class="input-view">
              <uni-icon type="search"
                        size="22"
                        color="#666666"></uni-icon>
              <input class="input"
                     type="text"
                     placeholder="搜索我的朋友"
                     :disabled="true" />
            </navigator>
          </view>

          <uni-list>
            <uni-list-item title="标签"
                           :show-arrow="false"
                           thumb="../../static/theme/default/friend/label.png"
                           @click="goPath('')"
                           v-if="0" />
            <uni-list-item title="小程序"
                           :show-arrow="false"
                           thumb="../../static/theme/default/friend/program.png"
                           @click="goPath('')"
                           v-if="0" />
          </uni-list>
        </block>
		<checkbox-group @change="checkboxGroupChange">
        <block v-for="(list, key) in list_data"
               :key="key">
          <view class="uni-list-cell-divider"
                :id="list.letter">
            {{list.letter}}
          </view>
		  
          <view class="uni-list-cell"
                hover-class="none"
                :class="list.data.length -1 == index ? 'uni-list-cell-last' : ''"
                v-for="(item,index) in list.data"
                :key="isKey(key,index)">
				<uni-data-checkbox v-model="value"/>
            <uni-swipe-action :options="[ {text: '备注'} ]"
                              @tap="swipeAction(item.user_id + '')">
              <view class="uni-media-list"
                    >
					<label style="display: flex;flex-direction: row;font-size: 28upx;">
								<checkbox :checked="item.checked" :value="item.list_id+''"/>
						</label>
                <view class="uni-media-list-logo">
					
                  <image :src="photo(item.photo+'')"
                         :lazy-load="true"
                         style="border-radius: 10px;" />
                </view>
                <view class="uni-media-list-body">
                  <view class="uni-list-cell-navigate">{{item.name}}</view>
                </view>
              </view>
            </uni-swipe-action>
          </view>
        </block>
		</checkbox-group>
      </view>
    </scroll-view>

    <view class="uni-indexed-list-bar"
          :class="touchmove ? 'active' : ''"
          @touchstart="touchStart"
          @touchmove.stop.prevent="touchMove"
          @touchend="touchEnd"
          @touchcancel="touchCancel"
          :style="{height:winHeight + 'px'}">
      <text v-for="(list,key) in key_data"
            :key="key"
            class="uni-indexed-list-text"
            :class="touchmoveIndex == key ? 'active' : ''"
            :style="{height:itemHeight + 'px',lineHeight:itemHeight + 'px'}">
        {{list}}
      </text>
    </view>

    <view class="uni-indexed-list-alert"
          v-if="touchmove">
      {{key_data[touchmoveIndex]}}
    </view>
	<view class="found-list">
	<view class="new-built" @click="zhuan()">转发 <text v-if="checkNum>0">({{checkNum}})</text></view>
	</view>
	
  </view>
  
	
	
</template>

<script>

import uniIcon from '../../components/uni-ui/uni-icon/uni-icon.vue';
import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
import uniSwipeAction from '../../components/uni-ui/uni-swipe-action/uni-swipe-action.vue'
import _get from '../../common/_get';
import _hook from '../../common/_hook';
import _data from '../../common/_data';
import _action from '../../common/_action';
import uniSearchBar from '@/components/mehaotian-search/mehaotian-search.vue'

export default {
  components: {
    uniIcon,
    uniList,
    uniListItem,
    uniSwipeAction,
    uniSearchBar
  },
  data () {
    return {
		ids:[],
		type:'',
		content:null,
      list_data: [],
      new_friend_tips: 0,
      new_group_tips: 0,
      title: 'grid',
      touchmove: false,
      touchmoveIndex: -1,
      itemHeight: 0,
      winHeight: 0,
      scrollViewId: "A",
      titleHeight: 0,
      search_list: [],
      keyword: '',
      key_data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
	  checkNum:0
    }
  },
  onShow() {
    _hook.routeTabBarHook();
    let _this = this,
      frien_list = _data.localData('frien_list'),
      tips_num = _data.data('new_friend_tips_num'),
      tips_group_apply = _data.data('new_group_tips_num');

    /** 监听最新数据 */
    uni.$on('data_friend_list', function (data) {
      _this.list_data = data;
      _this.search_list = data;
    });
    /** 监听新的朋友提示 */
    uni.$on('data_new_friend_tips', function (data) {
      _this.new_friend_tips = data;
      console.log(_this.new_friend_tips);
    });
    /** 监听群认证消息 */
    uni.$on('data_new_group_apply_tips', function (data) {
      _this.new_group_tips = data;
    });

    _this.new_friend_tips = tips_num;
    _this.new_group_tips = tips_group_apply;

    /** 加载本地缓存数据，让页面秒速渲染出来 */
    if (frien_list) {
      _this.list_data = frien_list;
    } else {
      _get.getFriendList();
    }
  },
  onLoad (option) {
	  this.type = option.type;
	  this.content = option.content;
	  console.log(this.content);
    let winHeight = uni.getSystemInfoSync().windowHeight;
    this.itemHeight = winHeight / 26;
    console.log(winHeight)
    this.winHeight = winHeight;
  },
  onHide () {
    uni.$off('data_friend_list');
    uni.$off('data_new_friend_tips');
    uni.$off('data_new_group_apply_tips');
    //清空search框
    if (this.keyword) {
      this.$refs.searchBar2.clear();
      this.list_data = this.search_list;
    }
  },
  computed: {
    staticPhoto () {
      return _data.staticPhoto();
    },
  },
  methods: {
	  onmsg(){
		  
	  },
	  checkall(){
		  var that = this
		  console.log(this.list_data)
		  // Object.keys(this.list_data).forEach(function(key){
				// 	 this.list_data[key].data.map((res,index)=>{
				// 		 this.list_data[key].data[index].checked = true
				// 	 })
				// })
				var ids = [];
			for(var i in this.list_data){
				console.log(this.list_data[i]);
				if(this.list_data[i].data){
					for(var j in this.list_data[i]['data']){
						this.list_data[i]['data'][j].checked = true;
						ids.push(this.list_data[i]['data'][j].list_id);
					}
				}
			}
			this.ids = ids;
			this.checkNum = this.ids.length;
	  },
	  zhuan(){
		if(this.ids.length > 0){
			let msgs = uni.getStorageSync('data_msg');
			msgs = JSON.parse(msgs);
			for (let msg of msgs.msg_id) {
				let type = msg.type;
				let content = msg.content;
				console.log('msgs:', msgs, this.ids);
				this.$httpSend({
				  path: '/im/message/textMsgs',
				  data: {
				    list_ids: this.ids,
				    content_type: type,
				    content: JSON.stringify(content),
				  },
				  success_action: true,
				  success (res) {
						uni.navigateBack({
							delta:1
						});
						return;
					}
				});
			}
			
			uni.showToast({
				title:'转发成功',
				icon:'none',
				ducation:2000,
			});
			
			// this.$httpSend({
			//   path: '/im/message/textMsgs',
			//   data: {
			//     list_ids: this.ids,
			//     content_type: this.type,
			//     content: this.content,
			//   },
			//   success_action: true,
			//   success (res) {
			// 		uni.showToast({
			// 			title:'转发成功',
			// 			icon:'none',
			// 			ducation:2000,
			// 		});
			// 		uni.navigateBack({
			// 			delta:1
			// 		});
			// 		return;
			// 	}
			// });
		}
	  },
	  goPath(path){
	      if(path && this.ids.length > 0){
	          uni.navigateTo({
	              url: path+'?ids='+this.ids.join(',')
	          });
	      }
	  },
	  checkboxGroupChange(e){
		  console.log(e.detail.value)
		  this.ids = e.detail.value;
		  this.checkNum = e.detail.value.length
	  },
    search (keyword) {
      this.keyword = keyword.trim();
      let _this = this;
      if (!keyword) {
        console.log(1111)
        console.log(_this.search_list)
        _this.list_data = _this.search_list;
        return true;
      }
      _get.searchFriends({ 'keyword': keyword }, function (data) {
        _this.list_data = data.data;
      })
    },
    photo (path) {
      return this.staticPhoto + path;
    },
    swipeAction (user_id) {
      uni.navigateTo({
        url: './remarks?user_id=' + user_id,
        animationType: 'slide-in-bottom',
      });
    },
    goDetails (user_id) {
      if (user_id) {
        uni.navigateTo({
          url: '../details/index?user_id=' + user_id,
        });
      }
    },
    isKey (key, index) {
      return key + '' + index;
    },
    touchStart (e) {
      this.touchmove = true;
      let pageY = e.touches[0].pageY;
      let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
      console.log("index", index)
      let item = this.list_data[index];
      console.log("list_data", this.list_data)
      console.log("item", item)
      if (item) {
        this.scrollViewId = item.letter;
      }

      this.touchmoveIndex = index;
    },
    touchMove (e) {
      let pageY = e.touches[0].pageY;
      let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
      let item = this.list_data[index];
      if (item) {
        this.scrollViewId = item.letter;
        this.touchmoveIndex = index;
      }
    },
    touchEnd () {
      this.touchmove = false;
      //this.touchmoveIndex = -1;
    },
    touchCancel () {
      this.touchmove = false;
      //this.touchmoveIndex = -1;
    },
  },
  watch: {

  },
  onNavigationBarButtonTap (e) {
    let _path = e.index ? './phone-search' : './add';
    uni.navigateTo({
      url: _path,
    });
  }
}
</script>

<style scoped>
	.checkall{
		position: absolute;
		bottom: 100rpx;
		right: 50rpx;
		z-index: 999999999;
		width: 80rpx;
		height: 80rpx;
		background-color: #00B26A;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		border-radius: 50%;
	}
.page {
  display: flex;
  flex-direction: row;
}
.search .content {
  padding-left: 20upx;
  height: 60upx;
}
.scrollList {
  flex: 1;
  height: 100vh;
}

.uni-indexed-list-bar {
  width: 40upx;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.uni-indexed-list-bar.active {
  /* background-color: rgb(200, 200, 200); */
}

.uni-indexed-list-text {
  font-size: 22upx;
  text-align: center;
}

.uni-indexed-list-bar.active .uni-indexed-list-text {
  color: #333;
}

.uni-indexed-list-text.active,
.uni-indexed-list-bar.active .uni-indexed-list-text.active {
  color: #02b300;
}

.uni-indexed-list-alert {
  position: absolute;
  z-index: 20;
  width: 160upx;
  height: 160upx;
  left: 50%;
  top: 50%;
  margin-left: -80upx;
  margin-top: -80upx;
  border-radius: 80upx;
  text-align: center;
  line-height: 160upx;
  font-size: 70upx;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
}

.header {
  display: flex;
  flex-direction: row;
  padding: 10px 15px;
  align-items: center;
}

.input-view {
  display: flex;
  align-items: center;
  flex-direction: row;
  background-color: #e7e7e7;
  height: 30px;
  border-radius: 5px;
  padding: 0 10px;
  flex: 1;
}

.input {
  flex: 1;
  padding: 0 5px;
  height: 24px;
  line-height: 24px;
  font-size: 16px;
}

.uni-list-cell-navigate {
  padding: 0;
}

.uni-media-list-body {
  height: auto;
}
.uni-media-list image {
  border-radius: 10px;
}

.uni-swipe-action {
  width: 710upx !important;
}
.btm_border {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.btm_border::after {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 0;
  left: 115upx;
  height: 1px;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #e7e6ef;
}
.img-icon {
  width: 85upx;
  height: 85upx;
  border-radius: 10upx;
}
.uni-media-list-logo {
  height: 85upx;
  width: 85upx;
  margin-right: 20upx;
}
.red_num {
  background-color: #f43530;
  width: 35upx;
  border-radius: 18upx;
  text-align: center;
  height: 35upx;
  line-height: 35upx;
  color: #ffffff;
  font-size: 23upx !important;
}
.found-list{
	width: 230px;
	height: 40px;
	background: red;
	position: absolute;
	bottom: 50px;
	right: 90px;
	border-radius: 20px;
	/* z-index: 999999999; */
}
.new-built{
	text-align: center;
	line-height: 40px;
}
</style>