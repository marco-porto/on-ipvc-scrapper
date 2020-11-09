const { login } = require('./lib')

;(async () => {
	let user = await login('amatossousa', 'password')
	console.log(user)
	let schedule = await user.getSchedule('202021', 'S1', 'EI-1-C', '311')

	console.log(schedule)
})()
