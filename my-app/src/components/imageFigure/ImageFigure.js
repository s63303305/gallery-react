import React, {
	Component
} from 'react';

export default class imageFigure extends React.Component {

	constructor() {
		super();
		this.state = {
			imgsArrangeArr: []
		};
	}
	/*
	 * 点击图片回调函数
	 */
	handleClick(index, isCenter) {
		if(isCenter) {
			this.inverse(index);
		} else {
			this.center(index);
		}
	}

	render() {
		//		接受数据
		const imageDatas = this.props.imageArr;

		//		循环造出图片item
		const imageArr = imageDatas.map((item, index) => {
			var imgsItem = this.state.imgsArrangeArr;
			//初始化数据
			if(!imgsItem[index]) {
				imgsItem[index] = {
					pos: {
						left: 0,
						top: 0,
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				};
			}

			let itemClassName = imgsItem[index].isCenter ? (imgsItem[index].isInverse ? "image-item active isInverse" : "image-item active") : 'image-item';
			
			let imgsItemSty = {
				left : imgsItem[index].pos.left,
				top : imgsItem[index].pos.top
			}
			
			//如果是居中的图片则不进行添加翻转
			if(!imgsItem[index].isCenter){
				imgsItemSty.transform = 'rotate(' + imgsItem[index].rotate + 'deg)';		
			}
			
			return(
				<figure  onClick={()=>{this.handleClick(index,imgsItem[index].isCenter);}}  className={itemClassName} key={index} ref="iamgeItem" style={imgsItemSty}>
					<img src={require("../../images/" + item.fileName)}  alt={item.title} />
					<h2>{item.title}</h2>
					<div className="img-back">
                      	<p>{item.desc}</p>
                   	</div>
				</figure>
			);
		});

		// 循环造出导航按钮
		const navArr = imageDatas.map((item, index) => {
			var imgsItem = this.state.imgsArrangeArr;
			return(
				<span onClick={()=>{this.handleClick(index,imgsItem[index].isCenter);}} key={index} className={imgsItem[index].isCenter ? "active" : ""}>{index + 1}</span>
			);
		})

		return <div className='stage' ref='stage'>{imageArr}<nav className="controller-nav">{navArr}</nav></div>;
	}
	componentDidMount() {
		let stageDom = this.refs.stage, //舞台dom
			stageW = stageDom.scrollWidth, //舞台dom宽度
			stageH = stageDom.scrollHeight, //舞台dom高度
			halfStageW = Math.floor(stageW / 2),
			halfStageH = Math.floor(stageH / 2);
		let imgDom = this.refs.iamgeItem, //舞台iamge的dom
			imgW = imgDom.scrollWidth, //舞台iamge宽度
			imgH = imgDom.scrollHeight, //舞台iamge高度
			halfImgW = Math.floor(imgW / 2),
			halfImgH = Math.floor(imgH / 2);

		this.stageBox = {
			centerPos: { //中心图片
				left: halfStageW - halfImgW,
				top: halfStageH - halfImgH
			},
			hPosRange: { // 水平方向的取值范围
				leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
				rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
				y: [-halfImgH, stageH - halfImgH]
			},
			vPosRange: { // 垂直方向的取值范围
				x: [halfStageW - imgW, halfStageW],
				y: [-halfImgH, halfStageH - halfImgH * 3]
			}
		}
		this.changeCenter(0);
	}

	/*
	 * 改变中心点
	 * @parameter	index: 填入图片所在数组的下标，指定第n个图片为中心图片c
	 */
	changeCenter(index) {
		let imgsArrangeArr = this.state.imgsArrangeArr, //获取初始数组
			stageBox = this.stageBox;

		let centerImg = imgsArrangeArr.splice(index, 1);
		centerImg = { //指定第index个为中心图片
			pos: {
				left: stageBox.centerPos.left,
				top: stageBox.centerPos.top
			},
			isCenter: true,
			isInverse: false,
			rotate: 0
		}

		//随机生成0-2个 舞台上侧图片
		let topImg = Math.ceil(Math.random() * 2),
			topImgIndex = [],
			topItems = [];

		//随机生成0-2个图片的Index
		for(let i = 0; i < topImg; i++) {
			let index = Math.floor(Math.random() * (imgsArrangeArr.length - 1));
			if(topImgIndex[0] != index) {
				topImgIndex.push(index);
			}
		}
		//中间上侧随机产生图片生成
		topImgIndex.forEach((item, index) => {
			imgsArrangeArr.splice(topImgIndex[index], 1); //先剔除掉数据
			topItems[index] = {
				pos: {
					left: this.getRandomPos(stageBox.vPosRange.x[0], stageBox.vPosRange.x[1]),
					top: this.getRandomPos(stageBox.vPosRange.y[0], stageBox.vPosRange.y[1])
				},
				rotate: this.get30DegRandom(),
				isCenter: false,
				isInverse: false
			}
		})

		//中间图片生成，分成一半随机左右两侧分布
		for(let i = 0, j = imgsArrangeArr.length / 2; i < imgsArrangeArr.length; i++) {
			let side;
			if(i < j) {
				side = stageBox.hPosRange.leftSecX;
			} else {
				side = stageBox.hPosRange.rightSecX;
			}
			imgsArrangeArr[i] = {
				pos: {
					left: this.getRandomPos(side[0], side[1]),
					top: this.getRandomPos(stageBox.hPosRange.y[0], stageBox.hPosRange.y[1])
				},
				rotate: this.get30DegRandom(),
				isCenter: false,
				isInverse: false
			}
		}

		//将上侧图片添加进数组
		topImgIndex.forEach((item, index) => {
			imgsArrangeArr.splice(topImgIndex[index], 0, topItems[index]);
		})

		//将中心图片添加进数组
		imgsArrangeArr.splice(index, 0, centerImg);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	}

	/*
	 * 返回随机生成数
	 */
	getRandomPos(min, max) {
		return(Math.random() * (max - min) + min);
	}

	/*
	 * 获取 0~30° 之间的一个任意正负值
	 */
	get30DegRandom() {
		return((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
	}
	/*
	 * 变换居中
	 */
	center(index) {
		this.changeCenter(index);
	}
	/*
	 * 变换翻转
	 */
	inverse(index) {
		let data = this.state.imgsArrangeArr;
		data[index].isInverse = !data[index].isInverse;
		this.setState({
			data
		})
	}
}