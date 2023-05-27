import { exec } from 'node:child_process'

const ExecPromise = (command: string) =>
	new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error)
				return
			}

			resolve({ stdout, stderr })
		})
	})

export default ExecPromise
