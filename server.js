// server.js
const egg = require('egg');
const workers = Number(process.argv[2] || require('os').cpus().length);
egg.startCluster({
    workers,
    sticky: true,
    baseDir: __dirname,
});

