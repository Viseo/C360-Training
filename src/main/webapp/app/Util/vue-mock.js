/**
 * Created by CLH3623 on 05/04/2017.
 */
Vue.use(VueResource);

let routes = [
    {
        method: 'POST',
        url: 'api/sessionstoremove',
        response: []
    },
    {
        method: 'POST',
        url: 'api/formations',
        response: [
            {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            }
        ]
    },
    {
        method: 'GET',
        url: 'api/formations',
        response: [
            {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            {
                "id": 6,
                "version": 0,
                "trainingTitle": "FORMATION2",
                "numberHalfDays": 2,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            {
                "id": 7,
                "version": 0,
                "trainingTitle": "JAVA",
                "numberHalfDays": 3,
                "topicDescription": {"id": 4, "version": 0, "name": "C++"}
            }
        ]
    },
    {
        method: 'GET',
        url: 'api/themes',
        response: [
            {id: "2", version: "0", name: "PROGRAMMATION"}
        ]
    },
    {
        method: 'GET',
        url: 'api/formations/5/sessions',
        response: [
            {
                "id": 7,
                "version": 0,
                "trainingDescription": {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                },
                "beginning": "15/04/2017",
                "ending": "15/04/2017",
                "beginningTime": "09:00",
                "endingTime": "18:00",
                "location": "Salle Escale"
            }, {
                "id": 8,
                "version": 0,
                "trainingDescription": {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                },
                "beginning": "18/05/2017",
                "ending": "18/05/2017",
                "beginningTime": "09:00",
                "endingTime": "18:00",
                "location": "Salle Bali"
            }
        ]
    },{
        method: 'GET',
        url: 'api/formations/6/sessions',
        response: []
    },
    {
        method: 'GET',
        url: 'api/sendtoken',
        response: [
            {status: "200"}
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
            {userConnected: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg"}
        ]
    },
    {
        method: 'POST',
        url: "api/userdisconnect",
        response: [
            {userConnected: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg"}
        ]
    },
    {
        method: 'POST',
        url: 'api/collaborateurs',
        response: [
            {
                id: 1,
                version: 0,
                personnalIdNumber: "AAA1234",
                lastName: "DUPONT",
                firstName: "ERIC",
                email: "eric.dupont@viseo.com",
                password: "123456"
            },
            {
                id: 2,
                version: 0,
                personnalIdNumber: "BBB1234",
                lastName: "Cot",
                firstName: "Harry",
                email: "harrycot@viseo.com",
                password: "123456"
            }
        ]
    }, {
        method: 'GET',
        url: 'api/collaborateurs',
        response: [
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
        url: 'api/requests',
        response: {status:"ok"}
    },
    {
        method: 'GET',
        url: 'api/formations/5/alreadyrequestedsession/2',
        response: [
            {
                "id": 8,
                "version": 0,
                "trainingDescription": {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                },
                "beginning": "18/05/2017",
                "ending": "18/05/2017",
                "beginningTime": "09:00",
                "endingTime": "18:00",
                "location": "Salle Bali"

            }
        ]
    },
    {
        method: 'POST',
        url: 'api/themes',
        response: {}
    },
    {
        method: 'POST',
        url: 'api/user',
        response: {id: "2", version: "0", name: "PROGRAMMATION"}
    },
    {
        method: 'POST',
        url: 'api/removetopic',
        response: {id: "2", version: "0", name: "PROGRAMMATION"}
    },
    {
        method: 'POST',
        url: 'api/removetraining',
        response: {"id": 3, "version": 0, "name": "C"}
    },
    {
        method: 'POST',
        url: 'api/sessions',
        response: {
            "id": 6,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "12/05/2017",
            "ending": "12/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        }
    },
    {
        method: 'PUT',
        url: 'api/sessions',
        response: {
            "id": 6,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "13/05/2017",
            "ending": "13/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        }
    },
    {
        method: 'PUT',
        url: 'api/formations/HELLO/formationid/5',
        response: {
            "id": 5,
            "version": 0,
            "trainingTitle": "HELLO",
            "numberHalfDays": 1,
            "topicDescription": {"id": 3, "version": 0, "name": "C"}
        }
    },
    {
        method: 'PUT',
        url: 'api/sessions/15/15,10,18,4,4/collaborators',
        response: [{
            "id": 15,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "13/05/2017",
            "ending": "13/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        }]
    },
    {
        method: 'GET',
        url: 'api/sessions',
        response : [{
            "id": 6,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "13/05/2017",
            "ending": "13/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        }]
    },
    {
        method: 'GET',
        url: 'api/requests/session/6/collaborators',
        response: [
            {
                "email": "eric.dupon@viseo.com",
                "firstName": "Eric",
                "id": 5,
                "lastName": "Dupond",
                "password": "123456",
                "version": 0
            }
        ]
    },
    {
        method: 'GET',
        url: 'api/sessions/6/collaborators',
        response: [
            {
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 5,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            }
        ]
    },
    {
        method: 'GET',
        url: 'api/formations/sessions',
        response: [
            {   "id":3,
                "version":0,
                "trainingTitle":"SWIFT",
                "numberHalfDays":4,
                "topicDescription":{"id":1,"version":0,"name":"MOBILE"}
            }
        ]
    },
    {
        method: 'GET',
        url: 'api/formations/sessions/collaborators',
        response: [
            {   "id":4,
                "version":0,
                "trainingDescription":
                    {"id":3,"version":0,"trainingTitle":"SWIFT","numberHalfDays":4,"topicDescription":
                        {"id":1,"version":0,"name":"MOBILE"}
                    },"beginning":"19/05/2017","ending":"21/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bora Bora","collaborators":[]},
            {"id":5,"version":0,"trainingDescription":{"id":3,"version":0,"trainingTitle":"SWIFT","numberHalfDays":4,"topicDescription":{"id":1,"version":0,"name":"MOBILE"}},
                "beginning":"26/05/2017","ending":"28/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bastille","collaborators":[]
            }
        ]
    },
    {
        method: 'GET',
        url: 'api/wish/1',
        response: [
            {"id":10, "version":0,"label":"SSS","collaborator":{"id":5,"version":0,"personnalIdNumber":"BBB1234","lastName":"nrjek","firstName":"rnrejk","email":"mxzsdef@163.com","password":"123456","isAdmin":false},"vote_ok":null,"vote_ko":null,"checked":false},
            {"id":11,"version":0,"label":"SSSFFF","collaborator":{"id":5,"version":0,"personnalIdNumber":"BBB1234","lastName":"nrjek","firstName":"rnrejk","email":"mxzsdef@163.com","password":"123456","isAdmin":false},"vote_ok":null,"vote_ko":null,"checked":true}
        ]
    },
    {
        method: 'POST',
        url: 'api/wish/1',
        response: [{
            "id": 1,
            "version": 0,
            "ischecked": "false",
            "label": "PHP",
            "collaborator_id": 1,
        },
        ]
    },
    {
        method: 'PUT',
        url: 'api/okwishtoupdate/1',
        response: [{   "id":2,
            "version":5,
            "label":"SSC",
            "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
            "vote_ok":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],
            "vote_ko":[],
            "checked":false}]
    },
    {
        method: 'PUT',
        url: 'api/kowishtochange/1',
        response: {   "id":2,
            "version":5,
            "label":"SSC",
            "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
            "vote_ok":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],
            "vote_ko":[],
            "checked":false}
    },
    {
        method: 'PUT',
        url: 'api/kowishtoupdate/1',
        response: [
            {   "id":2,
                "version":5,
                "label":"SSC",
                "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
                "vote_ok":[],
                "vote_ko":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],
                "checked":false}
        ]
    },
    {
        method: 'PUT',
        url: 'api/okwishtochange/1',
        response: [
            {   "id":2,
                "version":5,
                "label":"SSC",
                "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
                "vote_ok":[],
                "vote_ko":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],
                "checked":false}
        ]
    },
    {
        method: 'GET',
        url: 'api/listrequests/6/2',
        response:[{
            "collaboratorIdentity" : {
                "email":"eric.dupont@viseo.com",
                "firstName":"Eric",
                "id":2,
                "lastName":"Dupont",
                "password":"123456",
                "version":0
            },
            "doesNotMatter":false,
            "id":7,
            "trainingDescription":{
                "id":3,
                "numberHalfDays":2,
                "topicDescription":{
                    "id":2,
                    "name":"WEB",
                    "version":0
                },
                "trainingTitle":"PHP1",
                "version":0
            },
            "trainingSessionsDescriptions": [{
                "beginning":"26/05/2017",
                "beginningTime":"09:00",
                "collaborators":[],
                "ending":"26/05/2017",
                "endingTime":"18:00",
                "id":4,
                "location":"Salle Bora Bora",
                "trainingDescription": {
                    "id":3,
                    "numberHalfDays":2,
                    "topicDescription":{
                        "id":2,
                        "name":"WEB",
                        "version":0
                    },
                    "trainingTitle":"PHP1",
                    "version":0
                }
            }],
            "version":0
        }]
    },
    {
        method: 'GET',
        url: 'api/getcollaborator/1',
        response: [
            {
                "email":"eric.dupont@viseo.com",
                "admin":false,
                "businessUnit":null,
                "firstName":"Eric",
                "function":null,
                "id":1,
                "isAdmin":false,
                "lastName":"DUPONT",
                "password":"123456",
                "personnalIdNumber":"AAB1234",
                "version":0
            }
        ]
    },
    {
        method: 'PUT',
        url: 'api/updatecollaborator',
        response: []
    },

    {
        method: 'GET',
        url: 'api/allwishes',
        response: [
            {"id":98,"version":0,"label":"JAVASCRIPT","collaborator":{"id":8,"version":0,"personnalIdNumber":"POP1234","lastName":"Batista","firstName":"Benjamin","email":"benjamin.batista@viseo.com","password":"bibimbaps","isAdmin":false},"vote_ok":[],"vote_ko":[],"checked":null},
            {"id":93,"version":4,"label":"PHP","collaborator":{"id":8,"version":0,"personnalIdNumber":"POP1234","lastName":"Batista","firstName":"Benjamin","email":"benjamin.batista@viseo.com","password":"bibimbaps","isAdmin":false},"vote_ok":[],"vote_ko":[],"checked":null}
            ]
    },
    {
        method: 'POST',
        url: 'api/ischeckedwishestoupdate',
        response:[
            {"id":98,"version":0,"label":"JAVASCRIPT","collaborator":{"id":8,"version":0,"personnalIdNumber":"POP1234","lastName":"Batista","firstName":"Benjamin","email":"benjamin.batista@viseo.com","password":"bibimbaps","isAdmin":false},"vote_ok":[],"vote_ko":[],"checked":true},
            {"id":93,"version":4,"label":"PHP","collaborator":{"id":8,"version":0,"personnalIdNumber":"POP1234","lastName":"Batista","firstName":"Benjamin","email":"benjamin.batista@viseo.com","password":"bibimbaps","isAdmin":false},"vote_ok":[],"vote_ko":[],"checked":false}
        ]
    }
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
