common.now = function () {
    return Java.type('java.time.OffsetDateTime').now(Java.type('java.time.ZoneId').systemDefault())
}

common.today = function () {
    var n = common.now()
    return n.withHour(0).withMinute(0).withSecond(0).withNano(0)
}

common.isNullOrEmpty = function (val) {
    return !val || val === ''
}

common.daysBetween = function(date1, date2) {
	var JDateTime = Java.type("jodd.datetime.JDateTime")
	var d1 = new JDateTime(date1.getYear(), date1.getMonthValue(), date1.getDayOfMonth());
	var d2 = new JDateTime(date2.getYear(), date2.getMonthValue(), date2.getDayOfMonth());
	return d1.daysBetween(d2)
}

common.toOffsetDateTime = function(paramValue) {
  if(paramValue instanceof java.time.OffsetDateTime) return paramValue
	if (paramValue.toString().indexOf('/') > 0) {
		paramValue = paramValue.toString().replaceAll('/', '-');
	}

	if (paramValue.toString().length() < 10) {
		var ss = paramValue.toString().split("-");
		if (ss[1].length() == 1) {
			ss[1] = "0" + ss[1];
		}
		if (ss[2].length() == 1) {
			ss[2] = "0" + ss[2];
		}

		paramValue = ss[0] + "-" + ss[1] + "-" + ss[2];
	}

	if (paramValue.length() == 10) {
		paramValue += "T16:00:00+08:00";
	}

	return java.time.OffsetDateTime.parse(paramValue.toString(), java.time.format.DateTimeFormatter.ISO_DATE_TIME);
}

common.objectArray = function () {
    var ObjectArray = Java.type('java.lang.Object[]');
    var array = new ObjectArray(arguments.length)
    for (var i = 0; i < arguments.length; i++) {
        array[i] = arguments[i]
    }
    return array
}

common.hashMap = function () {
    var map = new java.util.HashMap()
    for (var i = 0; i < arguments.length; i++) {
        var k = arguments[i], v
        if (i < arguments.length - 1) v = arguments[++i]
        else v = k
        map.put(k, v)
    }
    return map
}

common.arrayList = function () {
    var list = new java.util.ArrayList(arguments.length)
    for (var i = 0; i < arguments.length; i++) {
        list.add(arguments[i])
    }
    return list
}

common.decimal = function (val) {
    var d = new java.math.BigDecimal(val)
    if (arguments.length == 2) {
        d = d.setScale(arguments[1], java.math.BigDecimal.ROUND_HALF_UP)
    } else if (arguments.length == 3) {
        d = d.setScale(arguments[1], arguments[2])
    }
    return d
}

common.throwable = function (val) {
    return val.nashornException ? val.nashornException : val
}

// HTTP Client使用了jodd-http
// Documentation & Example: http://jodd.org/doc/http.html
common.httpRequest = Java.type('jodd.http.HttpRequest')
common.httpBrowser = Java.type('jodd.http.HttpBrowser')

// Hashing算法使用Google Guava中的Hashing类
// common.hashing 对象为
// md5 example:
// common.hashing.md5().hashBytes('sdf'.getBytes('utf-8'))
// Output: 881710b97e322568d6e8685aa3fbea63
common.hashing = Java.type('com.google.common.hash.Hashing')

// https://google.github.io/guava/releases/19.0/api/docs/com/google/common/base/Charsets.html
common.charsets = Java.type('com.google.common.base.Charsets')

// Jackson json parser
common._objectMapper = new com.fasterxml.jackson.databind.ObjectMapper
common.toJson = function (value) {
    var writer = new java.io.StringWriter
    common._objectMapper.writeValue(writer, value)
    return writer.buffer.toString()
}
// This function read object of JsonNode type
// https://fasterxml.github.io/jackson-databind/javadoc/2.2.0/com/fasterxml/jackson/databind/JsonNode.html
common.fromJson = function (json) {
    return common._objectMapper.readTree(json)
}

common.urlEncode = function (value, encoding) {
    if (!encoding) encoding = 'utf-8'
    return Java.type('jodd.util.URLCoder').encodeQueryParam(value, encoding)
}

// http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/util/StreamUtils.html
common.streamUtils = Java.type('org.springframework.util.StreamUtils')

// https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html
common.dateTimeFormatter = Java.type('java.time.format.DateTimeFormatter')
common.formatDateTime = function (datetime, pattern) {
    return datetime.format(common.dateTimeFormatter.ofPattern(pattern))
}
common.parseDateTime = function (text, pattern) {
    var defaultZone = Java.type('java.time.ZoneId').systemDefault()
    var formatter = common.dateTimeFormatter.ofPattern(pattern).withZone(defaultZone)
    return Java.type('java.time.ZonedDateTime').parse(text, formatter).toOffsetDateTime()
}


common.generateBusinessNumber = function ($, code, context, pattern, data) {
    var Rule = Java.type('logwire.web.service.biznum.BusinessNumberRule')
    var rule = new Rule(code, '', '', '', context, pattern)
    if (!data) data = common.hashMap()
    return $.businessNumberService.generate(rule, data)
}

common.getLogger = function (name) {
    return Java.type('org.slf4j.LoggerFactory').getLogger(name)
}

// Soap xml parse with mycila.xmltool
common.XMLDoc = Java.type('com.mycila.xmltool.XMLDoc')
common.fromXML = function (reqXml) {
  return common.XMLDoc.from(reqXml, false)
}

// freemarker
// http://freemarker.org/docs/index.html
common.freemarker = Java.type('logwire.web.support.FreemarkerTemplate').getInstance()

common.loadFreemarker = function ($, name) {
    var is = $.project.findFreemarker(name)
    if (is) {
        var reader = new java.io.InputStreamReader(is, 'utf-8')
        try {
            var utils = Java.type('org.springframework.util.FileCopyUtils')
            return utils.copyToString(reader)
        } finally {
            reader.close()
        }
    } else {
        return null
    }
}

function prepareModelDataForInsert(model, modelObj, parentKeyField) {
    if (model.includeVersionField) {
        modelObj.put('version', null)
    }
    if (model.includeAuditFields) {
        modelObj.put('insert_date', null)
        modelObj.put('insert_user', null)
        modelObj.put('update_date', null)
        modelObj.put('update_user', null)
    }
    if (model.includeDomainField) {
        modelObj.put('domain_name', null)
    }
    modelObj.put(model.primaryKeyField.name, null)
    if (parentKeyField) {
        modelObj.put(parentKeyField, null)
    }
}

common.prepareQueryDataForInsert = function ($, query, queryData) {
    var modelObj = queryData.header
    var model = $.model(query.model)
    prepareModelDataForInsert(model, modelObj)
    Java.from(query.items).forEach(function (item) {
        var itemName = item.name
        var itemModel = $.model(item.model)
        var itemObj = queryData[itemName]
        if (itemObj && itemObj.rows) {
            Java.from(itemObj.rows).forEach(function (itemModelObj) {
                prepareModelDataForInsert(itemModel, itemModelObj, item.referKey)
            })
        }
    })
}

common.queryDataToActionDatasetSet = function (datasetName, queryData) {
    var data = common.arrayList() // javascript array will be json object in client
    for (var p in queryData) {
        if (p === 'header') {
            data.add({name: datasetName, value: queryData[p]})
        } else {
            data.add({name: datasetName + '__' + p, value: queryData[p]})
        }
    }
    return data
}
