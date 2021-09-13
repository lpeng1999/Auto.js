auto.waitFor()

getGold()

function getGold() {
	toastLog('开始快手刷金币')
	var count = 0
	var total = findGoldCount().total

	while (count <= total) {
		count = findGoldCount().count
		log('--------------- ' + count + ' ---------------')
		toastLog('已观看次数：' + count)

		textContains('金币').indexInParent(3).waitFor()
		clickUIObj(textContains('金币').indexInParent(3).findOne(10).parent())
		sleep(4000)

		if (text('知道了').findOne(10) || id('empty_btn').findOne(10)) {
			log('未找到')
			back()
			continue
		}

		if (text('点击重试').findOne(10)) {
			clickUIObj(text('点击重试').findOne(10))
		}

		if (
			textStartsWith('浏览详情页').findOne(10) ||
			id('video_end_action_button').findOne(10)
		) {
			back()
			clickUIObj(text('放弃奖励').findOne(10))
		}

		// 广告倒计时
		goldCounting()

		back()

		count++
		if (count >= total) {
			break
		}
	}

	toastLog('完成了快手刷金币，退出')
	exit()
}

/**
 * @description: 获取金币悬赏观看总数和已观看次数
 * @param {*}
 * @return {Object}  total总数 count已观看次数
 */
function findGoldCount() {
	textContains('金币').indexInParent(3).waitFor()
	var text = textContains('金币').indexInParent(3).findOne(10).text()
	var end = text.indexOf('/')

	return {
		total: Number(text.slice(end + 1)),
		count: Number(text.slice(end - 2, end)),
	}
}

/**
 * @description: 获取金币悬赏广告秒数
 * @param {*}
 * @return {Number} second 秒数
 */
function findGoldSecond() {
	textContains('s后可领取奖励').waitFor()
	var text = textContains('s后可领取奖励').findOne(10).text()
	var start = text.indexOf('s')

	return Number(text.slice(0, start))
}

/**
 * @description: 金币悬赏倒计时
 * @param {*}
 * @return {*}
 */
function goldCounting() {
	var second = (findGoldSecond() - 1) * 1000
	log('总秒数 ' + second / 1000)
	sleep(second)

	console.time('start')

	var close = false
	while (!close) {
		if (
			id('video_countdown').findOne(10) ||
			textContains('s后可领取奖励').findOne(10)
		) {
			close = false
			log('倒计时中')
			sleep(1000)
		} else if (
			id('video_close_icon').findOne(10) ||
			textContains('领取成功').findOne(10)
		) {
			close = true
			log('关闭视频')
		}
	}

	console.timeEnd('start')
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
