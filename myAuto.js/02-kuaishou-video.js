auto.waitFor()

getVideo()

function getVideo() {
	toastLog('开始快手刷直播')

	var count = findVideoCount().count
	var total = findVideoCount().total
	var w = device.width
	var h = device.height

	textContains('看直播').waitFor()
	clickUIObj(textContains('看直播').findOne(10).parent())

	while (count < total) {
		log('--------------- ' + count + ' ---------------')
		toastLog('已观看次数：' + count)
		sleep(4000)

		if (id('live_red_packet_container_close_view').findOne(10)) {
			clickUIObj(id('live_red_packet_container_close_view').findOne(10))
		}

		// 直播倒计时
		videoCounting()

		if (count >= 9) {
			break
		}

		// 切换视频
		swipe(w / 3, (h / 4) * 3, (w / 3) * 2, h / 4, 300)
		swipe(w / 3, (h / 4) * 3, (w / 3) * 2, h / 4, 300)
		sleep(1300)

		while (!id('award_count_down_text').findOne(10)) {
			swipe(w / 3, (h / 4) * 3, (w / 3) * 2, h / 4, 300)
			swipe(w / 3, (h / 4) * 3, (w / 3) * 2, h / 4, 300)
			sleep(1300)
		}
		count++
	}

	toastLog('完成了快手刷直播，退出')

	back()
	textContains('退出').waitFor()
	clickUIObj(textContains('退出').findOne(10))
	exit()
}

// 直播倒计时
function counting() {
	// id('award_count_down_text').waitFor()
	// var second = (findVideoSecond() - 2) * 1000
	// log(second)

	sleep(53000)

	console.time('start')

	var close = false
	while (!close) {
		// id('award_count_down_text').findOne(10)
		if (id('award_count_down_text').findOne(10)) {
			close = false
			log('倒计时中')
			sleep(1000)
		} else {
			close = true
			log('关闭视频')
		}
	}

	console.timeEnd('start')
}

/**
 * @description: 获取直播观看总次数和已观看次数
 * @param {*}
 * @return {Object}  total总次数 count已观看次数
 */
function findVideoCount() {
	textContains('直播').waitFor()
	var text = textContains('直播').findOne(10).parent().child(3).text()
	var end = text.indexOf('/')

	return {
		total: Number(text.slice(end + 1)),
		count: Number(text.slice(end - 2, end)),
	}
}

/**
 * @description: 获取直播秒数
 * @param {*}
 * @return {Number} second 秒数
 */
function findVideoSecond() {
	id('award_count_down_text').waitFor()
	var text = id('award_count_down_text').findOne(10).text()
	var start = text.indexOf(':')

	return Number(text.slice(0, start)) * 60 + Number(text.slice(start + 1))
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
