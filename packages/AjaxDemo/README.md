# AJAX的封装

```javascript
const xhr = new XMLHttpRequest();
```
## Ajax对象的属性
- xhr.response 整个响应体
- xhr.responseText 响应体的文本内容
- xhr.responseXML 如果响应头字段Content-Type为text/plain的话，得到就是一个XML对象
- xhr.readyState 请求的状态码
- xhr.status 请求的响应状态
- xhr.timeout 最大超时时间
- xhr.withCredentials 布尔值，指定跨域请求是否应当携带授权信息（cookie或头字段）


## Ajax实例方法
- onreadyStatechange 用来监听readyState属性的变化
- abort 用来终止请求
- onprogress 用来监听请求进度
- onerror 请求错误时触发
- open(type, url, async) 初始化一个ajax请求
- setRequestHeader() 设置请求头
- send() 发送请求
  
## Ajax事件对象
- abort
- error
- load 请求成功时触发
- progress
- timeout