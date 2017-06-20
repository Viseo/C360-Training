/**
 * Created by SJO3662 on 01/06/2017.
 */
Vue.use(VueResource);

var interceptors = [];
Vue.http.interceptors.unshift((request, next) => {
        next(
            request.respondWith(
                {status: 404, statusText: '360 Not found!'}
            )
        );
});

function clearRequests() {
    interceptors.forEach(interceptor => {
        let index = Vue.http.interceptors.indexOf(interceptor);
        if(index >= 0){
            Vue.http.interceptors.splice(index,1);
        }
    });
    interceptors = [];
}

function prepareRequest(method, url, status, response){
    let interceptor = (request, next) => {
        if (request.method === method && request.url === url ){
            let result = request.respondWith(
                response,
                {status: status}
            );
            result.data = result.body;
            next(
                result
            );
        }
    };
    interceptors.push(interceptor);
    Vue.http.interceptors.push(interceptor);
}
