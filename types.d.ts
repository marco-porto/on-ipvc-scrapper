type Status = 'REPLACED' | 'CANCELED' | 'NOT_TAUGHT' | 'OTHER'

export interface ScheduleItem {
	start: number,
	end: number,
	lesson: {
		name: string,
		shortName: string,
		type: string,
		classRoom: string
	},
	id: number,
	teacher: string,
	status: Status
}

type Schedule = ScheduleItem[]

declare class User {
	public cookie: string

	getCookieHeader(): string

	getSchedule(year, semester, klass, week): Promise<Schedule>

	getScheduleByDate(scheduleYear, semester, klass, year, month, day): Promise<Schedule>
}

export function login(): User

export function getSchedule(login, year, semester, klass, week): Promise<Schedule>
export function getScheduleByDate(login, year, semester, klass, week): Promise<Schedule>