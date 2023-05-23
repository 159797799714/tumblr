<template>
	<view>
		<view class="flex">
			<view class="list-item add-btn" >
				<uni-icons type="plus-filled" size="30" color="#333" @click="addVideo"></uni-icons>
			</view>
			<swiper class="swiper-container"  :autoplay="false" :duration="1000" display-multiple-items="5">
				<swiper-item v-for="(item,index) in cate_list" :key="index" @click="changeItem(item,index)">
					<view class="list-item">
						<text :class="{active:active_index == index}">{{item.name}}</text>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<scroll-view class="video-list" :style="{height:scrollHeight+'px',width:sys.windowWidth+'px'}" scroll-x="false" scroll-y="true" @scrolltolower="getVideoList">
			<view class="video-item" v-for="(item,index) in videoList" :key="index" @click="toDetail(item.id)">
				<image :src="static_url+item.gif" mode="aspectFill"></image>
				<view class="cover">
					<view class="flex align-center">
						<image @click.stop="handleUser(item.user_id)" :src="static_photo+item.user_info.face" class="avatar" alt="头像">
						<text class="text-white margin-left-sm name">{{item.user_info.username}}</text>
					</view>
					<view class="flex align-center" @click.stop="handleLike(item)">
						<text :class="{ 'text-red': item.is_fabulous == 1 }"
							class="icon text-xxl">&#xe635;</text>
						<text class="text-white margin-left-xs text-min">{{ item.fabulous }}</text>
					</view>
				</view>
			</view>
			<view class="nomore" v-if="videoList.length == 0">
				<image src="../../static/theme/default/nomore.png" mode="widthFix"></image>
				<text>没有更多了。。</text>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import _mixins from '@/common/_mixins';
import _data from "@/common/_data";
import uniIcons from '@/components/uni-icons/uni-icons.vue'
import uniLoadMore from '@/components/uni-ui/uni-load-more/uni-load-more.vue'
import uniStatusBar from '@/components/uni-ui/uni-status-bar/uni-status-bar.vue'
export default{
	data(){
		return{
			cate_list:[],
			active_index:0,
			videoList:[],//视频列表
			current_page:1,
			
			scrollHeight:'',
			sys:{},//系统高度
			static_url:'',
			static_photo:'',
		}
	},
	components:{
		uniIcons,
		uniLoadMore,
		uniStatusBar
	},
	mounted() {
		const sys = uni.getSystemInfoSync();
		this.sys = {
			windowWidth: sys.windowWidth,
			windowHeight: sys.windowHeight,
			status:sys.statusBarHeight
		};
		console.log("this.sys",this.sys);
		this.scrollHeight = this.sys.windowHeight - 50;
		this.static_url = getApp().globalData.static_url;
		this.static_photo =  _data.staticPhoto();
		this.getCate();
	},
	methods:{
		// 获取分类
		getCate(){
			this.$httpSend({
				path: '/im/video.Share/category',
				success: (data) => {
					console.log("data", data);
					this.cate_list = data;
					this.getVideoList();
				}
			})
		},
		addVideo(){
			uni.navigateTo({
				url:'./add?type=video',
			});
		},
		toDetail(id) {
			uni.navigateTo({
				url: './detail?id=' + id,
			})
		},
		handleUser(user_no) {
			uni.navigateTo({
				url: `/pages/video/user?id=${user_no}`,
			});
		},
		async handleLike(item) {
			_mixins.methods.$httpSend({
				path: "/im/video.Share/fabulous",
				data: {
					id: item.id,
				},
				success: (data) => {
					if (data.code == 0) {
						item.is_fabulous = !item.is_fabulous;
						if (item.is_fabulous) {
							item.fabulous++;
						} else {
							item.fabulous--;
						}
					} else {
						uni.showToast({
							icon: "none",
							title: data.msg,
						});
					}
				},
			});
		},
		changeItem(e,index){
			this.active_index = index;
			this.current_page = 1;
			this.videoList = [];
			this.getVideoList();
		},
		getVideoList(){
			_mixins.methods.$httpSend({
				path: "/im/video.Share/video_lists",
				data: {
					type: this.cate_list[this.active_index]?this.cate_list[this.active_index].id:'',
					page:this.current_page
				},
				success: (data) => {
					this.last_page = data.last_page;
					if (this.current_page <= data.last_page) {
						this.current_page++;
						this.videoList = this.videoList.concat(data.data);
					}
					// console.log("this.videoList", this.videoList);
				},
				fail: (err) => {
					console.log("err", err);
				}
			});
		}
	}
}
</script>
<style lang="scss" scoped>
@import '@/static/css/common.css';
.nomore{
	width: 200rpx;
	margin: 100rpx auto;
	image{
		width: 100%;
		height: auto;
	}
}
.swiper-container{
	height: 100rpx;
	background: #ffffff;
	flex: 1;
}
.scroll{
	white-space: nowrap;
	background: #ffffff;
}
.list-item{
	display: inline-block;
	width: 160rpx;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	text{
		color: #213547;
	}
}
.list-item .active{
	font-weight: bold;
}
.add-btn{
	display: inline-block;
	width: 100rpx;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	background: #fff;
}
.video-list{
	
}
.video-item{
	display: inline-block;
	width: 48%;
	height: 500rpx;
	border-radius: 10rpx;
	overflow: hidden;
	margin: 1%;
	position: relative;
	image{
		width: 100%;
		height: 100%;
		background-color: grey;
	}
	.cover{
		bottom: 0;
		height: 120rpx;
		position: absolute;
		left:0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 10rpx;
		.avatar{
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
		.name{
			width:100rpx;//固定宽度
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
	}
}
</style>