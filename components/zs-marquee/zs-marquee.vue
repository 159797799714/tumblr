<template>
	<view class="zs-marquee" :style="{'width':width}">
		<view class="zs-row zs-marquee-label">
			<view class="">
				<slot name="icon">
					<image class="icon" v-if="icon" :src="icon" :style="{'width':height,'height':height,'padding-top':vspace}"></image>
				</slot>
			</view>
			<view class="">
				<slot name="label">
					<text class="label" v-if="label">{{label}}</text>
				</slot>
			</view>
			<view class="zs-expaned">
				<view class="marquee" id="marquee" :style="{'lineHeight':height,'backgroundColor':bgcolor,'color':color,'paddingLeft':hspace,'paddingRight':hspace,'paddingTop':vspace,'paddingBottom':vspace}">
					<view class="marquee-box" :style="{height:height}">
						<view class="marquee-text" :style="{
							left:left+'px',
							top:top+'px',
							direction: (direction=='right'?'rtl':'ltr'),
							unicodeBidi: (direction=='right'?'bidi-override':'initial')
						}" id="marquee-text">
							<slot>{{lines[current]}}</slot>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"zs-marquee",
		props: {
			//左侧标签的图标
			icon:String,
			//左侧标签文字
			label:String,
			//设置滚动内容，不换行，当然，你可以在标签内定义
			title:{
				type:String,
				default:'跑马灯...\n第二个跑马灯'
			},
			//以像素或百分比值设置高度，默认18px
			height:{
				type:String,
				default:'18px'
			},
			//以像素或百分比值设置宽度，默认100%(不推荐)，小程序在使用时无法获取父级宽度，要设置宽度
			width:{
				type:String,
				default:'100%'
			},
			//设置文本在 marquee 元素内如何滚动。可选值有 scroll，slide 和 alternate。 如果未指定值，默认值为 scroll。
			// behavior:{
			// 	type:String,
			// 	default:'scroll'
			// },
			//文字颜色，默认黑色
			color:{
				type:String,
				default:'black'
			},
			//通过颜色名称或十六进制值设置背景颜色。
			bgcolor:{
				type:String,
				default:'transparent'
			},
			//设置 marquee 内文本滚动的方向。可选值有 left, right, up and down。如果未指定值，默认值为 left。
			direction:{
				type:String,
				default:'left'
			},
			//设置水平边距
			hspace:{
				type:String,
				default:'0'
			},
			//设置 marquee 滚动的次数。如果未指定值，默认值为 −1，表示 marquee 将连续滚动
			loop:{
				type:Number,
				default:-1
			},
			//设置每次滚动时移动的长度（以px像素为单位）。默认值为 6
			scrollamount:{
				type:Number,
				default:6
			},
			//设置每次滚动时的时间间隔（以ms毫秒为单位）。默认值为 85。请注意， 除非指定 truespeed 值，否则将忽略任何小于 60 的值，并改为使用 60
			scrolldelay:{
				type:Number,
				default:85
			},
			//默认情况下，会忽略小于60的scrolldelay值。如果存在truespeed，那些值不会被忽略
			truespeed:Number,
			//以像素或百分比值设置垂直边距
			vspace:{
				type:String,
				default:'0'
			}
		},
		watch: {
			title (n,o) {
				this.init();
			},
			direction (n,o) {
				this.init();
			}
		},
		methods: {
			//在页面显示状态时调用
			play(){
				this.start();
			},
			//开始滚动 marquee
			start(y){
				const { direction, scrolldelay, truespeed } = this;
				let time = Math.max(scrolldelay,60);
				if (truespeed) time = truespeed;
				let loop = this.loop;
				//当 marquee 开始滚动时触发
				this.$emit('onstart');
				if (this.timerId) clearInterval(this.timerId);
				let scrollamount = this.scrollamount;
				let lines = [this.text];
				switch(direction){
					case 'left'://文字方向向左
						this.left = 0;
						break;
					case 'right'://文字方向向右
						this.left = 0 - this._width;
						break;
					case 'up':
					case 'down':					
						this.left = 0;
						this.top = 0;
						scrollamount = Math.max(1,Math.round(this.scrollamount/5));
						break;
					default:
						this.$emit('onerror',{ errMsg: `${direction} 滚动功能暂未实现！` });
						return;
				}
				const scollLoop = () => {
					if (loop>0) {
						loop--;
						//当 marquee 完成 loop 属性设置的值时触发。它只能在 loop 属性设置为大于 0 的某个数字时触发
						if (loop<=0) {
							this.stop();
							return false;
						}
					}
					return true;
				};
				this.timerId = setInterval(()=>{
					switch(direction){
						case 'right':
							{
								if (this.left>=this.maxWidth) {
									if (!scollLoop()) return;
									this.left = 0 - this._width;
								}
								this.left+=scrollamount;
							}
							break;
						case 'left':
							{
								if (this._width+this.left<0) {
									if (!scollLoop()) return;
									this.left=this.maxWidth;
								}
								this.left-=scrollamount;
							}
							break;
						case 'up':
							{
								if (this._height<Math.abs(this.top)){
									this.top=this._height;
									if (!scollLoop()) return;
									if (this.current+1<this.lines.length){
										this.current++;
									}else{
										this.current=0;
									}
								}
								this.top-=scrollamount;
							}
							break;
						case 'down':
							{
								if (this._height<this.top){
									this.top=0-this._height;
									if (!scollLoop()) return;
									if (this.current+1<this.lines.length){
										this.current++;
									}else{
										this.current=0;
									}
								}
								this.top+=scrollamount;
								
								// console.log('test', this.top)
							}
							break;
						default:
					}
				},time);
			},
			//在页面隐藏状态时调用，不考虑性能的话，可以不管
			stop(){
				if (this.timerId>0) {
					clearInterval(this.timerId);
					this.timerId = 0;
					this.$emit('onstop');
				}
			},
			//初始化,修改内容时重新计算
			init(){
				this.lines = this.title.split('\n');
				this.$nextTick(()=>{
					uni.createSelectorQuery().in(this).select('#marquee-text').boundingClientRect((res)=>{
						if (res.width > 0 && res.width != this.maxWidth) {
							this._width = res.width;
							this._height = res.height;
							this.start(true);
							return;
						}
					}).exec();
				})
			}
		},
		data() {
			return {
				top: 0,
				_height: 18,
				_width: 0,
				left: 0,
				timerId: -1,
				maxWidth: 0,
				lines: [''],
				current: 0,
				style: {}
			};
		},
		mounted() {
			uni.createSelectorQuery().in(this).select('#marquee').boundingClientRect((res)=>{
				if (res.width<=0) {
					this.maxWidth = uni.getSystemInfoSync().windowWidth;
				}else{
					this.maxWidth = res.width;
				}
				this.init();
			}).exec();
		},
		beforeDestroy() {
			this.stop();
		}
	}
</script>

<style>
	.zs-marquee{
		width: 100%;
	}
	.marquee{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.marquee>.marquee-box{
		position: relative;
		overflow: hidden;
	}
	.marquee .marquee-text{
		position: absolute;
		display: inline-block;
		white-space: nowrap;
	}
	.zs-row{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.zs-row .zs-expaned{
		flex: 1;
	}
	.zs-marquee-label .icon{
		position: relative;
		top: -4rpx;
		margin: 0 10rpx;
	}
	.zs-marquee-label .label{
		margin-right: 10rpx;
	}
</style>
