eventHandlers.taskScheduleBeforeDelete = function ($, event) {
    var schedule_id = event.data.data.schedule_id
    if (schedule_id) {
        if (!$.taskService.cancelScheduled(event.data.data)) {
            throw "无法停止已启动的计划任务"
        }
    }
}

eventHandlers.readNotification = function ($,event) {
	$.notificationService.readNotification(event.data.header.id);
}

eventHandlers.readBulletin = function ($,event) {
	$.notificationService.readBulletin(event.data.header.id);
}

eventHandlers.prettifyText = function ($,event) {
	var ObjectMapper =  Java.type('com.fasterxml.jackson.databind.ObjectMapper');
	var Object = Java.type('java.lang.Object');
	var filter_json = event.data.data.filter_json;
	var mapper = new ObjectMapper();
	try {
		var json = mapper.readValue(filter_json, Object.class);
		var output = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);
		event.data.data.filter_json = output;
	} catch (e) {
		e.printStackTrace();
	}
}

var CacheNames = Java.type('logwire.web.support.CacheNames')

eventHandlers.choiceClearCache = function ($, event) {
    $.cacheManager.getCache(CacheNames.CHOICE_LABEL).clear()
}

eventHandlers.eventClearCache = function ($, event) {
    $.cacheManager.getCache(CacheNames.EVENT).clear()
}

eventHandlers.eventHandlerClearCache = function ($, event) {
    $.cacheManager.getCache(CacheNames.EVENT_HANDLER).clear()
}

eventHandlers.rolePermissionClearCache = function ($, event) {
    $.cacheManager.getCache(CacheNames.ROLE_PERMISSION).clear()
}

eventHandlers.roleMenuClearCache = function ($, event) {
    $.cacheManager.getCache(CacheNames.ROLE_MENU).clear()
}

eventHandlers.roleVpdClearCache = function ($, event) {
    $.cacheManager.getCache(CacheNames.ROLE_VPD).clear()
}

eventHandlers.roleSearchTemplateClearCache = function ($, event) {
    $.cacheManager.getCache(CacheNames.SEARCH_TEMPLATE).clear()
}

eventHandlers.preferenceClearCache = function ($, event) {
    $.cacheManager.getCache(CacheNames.PREFERENCE_BOOLEAN).clear()
    $.cacheManager.getCache(CacheNames.PREFERENCE_INTEGER).clear()
    $.cacheManager.getCache(CacheNames.PREFERENCE_STRING).clear()
    $.cacheManager.getCache(CacheNames.PREFERENCE_KEY_PREFIX).clear()
}

