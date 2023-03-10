class Group {
    id = 0;
    students = [];
    bans = [];
    with = [];
    choices = [];
    executedChoices = 0;
    removedChoices = 0;


    constructor(id) {
        this.id = id;
    }

    addStudent(elem) {
        this.students.push(elem);

        elem["mCnstrains"]["bans"].forEach(banObj => {
            if (!this.bans.includes(banObj["with"]))
                this.bans.push(banObj["with"]);
        });

        elem["mCnstrains"]["with"].forEach(withObj => {
            if (!this.with.includes(withObj["with"]))
                this.with.push(withObj["with"]);
        });

        elem["assChoices"]["choices"].forEach(auid => {
            if (!this.choices.includes(auid))
                if (auid != "")
                    this.choices.push(auid);
            
        });

    }

    makeClone() {
        let cloned = new Group(this.id);
        
        cloned.students = this.students;
        cloned.with = this.with;
        cloned.bans = this.bans;
        cloned.choices = this.choices;
        cloned.removedChoices = this.removedChoices;
        cloned.executedChoices = this.executedChoices;

        return cloned;
    }



}

/**
 * merge two groups to new group
 * @param {Group} gr1 
 * @param {Group} gr2 
 * @param {Number} maxNum max number in class
 * @returns {Group | undefined} - gr3
 */
function mergeGroups(gr1, gr2, maxNum) {
    let gr3 = new Group(gr1.id);

    // merge all data
    gr3.students = [...gr1.students, ...gr2.students];
    gr3.bans = [...gr1.bans, ...gr2.bans];
    gr3.with = [...gr1.with, ...gr2.with];
    gr3.choices = [...gr1.choices, ...gr2.choices];

    // check no conflicts
    for (let ban of gr3.bans) {
        for (let std of gr3.std)
            if (ban === std)
                return undefined;

    }

    // no exception from max number of students in class
    if (gr3.students.length > maxNum)
        return undefined;

    // no different in pinned classes
    for (let index = 0; index < gr3.students.length; index++) {
        for (let innerIndex = index + 1; innerIndex < gr3.students.length; innerIndex++){

            if (gr3.students[index].classLocked && gr3.students[innerIndex].classLocked){
                if (gr3.students[index].class !== gr3.students[innerIndex].class){
                    return undefined;
                }
            }
        }
    }

    let removedChoices = 0;
    for (let ban of gr3.bans) {
        for (let choice of gr3.choices) {
            if (choice === ban) {
                // remove choice from list
                let index = gr3.choices.indexOf(choice);
                gr3.choices.splice(index, 1);
                removedChoices++;
            }
        }
    }

    let executedChoices = 0;
    for (let choiceGr1 of gr1.choices) {
        for (let stdGr2 of gr2.students) {
            if (choiceGr1 === stdGr2) {
                executedChoices++;
                break;
            }
        }
    }
    for (let choiceGr2 of gr2.choices) {
        for (let stdGr1 of gr1.students) {
            if (choiceGr2 === stdGr1) {
                executedChoices++;
                break;
            }
        }
    }
    gr3.executedChoices = executedChoices;
    gr3.removedChoices = removedChoices;

    return gr3;
}
module.exports = { Group, mergeGroups };