<template>
	<view class="page">
		<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px'}">
			<view class="scrollList-top">
				<image src="/static/img/arrow-down.png" mode="" @click="closePop"></image>
				<text>选择提醒的人</text>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell">
					<uni-swipe-action>
						<view class="uni-media-list">
							<uni-search-bar ref="searchBar2" placeholder="搜索" :show="false" @confirm="search"
								@search="search" radius="4">
							</uni-search-bar>
						</view>
					</uni-swipe-action>
				</view>
			</view>
			<view class="uni-list">
				<view>
					<view class="uni-list-cell">
						<uni-swipe-action>
							<view class="uni-media-list" @tap="toChat({user_id:'all',name:'所有人'})">
								<view class="uni-media-list-logo">
									<image src="@/static/theme/default/friend/group.png" :lazy-load="true"
										style="border-radius: 10px;" />
								</view>
								<view class="uni-media-list-body">
									<view class="uni-list-cell-navigate">所有人</view>
								</view>
							</view>
						</uni-swipe-action>
					</view>
				</view>
				<view v-for="(list, key) in list_data" :key="key">
					<view class="uni-list-cell-divider" :id="list.letter">
						{{list.letter}}
					</view>
					<view class="uni-list-cell" hover-class="none"
						:class="list.data.length -1 == index ? 'uni-list-cell-last' : ''"
						v-for="(item,index) in list.data" :key="isKey(key,index)">
						<uni-swipe-action>
							<view class="uni-media-list" @tap="toChat(item)">
								<view class="uni-media-list-logo">
									<image :src="photo(item.photo+'')" :lazy-load="true" style="border-radius: 10px;" />
								</view>
								<view class="uni-media-list-body">
									<view class="uni-list-cell-navigate">{{item.name}}</view>
								</view>
							</view>
						</uni-swipe-action>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="uni-indexed-list-bar" :class="touchmove ? 'active' : ''" @touchstart="touchStart"
			@touchmove.stop.prevent="touchMove" @touchend="touchEnd" @touchcancel="touchCancel"
			:style="{height:winHeight + 'px',paddingTop:'10px'}">
			<text v-for="(item,index) in key_data" :key="index" class="uni-indexed-list-text"
				:class="touchmoveIndex == index ? 'active' : ''"
				:style="{height:itemHeight + 'px',lineHeight:itemHeight + 'px'}">
				{{item}}
			</text>
		</view>

		<view class="uni-indexed-list-alert" v-if="touchmove">
			{{key_data[touchmoveIndex]}}
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
	import uniSearchBar from '../../components/mehaotian-search/mehaotian-search.vue'

	export default {
		components: {
			uniIcon,
			uniList,
			uniListItem,
			uniSwipeAction,
			uniSearchBar
		},
		props: {
			list_id: ''
		},
		data() {
			return {
				list_data: [],
				new_friend_tips: 0,
				new_group_tips: 0,
				title: 'grid',
				touchmove: false,
				touchmoveIndex: -1,
				itemHeight: 200,
				winHeight: 0,
				scrollViewId: "A",
				titleHeight: 110,
				search_list: [],
				keyword: '',
				// list_id: '',
				key_data: ['↑', '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
					'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
				]
			}
		},
		onShow() {

		},
		mounted() {
			this.initData();
		},
		onHide() {
			//清空search框
			if (this.keyword) {
				this.$refs.searchBar2.clear();
				this.list_data = this.search_list;
			}
		},
		computed: {
			staticPhoto() {
				return _data.staticPhoto();
			},
		},
		methods: {
			initData() {
				_hook.routeTabBarHook();
				let _this = this;
				_get.getMemberList({
					list_id: this.list_id
				}, function(data) {
					console.log(data.data)
					_this.list_data = data.data;
					// todo 有用的letter
					let obj = _this.list_data;
					let arr = [];
					for (let key in obj) {
						arr.push(obj[key].letter);
					}
					_this.key_data = Array.from(new Set(arr));
					console.log("_this.key_data", _this.key_data);
					_this.search_list = data.data;
					let winHeight = uni.getSystemInfoSync().windowHeight - 100;
					// todo键盘弹起兼容手机H5
					// #ifdef H5
					winHeight = winHeight - 150;
					_this.titleHeight = _this.titleHeight + 150;
					// #endif
					_this.itemHeight = winHeight / _this.key_data.length;
					_this.winHeight = winHeight;
				});
			},
			closePop() {
				this.$emit("close");
			},
			search(keyword) {
				this.keyword = keyword.trim();
				let _this = this;
				if (!keyword) {
					_this.list_data = _this.search_list;
					return true;
				}
				_get.searchGroupFriends({
					'keyword': keyword,
					'list_id': _this.list_id
				}, function(data) {
					_this.list_data = data;
				})
			},
			photo(path) {
				return this.staticPhoto + path;
			},
			toChat(item) {
				console.log("item", item);
				uni.$emit('update_text_msg', {
					msg: item.name + ' ',
					user_id: item.user_id,
				})
				// uni.navigateBack()
			},
			isKey(key, index) {
				return key + '' + index;
			},
			touchStart(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				let item = this.key_data[index];
				if (item) {
					this.scrollViewId = item;
					this.touchmoveIndex = index;
				}
			},
			touchMove(e) {
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				let item = this.key_data[index];
				if (item) {
					this.scrollViewId = item;
					this.touchmoveIndex = index;
				}
			},
			touchEnd() {
				this.touchmove = false;
				//this.touchmoveIndex = -1;
			},
			touchCancel() {
				this.touchmove = false;
				//this.touchmoveIndex = -1;
			},
		},
		watch: {

		},
	}
</script>

<style scoped>
	.scrollList-top {
		position: relative;
		height: 80rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 0 20rpx;
	}

	.scrollList-top text {
		position: absolute;
		left: 50%;
		top: 50%;
		font-size: 32rpx;
		transform: translate(-50%, -50%);
	}

	.scrollList-top image {
		width: 40rpx;
		height: 40rpx;
	}

	.uni-list-cell-divider {
		background-color: #f1f1f1;
		box-sizing: border-box;
		padding-left: 22px;
	}

	.page {
		display: flex;
		flex-direction: row;
		flex: 1;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;
		position: relative;
	}

	.search .content {
		padding-left: 20upx;
		height: 60upx;
	}

	.scrollList {
		flex: 1;
		height: 100%;
	}

	.uni-indexed-list-bar {
		width: 40upx;
		height: 100vh;
		background-color: transparent;
		display: flex;
		flex-direction: column;
		position: absolute;
		right: 0;
		top: 0;
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
		/* width: 710upx !important; */
		width: 100vw;
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

	.title-info {
		padding: 0 15px;
	}
</style>
