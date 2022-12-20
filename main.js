const fs = require('fs').promises;

console.log("hi")

async function loadData(){
    let dataJson = await fs.readFile("jsonParams.json");
    let data = JSON.parse(dataJson);
    return data;
}


async function main(){
    let data = await loadData();
    console.log(data["allData"][0]["title"]);



}
main();