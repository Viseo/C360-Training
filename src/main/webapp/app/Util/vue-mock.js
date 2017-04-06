/**
 * Created by CLH3623 on 05/04/2017.
 */
Vue.use(VueResource);

let routes = [
    {
        method: 'GET',
        url: 'api/themes',
        response: [
            {id:"2",version:"0",name:"PROGRAMMATION"}
        ]
    },
    {
        method: 'GET',
        url: 'api/sendtoken',
        response: [
            {status:"200"}
        ]
    },
    {
        method: 'POST',
        url: "api/user",
        response: [
            { userConnected:"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg"}
        ]
    },
    {
        method: 'POST',
        url: 'api/collaborateurs',
        response: [
            {}
        ]
    },
    {
        method: 'POST',
        url: 'api/themes',
        response: {id:"2",version:"0",name:"PROGRAMMATION"}
    },
    {
        method: 'POST',
        url: 'api/user',
        response: {id:"2",version:"0",name:"PROGRAMMATION"}
    },
    {
        method: 'GET',
        url: 'api/formations',
        response: {id:"2",version:"0",name:"PROGRAMMATION"}
    },

];