import http from 'k6/http';
import { check } from 'k6';
import {sharedArray} from 'k6/data';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// const userCredentials = new sharedArray('credentials', function () {
//     let data;
//     try {
//         data = JSON.parse(open('./users.json'));
//     } catch (e) {
//         console.error('Could not open or parse users.json:', e);
//         data = { users: [] };
//     }
//     return Array.isArray(data.users) ? data.users : [];
// })

export default function () {

    const credentials = {
        username: 'testuser' + randomString(5),
        password: 'testpassword' + randomString(5),
    };

    //console.log('User Credentials:', userCredentials)
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

    let createCrocodile = http.post('http://localhost:3001/my/crocodiles/', JSON.stringify({
        name: 'Crocodile ' + Date.now(),
        sex: 'M',
        date_of_birth: '2020-01-01',
    }), {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    console.log(`Create Crocodile Response body: ${createCrocodile.body}`);
    check(createCrocodile, {
        'is status 201 for create crocodile': (r) => r.status === 201,
        'is body not empty for create crocodile': (r) => r.body.length > 0,
    });

    let crocodileId = createCrocodile.json().id;
    console.log(`Created Crocodile ID: ${crocodileId}`);
    let crocodileDetails = http.get(`http://localhost:3001/my/crocodiles/${crocodileId}/`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    console.log(`Crocodile Details Response body: ${crocodileDetails.body}`);
    check(crocodileDetails, {
        'is status 200 for crocodile details': (r) => r.status === 200,
        'is body not empty for crocodile details': (r) => r.body.length > 0,
    });


    let updateCrocodile = http.put(`http://localhost:3001/my/crocodiles/${crocodileId}/`, JSON.stringify({
        name: 'Crocodile ' + Date.now()+1,
        sex: 'M',
        date_of_birth: '2020-01-01',
    }), {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    console.log(`Update Crocodile Response body: ${updateCrocodile.body}`);
    check(updateCrocodile, {
        'is status 200 for update crocodile': (r) => r.status === 200,
        'is body not empty for update crocodile': (r) => r.body.length > 0,
    });

    const deleteCrocodile = http.del(`http://localhost:3001/my/crocodiles/${crocodileId}/`, null, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    console.log(`Delete Crocodile Response body: ${deleteCrocodile.body}`);
    check(deleteCrocodile, {
        'is status 204 for delete crocodile': (r) => r.status === 204,
        'is body empty for delete crocodile': (r) => r.body === null,
    });
    console.log(`Crocodile with ID ${crocodileId} deleted successfully.`);

}