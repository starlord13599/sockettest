const nodemon = require('gulp-nodemon');
const { exec } = require('child_process');
const { series } = require('gulp');

//task for nodemon server
async function runServer(done) {
	return nodemon({
		script: 'app.js',
		ignore: [],
		done: done,
	});
}

//git add --all command
async function gitAdd() {
	return exec('git add --all');
}

// git commit -m `message` command
async function gitCommit() {
	const commitMessage = await new Input({
		message: 'Please enter the commit you want to create',
	}).run();
	return exec(`git commit -m "${commitMessage}"`);
}

//git push
async function gitPush() {
	return exec('git push');
}

module.exports = {
	runServer,
	gitSubmit: series(gitAdd, gitCommit, gitPush),
};
