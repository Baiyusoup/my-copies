function Complier(node, vm) {
  if (node.nodeType === 1) {
    let attrs = node.attributes;
    for(let attr of attrs) {
      if (attr.nodeName === 'v-model') {
        let name = attr.nodeValue;
        node.addEventListener('input', e => {
          vm[name] = node.value;
        })
        node.value = vm[name];
        node.removeAttribute('v-model');
      }
    }

  }
  // 节点类型
  if (node.nodeType === 3) {
    if (/\{\{(.*)\}\}/.test(node.textContent)){
      let name = RegExp.$1;
      name = name.trim();
      node.nodeValue = vm[name];
      new Watcher(vm, node, name);
    }
  }
}


function Watcher(vm, node, name) {
  Dep.target = this;
  this.name = name;
  this.node = node;
  this.vm = vm;
  this.update();
  Dep.target = null;
}

Watcher.prototype = {
  update: function() {
    this.get();
    this.node.nodeValue = this.value;
  },
  get: function() {
    this.value = this.vm[this.name];
  }
}

function Dep() {
  this.subs = [];
}
Dep.prototype = {
  // 添加watcher
  addSub: function(sub) {
    this.subs.push(sub);
  },

  // 通知所有订阅该key的watcher进行更新
  notify: function() {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
}


function defineReactive(data, key, value) {
  // 收集依赖
  const dep = new Dep();
  // 通过递归处理value为对象的情况
  Observe(value);

  // 重写key，让key改变时能够及时通知watcher
  Object.defineProperty(data, key, {
    get: function() {
      // 收集watcher
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set: function(newValue) {
      value = newValue;
      // value发生改变，通知所有watcher
      dep.notify();
    }
  })
}


function Observe(data) {
  if (!data || typeof data !== 'object') return;

  // 遍历dta，对每个属性进行响应式
  Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
};


function nodeToFragment(node, vm) {
  let fragment = document.createDocumentFragment();
  let child;
  while((child = node.firstChild)) {
    Complier(child, vm);
    fragment.appendChild(child);
  }
  return fragment;
}

function Vue(options) {
  let data = this.data = options.data();
  // 对数据进行响应式处理
  Observe(data, this);
  let id = options.el;
  const app = document.querySelector(id);
  let dom = nodeToFragment(app, data);
  app.appendChild(dom);
}