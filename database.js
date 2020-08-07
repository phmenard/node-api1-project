const shortid = require('shortid');

let users = [
	{
        id: '1',
        name: 'Paul Menard',
        bio: 'I love JS',
      },
      {
        id: '2',
        name: 'Jason Long',
        bio: 'I love being a TL',
      },
      {
        id: '3',
        name: 'Mike Lopes',
        bio: 'I love the outdoors',
      }
]

function getUsers() {
	return users
}

function getUserById(id) {
	return users.find(u => u.id === id)
}

function createUser(data) {
	const payload = {
		id: shortid.generate().toString(),
		...data,
	}

	users.push(payload)
	return payload
}

function updateUser(id, data) {
	const index = users.findIndex(u => u.id === id)
	users[index] = {
		...users[index],
		...data,
	}
	
	return users[index]
}

function deleteUser(id) {
	users = users.filter(u => u.id != id)
}

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
    deleteUser,
    users,
}