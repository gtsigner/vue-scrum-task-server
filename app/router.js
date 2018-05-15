'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
const WxPay = require('./payments/wechat');
module.exports = app => {
    const {router, controller, middleware, io} = app;

    const oauth = middleware.oauth();
    const auth = middleware.auth();
//#region api
    //用户组
    router.resources('oauth', '/api/v1/oauth', controller.api.oauth);

    router.get('/api/v1/user/me', auth, controller.api.user.me);
    router.post('/api/v1/auth/login', controller.api.oauth.login);
    router.resources('projects', '/api/v1/projects', auth, controller.api.projects);
    //查看详情
    router.get('/api/v1/projects/:id/show', auth, controller.api.projects.show);
    //任务分组
    router.resources('taskGroup', '/api/v1/taskLists', auth, controller.api.taskGroup);
    //任务阶段
    router.resources('taskStage', '/api/v1/taskStage', auth, controller.api.taskStage);
    //更新任务阶段排序
    router.post('/api/v1/taskStage/sort', auth, controller.api.taskStage.sorts);
    router.post('/api/v1/project/:id/addUser', auth, controller.api.projects.addUser);

    //任务列表
    router.resources('taskList', '/api/v1/taskList', auth, controller.api.taskList);
    //任务
    router.resources('tasks', '/api/v1/tasks', auth, controller.api.tasks);
    router.put('/api/v1/tasks/move/:id', auth, controller.api.tasks.move);
    router.put('/api/v1/tasks/:id/status', auth, controller.api.tasks.status);
    //分享
    router.resources('posts', '/api/v1/posts', auth, controller.api.posts);
    router.get('/api/v1/posts/:id/comments', auth, 'api.posts.comments');
    router.post('/api/v1/posts/:id/comment', auth, 'api.posts.comment');
    //活动
    router.resources('activities', '/api/v1/activities', auth, controller.api.activity);
    //Git 仓库
    router.resources('repository', '/api/v1/repository', auth, controller.api.repository);

    //分享
    router.get('/api/v1/project/:id/posts', auth, controller.api.projects.posts);
    //成员
    router.get('/api/v1/project/:id/members', auth, controller.api.projects.members);
    //文件夹
    router.get('/api/v1/collections/collections', auth, controller.api.collections.collections);
    router.get('/api/v1/collection/:id/show', auth, controller.api.collections.show);
    router.post('/api/v1/collection', auth, controller.api.collections.create);
    //上传文件
    router.post('/api/v1/upload/file', auth, controller.api.upload.file);

    router.get('/api/v1/chat/hgm', auth, controller.api.chat.historyGroupMsg);
    router.get('/api/v1/user/search', auth, controller.api.user.search);


    //#region   Socket IO
    router.get('/api/v1/chat/list', auth, 'api.chat.list');

    io.of('/').route('chat.message', io.controller.chat.message);
    io.of('/').route('chat.room', io.controller.chat.room);
    io.of('/').route('chat.user', io.controller.chat.user);
    io.of('/').route('auth.login', io.controller.auth.login);

    //#endregion    IO

    /*Admin*/
    router.resources('category', '/api/admin/category', controller.admin.category);
    router.resources('goods', '/api/admin/goods', controller.admin.goods);
    router.resources('order', '/api/admin/order', controller.admin.order);
    router.resources('user', '/api/admin/user', controller.admin.user);
    router.resources('attribute', '/api/admin/attribute', controller.admin.attribute);
    router.resources('financeLogs', '/api/admin/financeLogs', controller.admin.financeLogs);
};
