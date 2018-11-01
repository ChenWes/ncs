actions.userProfile = function ($, namespace, request, response) {
    var user = $.queryService.select('user').eq('user_gid', $.userName).find()
    user.password = null
    response.data = { header: user }
}
actions.userProfile.action = 'profile'
actions.userProfile.namespace = 'user'


actions.userChangePassword = function ($, namespace, request, response) {
    if (request.body.aux) {
        var aux = request.body.aux
        if (aux.password && aux.verifiedPassword && aux.password === aux.verifiedPassword) {
            var user = $.queryService.select('user').eq('user_gid', $.userName).find()
            var authType = user.auth_type;
            if (authType != null && "ldap".equals(authType)) {
//              $.ldapService.updateUserPassword(user.username, aux.password);
              //不支持修改LDAP密码
              throw 'LDAP用户暂不支持修改密码'
            } else {
              user.put('password_new', aux.password)
              $.queryService.update('user', user, 'password')
            }
            response.message = '成功修改密码'
            return
        } else {
            throw '输入的密码不一致'
        }
    }
    throw '无效的请求'
}
actions.userChangePassword.action = 'chpassword'
actions.userChangePassword.namespace = 'user'


actions.searchTemplateQuery = function ($, namespace, request, response) {
    response.data = $.roleService.getSearchTemplate(request.body.aux.layoutName, $.userName, $.user.role, $.userDomain)
}
actions.searchTemplateQuery.action = 'search'
actions.searchTemplateQuery.namespace = 'search_template'


actions.taskSchedule = function ($, namespace, request, response) {
    var rows = request.body.selectedRows
    rows.forEach(function (row) {
        var taskId = $.taskService.schedule(row)
    })
    response.code = 'refresh'
    response.message = '计划任务已启动'
}
actions.taskSchedule.action = 'schedule'
actions.taskSchedule.namespace = 'task_schedule'


actions.taskCancelSchedules = function ($, namespace, request, response) {
    var rows = request.body.selectedRows
    rows.forEach(function (row) {
        $.taskService.cancelScheduled(row)
    })
    response.code = 'refresh'
    response.message = '计划任务已停止'
}
actions.taskCancelSchedules.action = 'cancel_scheduled'
actions.taskCancelSchedules.namespace = 'task_schedule'


actions.taskCancelOrphanSchedules = function ($, namespace, request, response) {
    var canceled = $.taskService.cancelOrphanScheduledTasks()
    if (canceled === 0) {
        response.message = '未取消任何计划任务'
    } else {
        response.message = '成功取消 ' + canceled + ' 个孤立的计划任务'
    }
}
actions.taskCancelOrphanSchedules.action = 'cancel_orphan_scheduled'
actions.taskCancelOrphanSchedules.namespace = 'task_schedule'


actions.taskInvokeScheduledImmediately = function ($, namespace, request, response) {
    var rows = request.body.selectedRows
    if (rows && rows.size() === 1) {
        $.taskService.invokeScheduledImmediately(rows[0])
        response.message = '成功提交后台执行'
    } else {
        response.message = '仅允许提交一个任务'
    }
}
actions.taskInvokeScheduledImmediately.action = 'invoke_scheduled_immediately'
actions.taskInvokeScheduledImmediately.namespace = 'task_schedule'


actions.queryCopyData = function ($, namespace, request, response) {
    response.code = 'dataset_set'
    response.data = []

    var aux = request.body.aux
    if (aux && aux.refId && aux.datasetName) {
        var queryData = $.queryService.get(namespace, aux.refId)
        var query = $.query(namespace)
        common.prepareQueryDataForInsert($, query, queryData)
        response.data = common.queryDataToActionDatasetSet(aux.datasetName, queryData)
    }
}
actions.queryCopyData.action = 'query_copy_data'
actions.queryCopyData.namespace = ''


actions.saveBulletin = function ($, namespace, request, response) {
	var requestData = request.body.selectedRows[0];
	var title = requestData.title;
	var content = requestData.content;
	var biz_type = requestData.biz_type;
	var priority = requestData.priority;
	var notificationId = $.notificationService.addBulletin(title,content,biz_type,priority);
	response.code = 'redirect'
	var redirect = {
      path: '/l/bulletinPage/edit',
      query: {
         id: notificationId
      }
    };
	response.data = redirect;
}
actions.saveBulletin.action = 'saveBulletin'
actions.saveBulletin.namespace = 'bulletinQuery'


actions.installDomainData = function($, namespace, request, response) {
  var domains = common.arrayList();
  request.body.selectedRows.forEach(function(map) {
    domains.add(map.get("domain_name"));
  });
  $.installService.installDomainDatas($.project, domains);
  response.message = '加载成功'
}
actions.installDomainData.action = 'installDomainData'
actions.installDomainData.namespace = 'domain'


actions.syncLdap = function($, namespace, request, response) {
  $.ldapService.sync();
  response.message = '同步成功'
}
actions.syncLdap.action = 'syncLdap'
actions.syncLdap.namespace = 'user'