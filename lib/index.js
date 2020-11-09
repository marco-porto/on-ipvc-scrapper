const FormData = require('form-data')
const fetch = require('node-fetch')

const { getSchedule } = require('./schedule')

class User {
	constructor(cookie) {
		this.cookie = cookie
	}

	getCookieHeader() {
		return {
			Cookie: this.cookie,
		}
	}

	async getSchedule(year, semester, klass, week) {
		return await getSchedule(
			this.getCookieHeader(),
			year,
			semester,
			klass,
			week
		)
	}
}

const login = async (username, password) => {
	let form = new FormData()
	form.append('on-user', username)
	form.append('on-pass', password)
	form.append('on-auth', 3)

	let res = await fetch('https://on.ipvc.pt/login.php', {
		method: 'post',
		body: form,
	})
	let data = await res.json()

	if (data.status === 'OK') return new User(res.headers.raw()['set-cookie'])
	throw 'Invalid Credentials'
}

module.exports = { login }
