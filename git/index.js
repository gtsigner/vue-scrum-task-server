const path = require('path');
const Git = require('./git-server');

const repos = new Git(path.resolve(__dirname, '../GitResp'), {
    autoCreate: true,
    authenticate: (type, repo, user, next) => {
        if (type === 'push') {
            user((username, password) => {
                console.log(username, password);
                next();
            });
        } else {
            next();
        }
    }
});
const port = process.env.PORT || 7000;

repos.on('push', (push) => {
    console.log(`push ${push.repo}/${push.commit} (${push.branch})`);
    push.accept();
});

repos.on('fetch', (fetch) => {
    console.log(`fetch ${fetch.commit}`);
    fetch.accept();
});
repos.on('error', (err) => {
    console.error(err.message)
});
repos.on('info', (info) => {
    info.accept();
});
// repos.listen(port, () => {
//     console.log(`git-server running at http://localhost:${port}`)
// });
exports.Git = repos;