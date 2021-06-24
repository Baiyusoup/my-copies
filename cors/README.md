# 跨域

### CORS
CORS对于简单请求的做法是在请求头自动加上Origin这个字段，表明请求是来自哪个源的

对于非简单请求，则需要除了Origin外，还有
1. host
2. Access-Control-Request-Method
3. Access-Control-Request-Headers

服务端响应时需要返回的请求头有
1. Access-Control-Allow-Origin
2. Access-Control-Allow-Methods
3. Access-Control-Allow-Headers


### JSONP
JSONP的原理就是利用script标签的src属性不受浏览器的同源策略的限制的特点。通过动态加载script标签，向服务端请求json数据，服务端收到请求后，将响应数据作为一个指定名字的回调函数的参数返回。因为script标签请求的脚本，直接作为代码运行，所以只要全局有个指定名字的函数，就会被调用，作为参数的json数据会被视为js对象而不是字符串。