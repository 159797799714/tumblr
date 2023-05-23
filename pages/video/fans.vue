<template>
	<view class="">
		<view class="flex justify-between padding align-center border-bottom" v-for="(item,index) in list" :key="index">
			<view class="">
				<image class="cu-avatar round lg margin-right" :src="static_photo + item.user_info.face" mode="">
				</image>
				<text>{{item.user_info.nickname}}</text>
			</view>
			<button class="cu-btn bg-red" @click="toFlow(item.user_id)">关注</button>
		</view>
	</view>
</template>

<script>
	import _data from "@/common/_data";
	import _get from "@/common/_get";
	export default {
		data() {
			return {
				list: [],
				static_photo: _data.staticPhoto(),
				my_data: {}, //我
				page: 1,
			}
		},
		onShow() {
			let _this = this;
			_get.getUserInfo({});
			uni.$on('data_user_info', function(data) {
				data.photo = data.photo + '?_=' + +Math.random()
				data.photo = data.photo.replace(/(\?_=)[\d\.]+$/, '$1' + Math.random());
				_this.my_data = data;

				_data.data('user_info', data)
			});


			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			getList() {
				this.$httpSend({
					path: "/im/video.Share/me_follow",
					data: {
						type: "1", //粉丝
					},
					success: (data) => {
						console.log("data", data);
						if (data.data.length) {
							this.page++;
							this.list = [...this.list, ...data.data];
						}
					}
				})
			},
			toFlow(id) {
				this.$httpSend({
					path: "/im/video.Share/follow",
					data: {
						user_id: id,
					},
					success(data) {
						console.log("data", data);
						uni.showToast({
							icon: "none",
							title: data.msg,
						});
					},
				});
			}
		}
	}
</script>

<style scoped>
	@import '@/static/css/colorui/main.css';

	page {
		background: #fff;
	}

	.border-bottom {
		border-bottom: 1px solid #ddd;
	}
</style>
