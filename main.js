const { exit } = require('process');
const { Group, mergeGroups } = require('./group');
const { Class } = require('./class');
const Data = require('./jsonParams.json');
const { Worker } = require('worker_threads');


//console.log(Data);

const tempStudents = [
    {
        "tz": "",
        "uNum": "",
        "auid": "",
        "title": "",
        "mCnstrains": {
            "with": [
                {
                    "with": "RPmmkBJrHG9Aw5f5JTD2MPDXVT9F3Sq7"
                },
                {
                    "with": "EavCKXxrvRFSwIUAGgmUC1PD9WkWwCW6"
                }
            ],
            "bans": [
                {
                    "with": "nFSyPZ3X5NO56TEgm4eg6nTm9fQPtbvX"
                }
            ]
        },
        "assChoices": {
            "choices": [
                "FU3Tdj1EijaEcH6ftyuWljTKwK6Wn3pV",
            ]
        },
        "eqFields": {
            "gender": "נקבה",
            "scl": "חטיבת המדגימין",
            "limudi": "בינונית",
            "hev": "בינונית"
        }
    }
];
tempStudents.pop();
const students = [];
const groups = [];
const classes = [];
const maxNumInClass = Data.maxNumInClass;

global.structuredClone = (val) => JSON.parse(JSON.stringify(val))

for (let i = 1; i <= Data.NumClasses; i++) {
    classes[i] = new Class(i);
}

// copy students from data
Data["allData"].forEach(element => {
    tempStudents.push(element);
});

let countIDs = 1;
while (tempStudents.length !== 0) {
    let student1 = tempStudents.shift();

    // initialize GroupID (default: make new number)
    student1.GroupID = student1.GroupID ? student1.GroupID : countIDs++;

    if (groups[student1.GroupID] === undefined) {
        groups[student1.GroupID] = new Group(student1.GroupID);
        groups[student1.GroupID].addStudent(student1);
    }
    else {
        groups[student1.GroupID].addStudent(student1);
    }

    // let studentMust = student1["mCnstrains"]["with"].map(element => element["with"]);
    // let studentMustNot = student1["mCnstrains"]["bans"].map(element => element["with"]);
    //console.log(studentMust);

    let length = tempStudents.length;
    for (let i = 0; i < length; i++) {
        let std = tempStudents.shift();

        // is in "with" - to the start of the array
        // if (studentMust.includes(std["auid"])) {
        if (groups[student1.GroupID].with.includes(std["auid"])) {
            if (groups[student1.GroupID].bans.includes(std["auid"])) {
                throw new Error('student found in "with" and "bans" of the same group');
            }
            std.GroupID = student1.GroupID;
            tempStudents.unshift(std);
        }
        // is not in "with" - to the end of the array
        else {
            tempStudents.push(std);
        }
    }
    // save the changes to another array
    students.push(student1);
}
// for (let std of students) {
//     console.log(std.GroupID);
// }
//console.log("countIDs: " + countIDs);

for (let gr of groups) {
    if (gr != undefined)
        console.log("groupID: " + gr.id + ", sum: " + gr.students.length);
}

// check all existing
let flag = true;
let innerFlag = false;
for (let std of students) {
    innerFlag = false;
    for (let stdOriginal of Data["allData"])
        if (std["auid"] === stdOriginal["auid"])
            innerFlag = true;
    if (!innerFlag)
        flag = false
}
console.log(flag);

// console.log(groups[1].choices)
// console.log(groups[2].choices)

// let gr3 = mergeGroups(groups[1], groups[2], maxNumInClass);
// if (gr3 !== undefined){
//     delete groups[1];
//     delete groups[2];
// // }
// console.log(gr3.choices);

// pinned groups to class
for (let indexGroup = 1; indexGroup <= groups.length; indexGroup++) {
    if (groups[indexGroup] == undefined) continue;

    for (let std of groups[indexGroup].students) {
        if (std.classLocked == 1) {
            classes[std.class].addGroup(groups[indexGroup])
            groups[indexGroup] = undefined;
            break;
        }
    }
}

// classes[0] = structuredClone(classes[2]);
// classes[2].id = 98;
for (let cls of classes) {
    if (cls != undefined)
        console.log(cls.id, cls.students.length, cls.percentBoys, cls.averageHev, cls.averageLimudi)
}


for (let times = 0; times < 20; times++) {
    
    
    
}


function scoreOrder() { }