require('dotenv').config()

const { login } = require('./lib')
;(async () => {
	let user = await login(process.env.LOGIN_USERNAME, process.env.LOGIN_PASSWORD)
	console.log(user)
	let schedule = await user.getSchedule('202021', 'S1', 'EI-1-A', '319')
	
	console.log(schedule)
})()
