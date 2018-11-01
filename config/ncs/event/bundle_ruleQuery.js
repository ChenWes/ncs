eventHandlers.bundle_ruleQueryInsertBefore = function ($, event) {
  var header = event.data.data.header;

  var direction = Java.from(event.data.data['bundle_rule_direction'].rows)

  print('direction size: ' + direction.length)

print("============1111111"+ direction.length)
  for (var i = 0; i < direction.length; i++) {

    direction[i].direction =direction[i].source_location_code+"-"+direction[i].dest_location_code
header.suppliers_names =direction[i].suppliers_name+","+header.suppliers_names
header.suppliers_codes =direction[i].suppliers_code+","+header.suppliers_codes
print("================22222"+header.suppliers_names)
print("================3333333"+header.suppliers_codes)
  }



header.suppliers_names = header.suppliers_names.substring(0, header.suppliers_names.length - 1) //去除最后一个逗号
header.suppliers_codes = header.suppliers_codes.substring(0, header.suppliers_codes.length - 1)
print("================44444"+header.suppliers_names)
print("================55555"+header.suppliers_codes)



}


eventHandlers.bundle_ruleQueryUpdateBefore = function ($, event) {
  var header = event.data.data.header;

  var direction = Java.from(event.data.data['bundle_rule_direction'].rows)

  print('direction size: ' + direction.length)

print("============1111111"+ direction.length)
header.suppliers_names=''
header.suppliers_codes=''
  for (var i = 0; i < direction.length; i++) {

    direction[i].direction =direction[i].source_location_code+"-"+direction[i].dest_location_code
header.suppliers_names =direction[i].suppliers_name+","+header.suppliers_names
header.suppliers_codes =direction[i].suppliers_code+","+header.suppliers_codes
print("================22222"+header.suppliers_names)
print("================3333333"+header.suppliers_codes)
  }



header.suppliers_names = header.suppliers_names.substring(0, header.suppliers_names.length - 1) //去除最后一个逗号
header.suppliers_codes = header.suppliers_codes.substring(0, header.suppliers_codes.length - 1)
print("================44444"+header.suppliers_names)
print("================55555"+header.suppliers_codes)



}
