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

    //任务列表
    router.resources('taskList', '/api/v1/taskList', auth, controller.api.taskList);
    //任务
    router.resources('tasks', '/api/v1/tasks', auth, controller.api.tasks);
    router.put('/api/v1/tasks/move/:id', auth, controller.api.tasks.move);
    //分享
    router.resources('posts', '/api/v1/posts', auth, controller.api.posts);


    router.get('/api/v1/projects/:id/posts', auth, controller.api.projects.posts);


    //#region   Socket IO
    router.get('/api/v1/chat/list', auth, 'api.chat.list');

    io.of('/').route('chat.message', io.controller.chat.message);
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
