import { createRouteMap } from './create-route-map';

export function createMatcher (routes, router) {

  const { pathMap } = createRouteMap(routes);

  /**
   * 路由匹配
   * @param {*} raw 将要跳转的路由
   * @param {*} currentRoute 当前路由
   * @returns 
   */
  function match(raw, currentRoute) {
    const location = normalizeLocation(raw, currentRoute, false, router)
    const path = location.path;
    if (pathMap[path]) {
      const record = pathMap[path];
      // 匹配到路由
      return _createRoute(record, location)
    }

    // 没有匹配到路由
    return _createRoute(null, location);
  }

  function _createRoute(record, location) {
    // 创建路由Route

    // 实际上VueRouter这里还需要做一些工作，比如重定向的处理等等

    // 返回创建好的路由对象
    return createRoute(record, location)
  }

  return {
    match
  }
}

function normalizeLocation(raw, current, append, router) {
  return {
    path: (current && current.path) || '/',
    query: {},
    hash: raw.hash
  }
}


export function createRoute(record, location) {

  // 在vueRoute中，这里还会做一些工作，比如重定向、路由参数等处理

  return {
    // 路径
    path: record.path || '/',
    hash: location.hash,
    // 完整路径
    fullPath: getFullPath(location),
    // 当前路由的所有上级路由
    matched: record ? formatMatch(record) : []
  }
}

function getFullPath({ path, query = {}, hash = '' }) {
  return (path || '/') + hash;
}

function formatMatch(record) {
  const res  = [];
  while(record) {
    res.unshift(record);
    record = record.parent;
  }
  return res;
}