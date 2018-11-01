var certify_sql =
"select * from shipment  ship " +
"left join order_movement  om on om.shipment_gid=ship.shipment_gid " +
"left join order_release  ore on ore.order_release_gid=om.order_release_gid "+
"left join location loc on loc.location_gid=ore.source_location_gid " +
"where ship.shipment_gid=? and loc.attribute19 like  '%' || nvl( om.attribute18,'no_match') || '%' "

var SQL =
"SELECT " +
//"SHIP.SHIPMENT_XID AS TRANSPORT_CODE, " +
"NVL(REPLACE(OM.OLD_SHIPMENT_GID,'NCS.',''),SHIP.SHIPMENT_XID) AS TRANSPORT_CODE," +
"REPLACE(SHIP.POWER_UNIT_GID,'NCS.','') AS CAR_NO, " +
"REPLACE(SHIP.DRIVER_GID,'NCS.','')AS DRIVER_CODE, " +
"TO_CHAR(SHIP.START_TIME+1/3, 'YYYY-MM-DD') AS TRANSPORT_DATE, " +
"T.LINE_ARRANGE AS LINE_ARRANGE, " +
"D.ATTRIBUTE7  AS MAKE_EMP, " +
"NVL(REPLACE(OM.OLD_SHIPMENT_GID,'NCS.',''),SHIP.SHIPMENT_XID) || '_2' || ORE.ATTRIBUTE13 || '_' || ORE.ATTRIBUTE15 || '_' || ORE.ATTRIBUTE18 || '_' || ORE.ATTRIBUTE13 AS SCHEME_CODE, " +
"ORE.ATTRIBUTE13 AS SUPPLIER_CODE, " +
"ORE.ATTRIBUTE15 AS SEND_PLACE_CODE, " +
"ORE.ATTRIBUTE18 AS NEED_GOODS_CODE, " +
"TO_CHAR(SHIPSTOP.PLANNED_ARRIVAL + 1/3, 'YYYY-MM-DD HH24:MI') AS PLAN_PICKUP_TIME, " +
"SU.TAG_1 AS TRAY_CODE " +
"FROM SHIPMENT SHIP " +
"LEFT JOIN ORDER_MOVEMENT OM ON OM.SHIPMENT_GID = SHIP.SHIPMENT_GID " +
"LEFT JOIN ORDER_RELEASE ORE ON ORE.ORDER_RELEASE_GID = OM.ORDER_RELEASE_GID " +
"LEFT JOIN ORDER_MOVEMENT_D OMD ON OM.ORDER_MOVEMENT_GID = OMD.ORDER_MOVEMENT_GID " +
"LEFT JOIN S_SHIP_UNIT SSU ON SSU.S_SHIP_UNIT_GID = OMD.S_SHIP_UNIT_GID " +
"LEFT JOIN SHIP_UNIT SU ON SU.SHIP_UNIT_GID = SSU.SHIP_UNIT_GID " +
"LEFT JOIN DRIVER D ON D.DRIVER_GID = SHIP.DRIVER_GID " +
"LEFT JOIN CONTACT CON ON CON.CONTACT_GID = SHIP.INSERT_USER "+
"LEFT JOIN (SELECT SS.SHIPMENT_GID, "+
                    "CASE  WHEN SUM(CASE  WHEN SS.STOP_TYPE = 'P' THEN   1     ELSE  0   END) > 1 THEN  3 "+
                      "WHEN S.ATTRIBUTE17 = '近地化入集配' OR S.ATTRIBUTE17 = '干线入集配'   THEN  1 "+
                      "WHEN S.ATTRIBUTE17 = '近地化出集配' OR S.ATTRIBUTE17 = '干线出集配'   THEN  3 "+
                      "ELSE 0 END AS LINE_ARRANGE "+
               "FROM SHIPMENT_STOP SS, SHIPMENT S "+
              "WHERE SS.SHIPMENT_GID = S.SHIPMENT_GID "+
              "GROUP BY SS.SHIPMENT_GID, S.ATTRIBUTE17) T "+
    "ON T.SHIPMENT_GID = SHIP.SHIPMENT_GID "+
//OM关联location表，取出attribute12 实际发货地点
"LEFT JOIN  (SELECT NVL(ATTRIBUTE12,LOCATION_GID) AS ATTRIBUTE12,LOCATION_GID  FROM LOCATION) LO  "+
"               ON OM.SOURCE_LOCATION_GID = LO.LOCATION_GID "+
"LEFT JOIN (SELECT SST.SHIPMENT_GID, SST.LOCATION_GID,MIN(SST.PLANNED_ARRIVAL) AS PLANNED_ARRIVAL,  "+
                    "NVL(SSTL.ATTRIBUTE12,SST.LOCATION_GID) AS ATTRIBUTE12 "+
               "FROM SHIPMENT_STOP SST "+
               "LEFT JOIN LOCATION SSTL ON SST.LOCATION_GID = SSTL.LOCATION_GID "+
              "WHERE  SST.STOP_TYPE = 'P' "+
              "GROUP BY SST.SHIPMENT_GID, SSTL.ATTRIBUTE12,SST.LOCATION_GID) SHIPSTOP "+
    //"ON SHIPSTOP.SHIPMENT_GID = SHIP.SHIPMENT_GID  AND SHIPSTOP.LOCATION_GID = OM.SOURCE_LOCATION_GID "+
    "ON SHIPSTOP.SHIPMENT_GID = SHIP.SHIPMENT_GID  AND SHIPSTOP.ATTRIBUTE12 = LO.ATTRIBUTE12  "+
