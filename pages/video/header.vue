<template>
	<!-- 导航条 -->
	<view class="position-top-center" :style="{ height: height + 'px',width: width + 'px', }">
		<view class="
        header-bar
        padding-lr-bj
        justify-between
      " :style="{
        height: height + 'px',
		width: width + 'px',
        paddingTop: top + 'px',
        backgroundColor:'transparent',
      }">
			<view class="flex  flex-row align-center">
				<view>
					<view class="text-xxxl padding-left padding-right">
						<uni-icons type="videocam" size="30" color="#fff" @tap="handleRelease"></uni-icons>
					</view>
				</view>
				<view v-for="(item, index) in currentList" :key="index"
					class="header-tag position-relative align-center justify-center" @tap="onChange(item.type)">
					<text class="text-34 text-white-7"
						:class="{ active: currentItemId === item.type }">{{ item.name }}</text>
					<view v-if="currentItemId === item.type" class="header-tag-active"></view>
				</view>
				<view class="flex-user">
					<view class="text-xxxl margin-right-sm">
						<uni-icons type="person" size="30" color="#fff" @tap="toUser"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import _data from '@/common/_data.js'
	import _get from '@/common/_get';
	export default {
		props: {
			navColor: {
				type: String,
				default: "#fd4705",
			},
			currentItemId: {
				type: String,
				default: "",
			},
			currentList: {
				type: Array,
				default () {
					return [];
				},
			},
			height: {
				type: Number,
				default: 0,
			},
			top: {
				type: Number,
				default: 0,
			},
			width: {
				type: Number,
				default: 0,
			}
		},
		components: {
			uniIcons,
		},
		data() {
			return {
				my_data: {}
			}
		},
		mounted() {
			let _this = this;
			_get.getUserInfo({});
			uni.$on('data_user_info', function(data) {
				data.photo = data.photo + '?_=' + +Math.random()
				data.photo = data.photo.replace(/(\?_=)[\d\.]+$/, '$1' + Math.random());
				_this.my_data = data;

				_data.data('user_info', data)
			});
		},
		methods: {
			onChange(e) {
				this.$emit("onChange", e);
			},
			// 点击发布
			handleRelease() {
				console.log("发布")
				let itemList = ["发布短视频"];
				let url = ["./add?type=video"];
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						uni.navigateTo({
							url: url[res.tapIndex],
						});
					},
				});
			},
			toUser() {
				uni.navigateTo({
					url: "./user?id=" + this.my_data.id
				})
			},
		},
	};
</script>

<style scoped>
	@import "@/static/css/common.css";

	.flex-user {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.header-icon-tag {
		position: absolute;
		right: -8rpx;
		top: -4rpx;
		width: 16rpx;
		height: 16rpx;
		border-radius: 2000%;
		background-color: red;
	}

	.flex-row {
		flex-direction: row;
	}

	.header-bar {
		display: flex;
		flex-direction: row;
	}

	.header-tag {
		height: 71rpx;
		width: 110rpx;
	}

	.header-tag-active {
		position: absolute;
		bottom: 0;
		background-color: #fff;
		width: 22rpx;
		height: 4rpx;
		border-radius: 200rpx;
	}

	.active {
		font-weight: bold;
		color: #fff;
	}
</style>
