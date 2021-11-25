# 迷你版的vite服务器

### 首页
判断url是否为/，如果是的话，就将response的Content-Type设置为text/html，使用fs模块读取首页index.html，将得到的首页文件放到response.write()中

### 处理js文件
判断url是否以.js结尾，如果是的话，就通过path模块拼接该js文件的绝对路径，然后通过fs模块读取，然后设置响应头Content-type为application/javascript

这里需要注意到是，对于js文件中的import xx from 'path' 这种非相对路径的导入，需要将路径重定向要node_module。vite的做法是将导入路径重写成@modules/xx

等解析到js文件中的import from 是，判断是不是@/modules开头，如果是的话，就需要重定向到node_modules

### 处理css文件
对于css文件的处理，基本流程就是根据url和path得到绝对路径，然后读取文件。接下来就是创建style标签，将文件内容去掉换行后插入到style标签内。这些工作是js做的，因此我们要将这些代码弄成字符串放到响应体中，设置响应头的Content-Type为application/javascript，这样浏览器在收到响应时，就会当成js文件来解析，运行

### 处理vue文件
对于vue文件，则需要借助@vue/compiler-dom和@vue/compiler-sfc这两个库来完成了。发起.vue的请求后，先把script解析出来，然后里面加上请求template和css的import语句，把template解析成render函数，返回拼成一个组件


### 吐槽
我真的傻逼了，解析vue文件的时候，由于之前对导入语句进行重写的时候正则表达式没给from单词前面加空格，导致所有的from语句，比如opt.from这些被重写，然后就报错。我去翻@runtime-core的源码才发现傻逼正则写法错了，把尤大写好的代码替换掉了。