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
    /*{
     method: 'POST',
     url: 'api/sendtoken',
     response: [
     {status:"200"}
     ]
     },*/
    {
        method: 'POST',
        url: "api/user",
        response: [
            { userConnected:"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg"}
        ]
    },
    {
        method: 'POST',
        url: "api/userdisconnect",
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
    }, {
        method: 'GET',
        url: 'api/collaborateurs',
        response:
            [
                {
                    id: 1,
                    version: 0,
                    lastName: "DUPONT",
                    firstName: "ERIC",
                    email: "eric.dupont@viseo.com",
                    password: "123456"
                },
                {
                    id: 2,
                    version: 0,
                    lastName: "Cot",
                    firstName: "Harry",
                    email: "harrycot@viseo.com",
                    password: "123456"
                }
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

var mock = {
    value_: '',

    get cookie() {
        return this.value_;
    },

    set cookie(value) {
        this.value_ += value + ';';
    }
};
