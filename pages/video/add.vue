<template>
	<view class="">
		<view class="container">
			<view class="flex margin ">
				<view >
					<view v-if="!cover" @click="upload" class="add-icon flex justify-center align-center bg-gray">
						<text>添加视频</text>
					</view>
					<view v-if="cover" class="add-icon flex justify-center align-center bg-gray">
						<img mode="aspectFill" class="image-width" :src="static_url + cover" alt="">
						<text @click="delVideo" class="cuIcon-deletefill close-icon"></text>
					</view>
				</view>
				<view class="">
					<view class="margin-sm">
						<picker @change="bindPickerChange" range-key="name" :value="index" :range="cate_list">
							<view class="">视频类型：{{cate_list[index].name}}</view>
						</picker>
					</view>
					
					<textarea class="padding-left padding-right text-style flex-sub h240" v-model="title" placeholder="请添加作品描述" cols="30" rows="10"></textarea>
				</view>
				
			</view>
			<button class="cu-btn flex-sub bg-red margin block shadow shadow-blur shadow-lg" @click="publish">
				<text class="cuIcon-upload margin-right-sm"></text>
				<text class="text-df">发布视频</text>
			</button>
		</view>
		
	</view>
</template>
<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	export default {
		data() {
			return {
				video: '', //视频
				cover: '', //封面
				title: '', //标题
				static_url: '', //静态资源地址
				loading: false, //上传中
				
				cate_list:[],
				index:0
				
			}
		},
		components: {
			uniIcons
		},
		mounted() {
			this.static_url = getApp().globalData.static_url;
			this.getCate();
		},
		methods: {
			bindPickerChange(e){
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},
			// 获取分类
			getCate(){
				this.$httpSend({
					path: '/im/video.Share/category',
					success: (data) => {
						console.log("data", data);
						this.cate_list = data;
					}
				})
			},
			upload() {
				uni.chooseVideo({
					success: (res) => {
						console.log("res", res);
						this.$httpSendFile({
							local_url: res.tempFilePath,
							type: 6,
							success: (data) => {
								console.log("data", data);
								this.cover = data.save_gif_path;
								this.video = data.save_name;
							},
						});
					}
				})
			},
			publish() {
				if (!this.video || !this.cover) {
					uni.showToast({
						icon: 'none',
						title: '请添加视频'
					})
					return
				}
				if (!this.title) {
					uni.showToast({
						icon: 'none',
						title: '请添加作品描述'
					})
					return
				}
				if (!this.loading) {
					this.submit();
				} else {
					uni.showToast({
						icon: 'none',
						title: '上传中'
					})
				}
			},
			submit() {
				this.loading = true;
				this.$httpSend({
					path: '/im/video.Share/release',
					data: {
						title: this.title,
						gif: this.cover,
						video: this.video,
						category_id:this.cate_list[this.index].id,
					},
					success: (data) => {
						console.log("data", data);
						this.loading = false;
						uni.showToast({
							icon: 'none',
							title: '发布成功',
						})
					}
				})
			},
			delVideo() {
				this.video = '';
				this.cover = '';
			}
		}
	}
</script>
<style scoped>
	@import '@/static/css/colorui/main.css';
	@import '@/static/css/colorui/icon.css';

	page {
		background: #fff;
		font-size: 40rpx;
	}

	.text-style {
		font-style: italic;
		height: 80rpx;
	}
	.h240{
		height: 240rpx;
	}
	.add-icon {
		width: 240rpx;
		height: 240rpx;
		background: #eeeeee;
		border-radius: 10px;
		position: relative;
		overflow: hidden;
	}

	.image-width {
		width: 100%;
		height: auto;
	}

	.close-icon {
		position: absolute;
		right: 10rpx;
		top: 0;
		font-size: 50rpx;
		z-index: 1;
		color: #fff;
	}

	.cu-btn {
		height: 80rpx;
	}
</style>
