const http = require('http');
const fs = require('fs');
const path = require('path');
const sfcCompiler = require('@vue/compiler-sfc');
const domCompiler = require('@vue/compiler-dom');


const port = 3000;
const sheetsMap = new Map();

const app = http.createServer((request, response) => {
  console.log(request.url);
  const { url } = request;

  if (url === '/') {
    response.setHeader('Content-Type', 'text/html');
    let content = readFile('./index.html');
    content = content.replace('<script ',`
      <script>
        window.process = {env:{ NODE_ENV:'dev'}}
      </script>
      <script 
    `)
    response.write(content);
  } else if (url.endsWith('.js')) {
    // 处理js文件
    const rp = path.resolve(__dirname, url.slice(1));
    const content = readFile(rp);
    response.setHeader('Content-Type', 'application/javascript');
    response.write(rewriteImport(content));
  } else if (url.startsWith("/@modules/")) {
    // 处理node_modules里面的文件
    const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''));
    const module = require(`${prefix}/package.json`).module;
    const rp = path.resolve(prefix, module);

    // 获取文件内容
    const content = readFile(rp);
    response.setHeader('Content-Type', 'application/javascript');
    response.write(rewriteImport(content));
  } else if (url.endsWith('.css')) {
    const rp = path.resolve(__dirname, url.slice(1));
    const content = readFile(rp);
    const body = `
const css = "${content.replace(/\n/g, '')}";
const style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = css;
document.head.appendChild(style);
export default css;
    `;
    response.setHeader('Content-Type', 'application/javascript');
    response.write(body);
  } else if (url.indexOf('.vue') >= 0) {
    // vue文件 .vue?t=xxs
    const p = path.resolve(__dirname, url.split('?')[0].slice(1));
    const { descriptor } = sfcCompiler.parse(readFile(p));
    const query = queryStringToObject(url);

    if (!query.type) {
      response.setHeader('Content-Type', 'application/javascript');
      response.write(`
      ${rewriteImport(descriptor.script.content.replace('export default ', 'const __script =  '))}
import { render as __render } from '${url}?type=template';
__script.render = __render;
export default __script;
      `);
    } else if (query.type === 'template') {
      // 模板内容
      const template = descriptor.template;
      const render = domCompiler.compile(template.content, { mode: 'module' }).code;
      response.setHeader('Content-Type', 'application/javascript');
      response.write(rewriteImport(render));
    }
  }
  response.end()
});
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  console.log("node serve is running ...");
})

function rewriteImport(content) {
  // from 前面一定要有空格！！！！，不然会把其他from例如opt.from 给重写了...
  return content.replace(/ from ['|"]([^'"]+)['|"]/g, (s0, s1) => {
    if (s0 !== '.' && s1[1] !== '/') {
      // 非相对路径，进行重写
      return ` from '/@modules/${s1}'`;
    }
    return s0;
  })
}

function readFile(path) {
  return fs.readFileSync(path, 'utf-8');
}

function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (style && !(style instanceof HTMLStyleElement)) {
    removeStyle(id);
    style === undefined;
  }

  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = content;
    document.head.appendChild(style);
  } else {
    style.innerHTML = content;
  }

  sheetsMap.set(id, style);
}

function removeStyle(id) {
  let style = sheetsMap.get(id);
  if (style) {
    if (style instanceof CSSStyleSheet) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== style);
    } else {
      document.head.removeChild(style);
    }
    sheetsMap.delete(id);
  }
}

function queryStringToObject(url) {
  return [...new URLSearchParams(url.split('?')[1])].reduce(
    (a, [k, v]) => ((a[k] = v), a), {}
  )
}