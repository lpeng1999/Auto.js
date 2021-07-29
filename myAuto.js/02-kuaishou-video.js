auto.waitFor()

getVideo()

function getVideo() {
	toastLog('开始快手刷直播')

	var count = findVideoCount().count
	var total = findVideoCount().total

	textStartsWith('看直播').waitFor()
	clickUIObj(textStartsWith('看直播').findOne(10))

	while (count < total) {
		toastLog('已观看次数：' + count)

		id('award_count_down_text').waitFor()
		var second = (findVideoSecond() - 2) * 1000
		log(second)
		sleep(second)

		console.time('start')

		var close = false
		while (!close) {
			if (id('award_count_down_text').findOne(10)) {
				log('倒计时中')
				close = false
				sleep(1000)
			} else {
				log('关闭视频')
				close = true
			}
		}

		console.timeEnd('start')
		toastLog('观看直播结束')

		// 切换视频
		var w = device.width
		var h = device.height
		swipe(w / 3, (h / 4) * 3, (w / 3) * 2, h / 4, 300)
		swipe(w / 3, (h / 4) * 3, (w / 3) * 2, h / 4, 300)
		sleep(1000)

		while (!id('award_count_down_text').findOne(10)) {
			if (count >= 9) break
			swipe(w / 3, (h / 4) * 3, (w / 3) * 2, h / 4, 300)
			swipe(w / 3, (h / 4) * 3, (w / 3) * 2, h / 4, 300)
			sleep(1000)
		}
		count++
	}

	toastLog('完成了快手刷直播，退出')

	back()
	text('退出').waitFor()
	clickUIObj(text('退出').findOne(10))
	exit()
}

/**
 * @description: 获取直播观看总次数和已观看次数
 * @param {*}
 * @return {Number}  total总次数 count已观看次数
 */
function findVideoCount() {
	textStartsWith('观看精彩直播').waitFor()
	var text = textStartsWith('观看精彩直播').findOne(10).text()
	var start = text.lastIndexOf('成')
	var end = text.indexOf('/')

	var total = Number(text.slice(end + 1))
	var count = Number(text.slice(start + 1, end))

	return {
		total: total,
		count: count,
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

	var minutes = Number(text.slice(0, start))
	var seconds = Number(text.slice(start + 1))
	var second = minutes * 60 + seconds

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
