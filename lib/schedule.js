const FormData = require('form-data')
const fetch = require('node-fetch')

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
			body: form,
		}
	)
	let html = await res.text()
	return parseSchedulesHtmlContent(html)
}

module.exports = {
	getSchedule,
}
