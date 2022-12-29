import inquirer from 'inquirer'

// Features
import SearchYoutube from './Features/SearchYoutube/SearchYoutube.js'

const { action } = await inquirer.prompt({
	type: 'list',
	message: 'Select action',
	name: 'action',
	choices: ['Search on Youtube'],
})

switch (action) {
	case 'Search on Youtube': {
		SearchYoutube()

		break
	}
}
