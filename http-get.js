import http from 'k6/http';
import { check } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


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
console.log(`Response body of all crocodiles: ${res.body}`);
    const crocodileIds = crocodiles.map(item => item.id)

    const crocodileId = randomItem(crocodileIds);
    console.log(`Randomly selected crocodile ID: ${crocodileId}`);
    //const crocodileId = crocodiles[0].id;
    console.log(`Crocodile IDs: ${crocodileIds}`);
    
    const crocodileName = crocodiles.filter(crocodile => crocodile.id === crocodileId)[0].name;
    console.log(`Crocodile Name in     const crocodileName = crocodiles[crocodileId].name: ${crocodileName}`);
    res = http.get(`http://localhost:3001/public/crocodiles/${crocodileId}`);  
    console.log(`Response body: ${res.body}`);
    console.log(`header: ${res.headers['Content-Type']}`);
    console.log(`Crocodile Name in ${res.json().name}: ${res.json().name}`);

    check(res, {
        'is status 200 for crocodile': (r) => r.status === 200,
        [`is is ${crocodileId} crocodile`]: (r) => r.json().id === crocodileId,
        [`name is ${crocodileName}`]: (r) => r.json().name === crocodileName,

    });

}