const fetch = require("node-fetch")

let data = {
    "test": "hello world"
}

fetch('http://localhost:3000/api',{
	method:'POST',
  	headers:{
    	'content-type': 'application/json'
    },
  	body: JSON.stringify(data)
})
.then(res=> res.json())
.then(data => console.log(data))