<template>
	<view class="page">
		<uni-status-bar></uni-status-bar>
		<view class="header">
			<view class="input-view">
				<image style="width: 16px;height: 16px;" src="/static/img/search.png" mode="widthFix"></image>

				<input class="input" type="text" placeholder="搜索" @input="handleInput" :focus="true" />
			</view>
			<view class="" @click="toBack">
				<text>取消</text>
			</view>
		</view>
		<view class="search-main" v-if="keyword">
			<view class="search-main-errtitle" v-if="hasNoData">无搜索结果</view>
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="none" v-for="(item,index) of list" @tap="handleClick(item.id)"
					:key="index">
					<view class="uni-media-list">
						<view class="uni-media-list-logo">
							<image :src="staticPhoto + item.photo" :lazy-load="true"></image>
						</view>
						<view class="uni-media-list-body">
							<view class="uni-list-cell-navigate">{{item.nickname}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '../../components/uni-ui/uni-icon/uni-icon.vue';
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	import uniStatusBar from '@/components/uni-ui/uni-status-bar/uni-status-bar.vue'
	export default {
		components: {
			uniIcon,
			uniStatusBar
		},
		data() {
			return {
				is_type: 0,
				keyword: '',
				list: [],
				timer: null
			}
		},
		onShow() {
			_hook.routeSonHook();
		},
		computed: {
			hasNoData() {
				return !this.list.length;
			},
			staticPhoto() {
				return _data.staticPhoto();
			},
		},
		watch: {
			keyword(new_val, old_val) {
				let _this = this;
				if (_this.timer) {
					clearTimeout(_this.timer);
				}
				if (!new_val) {
					_this.list = [];
					return
				}
				_this.timer = setTimeout(() => {
					_this.$httpSend({
						path: '/im/get/searchUser',
						data: {
							val: new_val
						},
						success(data) {
							_this.list = data.data;
							_this.is_type = data.is_type;
						}
					});
				}, 100);
			}
		},
		methods: {
			toBack() {
				uni.navigateBack({

				})
			},
			handleInput(e) {
				this.keyword = e.detail.value
			},
			handleClick(id) {
				uni.navigateTo({
					url: ('../details/index?user_id=' + id + '&is_type=' + this.is_type),
				});
			}
		}
	}
</script>

<style>
	page {
		background: #fff;
	}

	.search-main {
		height: 100%;
		padding-bottom: 20upx;
		background-color: #fff;
		overflow: hidden;
	}

	.search-main-errtitle {
		width: 100%;
		height: 92upx;
		line-height: 92upx;
		font-size: 32upx;
		padding: 0 20upx;
		border-bottom: 1px solid #e5e5e5;
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
		background-color: #f7f7f7;
		height: 36px;
		border-radius: 18px;
		padding: 0 10px;
		flex: 1;
		margin-right: 10rpx;

	}

	.input {
		flex: 1;
		padding: 0 5px;
		height: 24px;
		line-height: 24px;
		font-size: 14px;
	}
</style>
