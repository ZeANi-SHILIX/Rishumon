class Group {
    id = 0;
    students = [];
    bans = [];
    with = [];
    choices = [];


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
                this.choices.push(auid);
        });

    }



}

/**
 * merge two groups to new group
 * @param {Group} gr1 
 * @param {Group} gr2 
 * @returns {Group | undefined} - gr3
 */
function mergeGroups(gr1, gr2) {
    let gr3 = new Group(gr1.id);

    // merge all data
    gr3.students = [...gr1.students, ...gr2.students];
    gr3.bans = [...gr1.bans, ...gr2.bans];
    gr3.with = [...gr1.with, ...gr2.with];
    gr3.choices = [...gr1.choices, ...gr2.choices];

    // check no conflicts
    for (let ban of gr3.bans) {
        for (let w of gr3.with)
            if (ban === w)
                return undefined;

    }

    for (let ban of gr3.bans) {
        for (let choice of gr3.choices) {
            if (choice === ban) {
                // remove choice from list
                let index = gr3.choices.indexOf(choice);
                gr3.choices.splice(index, 1);
            }   
        }
    }

    return gr3;
}
module.exports = {Group, mergeGroups};