export function createRouteMap(routes) {
  const pathMap = Object.create(null);
  routes.forEach(route => {
    addRouteRecord(pathMap, route);
  })

  return {
    pathMap
  }
}

// route
// {
//   path: "/foo",
//   component: "<div></div>"
// }

function addRouteRecord(pathMap, route) {
  const record = {
    path: route.path,
    component: route.component,
    regex: "",
  }

  if (!pathMap[record.path]) {
    pathMap[record.path] = record;
  }
}