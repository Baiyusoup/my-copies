type Methods = 'GET' | 'POST';
type Dictionary<T> = { [key: string]: T }
type AjaxConfig = {
  url: string,
  method: Methods,
  params?: Dictionary<string>,
  data?: Dictionary<string|Blob|any>,
  headers?: Dictionary<any>,
  withCredentials?: boolean,
  onSuccess: Function,
  onFail: Function,
  onProgress?: Function,
  onAbort?: Function
}
interface AjaxProgressEvent extends ProgressEvent {
  percent: number
}

export default function ajax(options: AjaxConfig) {
  const XHR = new XMLHttpRequest();
  XHR.onload = handleSuccess;
  XHR.onerror = handleError;
  XHR.onprogress = handleProgress;

  if (options.method.toLocaleLowerCase() === 'get') {
    options.url = encodeParams(options.url, options.params);
  }

  XHR.open(options.method, options.url);

  if (options.headers) {
    Object.keys(options.headers).forEach(key => {
      XHR.setRequestHeader(key, options.headers[key]);
    })
  }

  if (options.withCredentials && 'withCredentials' in XHR) {
    XHR.withCredentials = true
  }

  if (options.method.toLocaleLowerCase() === 'post') {
    XHR.send(serializeData(options.data));
  } else {
    XHR.send(null);
  }

  function handleSuccess() {
    if ((XHR.status >= 200 && XHR.status < 300) || XHR.status === 304) {
      options.onSuccess(getBody(XHR))
    } else {
      options.onFail(getError(XHR))
    }
  }

  function handleProgress(evt: ProgressEvent<EventTarget>) {
    // evt.total 总共的数据量
    // evt.loaded 已传输的数据量
    if (evt.total > 0) {
      (evt as AjaxProgressEvent).percent = evt.loaded / evt.total * 100;
    }
    options.onProgress && options.onProgress(evt);
  }

  function handleError() {
    options.onFail(getError(XHR));
  }
}

function encodeParams(url: string, params: Dictionary<string>): string {
  let str = url + '?';
  Object.keys(params).forEach(key => {
    url += `${key}&${encodeURIComponent(params[key])}`;
  })
  return str;
}

function serializeData(data: Dictionary<string|Blob>) {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  })
  return formData;
}

function getBody(xhr: XMLHttpRequest) {

}

function getError(xhr: XMLHttpRequest) {

}