"WHERE SHIP.SHIPMENT_GID=? AND OM.ATTRIBUTE16 IN ('直送','近地化入集配','干线入集配') " +
" AND NVL(OM.OLD_SHIPMENT_GID,OM.SHIPMENT_GID) = ? " +
"ORDER BY SHIP.SHIPMENT_GID,ORE.ATTRIBUTE13,ORE.ATTRIBUTE15,ORE.ATTRIBUTE18"

//var SQL_SUP = " select v.SUPPLIER_CODE,max(v.PLAN_PICKUP_TIME) PLAN_PICKUP_TIME from ( " + SQL + ") v group by v.supplier_code "

common.SCMP_OUTBOUNDS['TRANSPORT_PLAN_SUBMIT'] = function ($, logObj) {
  var gid = logObj.get('transmission')
  var old_gid = logObj.get('old_transmission')
  if(gid){
        //print("=========userName3333"+$.userName)
      var list = $.queryService.jdbcTemplate.queryForList(certify_sql, gid)
      //print("=========userName4444"+$.userName)
      if (list.size() == 0) {

        throw new java.lang.IllegalArgumentException('该供应商不允许发送配车方案接口')

  }
    //print("++++9090"+list.size())
}
  if (gid) {
    var list = $.queryService.jdbcTemplate.queryForList(SQL, [gid,old_gid])
    if (list.size() == 0) {
      throw new java.lang.IllegalArgumentException('未检索到数据')
    }
    //如有两个发点的发货点是相同的话，补充计划提货时间
    //查询出相同供应商对应的计划提货时间
    // var list_sup = $.queryService.jdbcTemplate.queryForList(SQL_SUP, gid)
    // //循环比较，如果list结果集中有空值，去跟lsit_sup结果集比较是否有相同供应商的值
    // for(var i = 0;i < list.size(); i++){
    //   //判断计划提货时间是否有空值
    //   if(list.get(i).get("PLAN_PICKUP_TIME") == null || list.get(i).get("PLAN_PICKUP_TIME") == ''){
    //     //获得供应商code
    //     var supplier_code_tmp = list.get(i).get("SUPPLIER_CODE")
    //     //循环相同供应商计划提货时间list
    //     for(var j=0;j<list_sup.size();j++){
    //       //判断list数据集中的供应商跟list_sup是否一致，如相同，赋值计划提货时间
    //       if(supplier_code_tmp == list_sup.get(j).get("SUPPLIER_CODE")){
    //         list.get(i).put("PLAN_PICKUP_TIME",list_sup.get(j).get("PLAN_PICKUP_TIME"))
    //         break
    //       }
    //     }
    //   }
    // }
    // 按二级数据全部字段分组
    var detailGroups = list.stream().collect(java.util.stream.Collectors.groupingBy(function (row) {
      var key = ['SUPPLIER_CODE','SEND_PLACE_CODE','NEED_GOODS_CODE'].map(function (c) {
        return row.get(c)
      }).join('.')
       //print('*** ====key'+ key)
      return key
    })).values()
     //print('*** detailGroups', detailGroups.size(), detailGroups)
    // 任取一行二级数据填充一级数据
    var detail = detailGroups.iterator().next().get(0)
    //print('*** detail', detail)
    var data = common.hashMap(
      'TRANSPORT_CODE', detail.get('TRANSPORT_CODE'),
      'CAR_NO', detail.get('CAR_NO'),
      'DRIVER_CODE', detail.get('DRIVER_CODE'),
      'TRANSPORT_DATE', detail.get('TRANSPORT_DATE'),
      'LINE_ARRANGE', detail.get('LINE_ARRANGE'),
      'MAKE_EMP', detail.get('MAKE_EMP')
      )
    // 填充二级数据字段
    var assignPlanList = common.arrayList()
    data.put('ASSIGN_PLAN_LIST', assignPlanList)
    Java.from(detailGroups).forEach(function (detailGroup) {
      var assignPlan = common.hashMap(
          'SCHEME_CODE', detailGroup[0].get('SCHEME_CODE'),
          'SUPPLIER_CODE', detailGroup[0].get('SUPPLIER_CODE'),
          'SEND_PLACE_CODE', detailGroup[0].get('SEND_PLACE_CODE'),
          'NEED_GOODS_CODE', detailGroup[0].get('NEED_GOODS_CODE'),
          'PLAN_PICKUP_TIME', detailGroup[0].get('PLAN_PICKUP_TIME')
        )
        // var a=assignPlan.get('SEND_PLACE_CODE')
        // var b=a.indexOf("-")
        // print("=========1234"+b)
        // var c=a.substring(++b)
        //  print("=========xiaoyuee"+c)
        //
        //  assignPlan.put('SEND_PLACE_CODE',c)

      var trayCodeList = Java.from(detailGroup).map(function (d) { return d.get('TRAY_CODE') })
      assignPlan.put('TRAY_CODE_LIST', Java.to(trayCodeList))
      assignPlanList.add(assignPlan)
    })





      return common.objectArray(data)
  } else {
    throw new java.lang.IllegalArgumentException('未设置OTM对象ID')
  }
}
