auto.waitFor()

getGold()

function getGold() {
	var count = 0
	toastLog('开始快手刷金币')
 
	while (count < findGoldCount().total - 1) {
		count = findGoldCount().count
		toastLog('已观看次数：' + count)

		textStartsWith('福利').waitFor()
		clickUIObj(textStartsWith('福利').findOne(10))
		sleep(4000)

		if (
			text('知道了').findOne(10) ||
			id('com.kuaishou.nebula:id/empty_btn').findOne(10)
		) {
			log('未找到')
			back()
			continue
		}

		if (
			text('资讯报名').findOne(10) ||
			textStartsWith('浏览详情页').findOne(10)
		) {
			clickUIObj(text('资讯报名').findOne(10))
		}

		var second = (findGoldSecond() - 1) * 1000
		log(second)
		sleep(second)

		console.time('start')

		// 广告倒计时
		var close = false
		while (!close) {
			if (textContains('s后可领取奖励').findOne(10)) {
				log('倒计时中')
				close = false
				sleep(1000)
			} else if (
				textContains('领取成功').findOne(10) ||
				id('com.kuaishou.nebula:id/video_close_icon').findOne(10)
			) {
				log('关闭视频')
				close = true
			}
		}

		console.timeEnd('start')
		toastLog('观看视频结束')
		back()
	}

	toastLog('完成了快手刷金币，退出')
	exit()
}

/**
 * @description: 获取金币观看总数和已观看次数
 * @param {*}
 * @return {Number}  total总数 count已观看次数
 */
function findGoldCount() {
	textStartsWith('每次100金币').waitFor()
	var text = textStartsWith('每次100金币').findOne(10).text()
	var start = text.lastIndexOf('币')
	var end = text.indexOf('/')

	var total = Number(text.slice(end + 1))
	var count = Number(text.slice(start + 1, end))

	return {
		total: total,
		count: count,
	}
}

/**
 * @description: 获取金币广告秒数
 * @param {*}
 * @return {Number} second
 */
function findGoldSecond() {
	textContains('s后可领取奖励').waitFor()
	var text = textContains('s后可领取奖励').findOne(10).text()
	var second = Number(text.slice(0, 2))

	return second
}

/**
 * @description: 判断UI对象(控件)是否存在并点击
 * @param {Object} obj 控件对象
 * @param {String} title 提示信息
 * @return {*}
 */
function clickUIObj(obj, title) {
	if (!obj) return log('未找到')

	if (title !== undefined) {
		log(title)
	}

	if (obj.clickable()) {
		obj.click()
	} else {
		var x = obj.bounds().centerX()
		var y = obj.bounds().centerY()
		click(x, y)
	}
}
