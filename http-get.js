import http from 'k6/http';
import {check } from 'k6';


export default function () {
    let res = http.get('http://localhost:3001/public/crocodiles/');   
    const crocodiles = res.json();
    //console.log(`Response status: ${res.status}`);
    //console.log(`Response body: ${res.body}`);
    check(res, {
        'is status 200': (r) => r.status === 200,
        'is content-type application/json': (r) => r.headers['Content-Type'] === 'application/json',
        'is response body not empty': (r) => r.body.length > 0,
    });

    const crocodileId = crocodiles[0].id;
    const crocodileName = crocodiles[0].name;
    res = http.get(`http://localhost:3001/public/crocodiles/${crocodileId}`);  
    console.log(`Response body: ${res.body}`);
    console.log(`header: ${res.headers['Content-Type']}`);

    check(res, {
        'is status 200 for crocodile 7': (r) => r.status === 200,
        [`name is ${crocodileName}`]: (r) => r.json().name === crocodileName,
    });

}