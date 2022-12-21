const { Group, mergeGroups } = require('./group');
const { Class } = require('./class');
//const Data = require('./jsonParams.json');

const express = require('express');

let Data;
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/users', (req, res) => {
  const users = [{ name: 'Bob' }, { name: 'Alice' }];
  res.json(users);
});

app.post('/api',jsonParser, async function (req, res) {
    var body = req.body;
    console.log(body);
    console.log("start calculating...")
    Data = body;

    await main();

    return res.send(makeResult());
});

app.listen(3000, () => {
  console.log('API listening on port 3000');
});


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

let totalScore = 0;
const resultJson = [];

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

let maxClasses = [];

async function main() {

    const maxNumInClass = Data.maxNumInClass;
    for (let i = 1; i <= Data.NumClasses; i++) {
        classes[i] = new Class(i, maxNumInClass);
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



        let length = tempStudents.length;
        for (let i = 0; i < length; i++) {
            let std = tempStudents.shift();

            // is in "with" - to the start of the array
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

    // for (let gr of groups) {
    //     if (gr != undefined)
    //         console.log("groupID: " + gr.id + ", sum: " + gr.students.length);
    // }

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
    console.log("All exist? " + flag);

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

    // for (let cls of classes) {
    //     if (cls != undefined)
    //         console.log(cls.id, cls.students.length, cls.percentBoys, cls.averageHev, cls.averageLim)
    // }

    

    let promises = [];
    for (let times = 0; times < 1000000000; times++) {
        let newCls = clonedClasses(classes);
        let newGr = clonedGroups(groups);

        promises.push(processCalc(newCls, newGr));
    }
    await Promise.all(promises);
    console.log("the best option is :")
    for (let cls of maxClasses) {
        if (cls != undefined)
            console.log(cls.id, cls.students.length, cls.percentBoys, cls.averageHev, cls.averageLim)
    }

}
/**
 * 
 * @param {Class[]} classes 
 * @param {Group[]} groups 
 */
async function processCalc(classes, groups) {
    let counter = 0;
    // console.log(classes.length)
    // console.log(groups.length)
    for (let indexGroup = 1; indexGroup <= groups.length; indexGroup++) {
        let savedNum = [];

        let success;
        do {
            if (savedNum.length === classes.length - 1)
                return;

            let randNum = randomNum(1, classes.length);
            while (savedNum.includes(randNum)) {
                randNum = randomNum(1, classes.length);
            }
            savedNum.push(randNum);


            if (!groups[indexGroup]) {
                success = true;
            } else {
                
                try {
                    success = classes[randNum].addGroup(groups[indexGroup]);
                } catch (error) {
                    console.log(classes[randNum]?.id);
                }
            }


        } while (!success)

    }

    // for (let cls of classes) {
    //     if (cls != undefined)
    //         console.log(cls.id, cls.students.length, cls.percentBoys, cls.averageHev, cls.averageLim)
    // }

    // give score
    for (let clsIndex = 1; clsIndex < classes.length; clsIndex++) {
        // count choices executed in class
        let count = 0;
        let cls = classes[clsIndex];
        //for (let choice of cls.choices) {
        for (let choice of cls.choices) {
            for (let std of cls.students) {
                if (choice === std.auid)
                    count++;
            }
        }

        if (count / cls.students.length >= 0.8)
            cls.overallScore += 7;

        if (cls.percentBoys < 60 && cls.percentBoys > 40)
            cls.overallScore += 10;

        if (cls.averageHev >= 2 && cls.averageHev <= 3)
            cls.overallScore += 6;

        if (cls.averageLim >= 2 && cls.averageLim <= 3)
            cls.overallScore += 3;

    }
    let tempScore = 0;
    for (let clIndex = 1; clIndex < classes.length; clIndex++) {
        tempScore += classes[clIndex].overallScore;
    }
    if (tempScore > totalScore) {
        totalScore = tempScore;
        maxClasses = classes;
    }
}

function randomNum(min, max) {
    return Math.ceil(Math.random() * (max - min));
}

/**
 * 
 * @param {Class[]} classes 
 */
function clonedClasses(classes) {
    let cls = [];
    for (let index = 1; index < classes.length; index++){
        cls[index] = classes[index].makeClone();
    }
    return cls;
}

/**
 * 
 * @param {Group[]} groups 
 */
function clonedGroups(groups) {
    let grs = [];
    for (let index = 1; index < groups.length; index++){
        if (groups[index])
            grs[index] = groups[index].makeClone();
    }
    return grs;
}

//main();

function makeResult() {

    let result = [];
    for (let index = 1; index < maxClasses.length; index++) {
        let cls = maxClasses[index];
        for (let std of cls.students){
            result.push({
                "auid": std.auid,
                "class" : index
            })
        }
    }

    return {
        "result" : result,
        length : result.length
    };
}