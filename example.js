require('dotenv').config()

const { login } = require('./lib')
;(async () => {
	let user = await login(process.env.LOGIN_USERNAME, process.env.LOGIN_PASSWORD)
	console.log(user)
	let schedule = await user.getSchedule('202021', 'S2', 'EI-1-B', '326')
	console.log(schedule)


	let scheduleByDate = await user.getScheduleByDate('202021', 'S2', 'EI-1-B', '2021', '03', '24')
	console.log(scheduleByDate)

})()
