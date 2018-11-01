# README

根据HTTP请求头Content-Type的取值不同，接口支持两种不同的请求数据类型。

## testFile.txt

此文件为测试接口标准功能文件。没有接口参数内容，仅仅是测试签名等接口规范的实现。

测试使用HTTP头
Content-Type: application/x-www-form-urlencoded

##  car_apply.json

此文件是为了测试CAR_APPLY接口准备的。而且修改了请求的内容类型。不会检查签名，以及CONTENT不是JSON字符串，而直接是JSON。方便调试业务参数。

测试使用HTTP头
Content-Type: application/json

