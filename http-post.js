import http from 'k6/http';
import {check } from 'k6';


export default function () {

    const credentials = {
        username: 'testuser'+ Date.now(),
        password: 'testpassword',
    };


    let res;
        res = http.post('http://localhost:3001/user/register/', JSON.stringify(credentials), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        check(res, {
            'is status 201': (r) => r.status === 201,
            'is body not empty': (r) => r.body.length > 0,
        });

    console.log(`Response body: ${res.body}`);

    let loginRes;
    loginRes = http.post('http://localhost:3001/auth/token/login/', JSON.stringify({
        username: credentials.username,
        password: credentials.password
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log(`Login Response body: ${loginRes.body}`);
    check(loginRes, {
        'is status 200 for login': (r) => r.status === 200,
        'is body not empty for login': (r) => r.body.length > 0,
    });
    const accessToken = loginRes.json().access;
    console.log(`Access Token: ${accessToken}`);


    let myCrocodiles = http.get('http://localhost:3001/my/crocodiles/', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    console.log(`My Crocodiles Response body: ${myCrocodiles.body}`);
    check(myCrocodiles, {
        'is status 200 for my crocodiles': (r) => r.status === 200,
        'is body not empty for my crocodiles': (r) => r.body.length > 0,
    });

}