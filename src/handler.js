//constants -> method, url, GET, POST

const hasOnlyHandler = function (req, route) {
  return !(route.hasOwnProperty("method") && route.hasOwnProperty("url"));
};

const isMatching = function (req, route) {
  if (hasOnlyHandler(req, route)) return true; //for middlewares like logRequest
  return req.url === route.url && req.method === route.method;
};

class WebFramework {
  constructor() {
    this.routes = [];
    this.middlewareCount = 0;
    this.middlewareCount;
  }

  use(handler) {
    this.routes.push({ handler });
    this.middlewareCount++;
  }

  get(url, handler) {
    this.routes.push({ method: "GET", url, handler });
  }

  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }

  error(handler) {
    this.errorHandler = handler;
  }

  handleRequest(req, res) {
    const matchingRoutes = this.routes.filter(isMatching.bind(null, req));
    
    if (matchingRoutes.length === this.middlewareCount) {
      this.errorHandler(req, res);
    }
    
    matchingRoutes.forEach(route => route.handler(req, res));
    return;
  }
}

module.exports = WebFramework;
