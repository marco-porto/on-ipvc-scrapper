const FormData = require('form-data')
const fetch = require('node-fetch')
const moment = require('moment')

const parseSchedulesHtmlContent = (content) => {
	let match = content.match(/events_data\s=\s(.+);/gm)
	if (!match) return null

	let data = match[0].replace('events_data = ', '')
	return eval(data)
}

const getSchedule = async (login, year, semester, klass, week) => {
	let form = new FormData()
	form.append('param_anoletivoH', year)
	form.append('param_semestreH', semester)
	form.append('param_turmaH', klass)
	form.append('param_semanaH', week)
	form.append('emissorH', 'consultageral')

	let res = await fetch(
		'https://on.ipvc.pt/v1/modulos/atividadeletiva/horario_source_v3.php',
		{
			method: 'post',
			headers: login,
			body: form
		}
	)
	let html = await res.text()
	let parsedContent = parseSchedulesHtmlContent(html)
	if (!parsedContent) {
		return null
	}

	let reParsedContent = []

	const DATE_FORMAT = 'YYYY-MM-DD HH:mm:SS'

	parsedContent.forEach(item => {
		let classRoom = item.title.split(' - ')[1]
		let [id, className, classShortName, __, classType] = item.datauc.split('-')

		reParsedContent.push({
			start: moment(item.datadatainicio, DATE_FORMAT).unix(),
			end: moment(item.datadatafim, DATE_FORMAT).unix(),
			lesson: {
				name: className,
				shortName: classShortName,
				type: classType,
				classRoom
			},
			id: parseFloat(id),
			teacher: item.datadocentes.replace(/<.+; /, '').replace('</div>', ''),
			status: item.color === '#7f5555' ? 'REPLACED' : item.color === '#ff0000' ? 'CANCELED' : item.color === '#f0a0a0' ? 'NOT_TAUGHT' : 'OTHER'
		})
	})

	return reParsedContent
}

const getScheduleByDate = async (login, scheduleYear, semester, klass, year, month, day) => {
	const STATIC_DATE = 326
	const staticMomentTime = moment({
		year: 2021,
		day: 23,
		month: 2
	})
	let requestTime = moment({
		year,
		month,
		day
	})

	let scheduleWeek = requestTime.diff(staticMomentTime, 'weeks')

	let weekSchedule = await getSchedule(login, scheduleYear, semester, klass, STATIC_DATE + scheduleWeek)
	if (!weekSchedule) {
		return null
	}

	return weekSchedule.filter(item => moment.unix(item.start).format("DD-MM-YYYY") === `${day}-${month}-${year}`)
}

module.exports = {
	getSchedule,
	getScheduleByDate
}
