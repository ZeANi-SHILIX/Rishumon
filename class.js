const { Group } = require('./group');
const Student = require("./student")

class Class {
    id;
    maxStudentInClass = 0
    students = [new Student()];
    bans = [];
    with = [];
    choices = [];
    averageHev = 0;
    averageLim = 0;
    percentBoys = 0;
    boys = 0;
    girls = 0;

    executedChoices = 0;
    removedChoices = 0;

    overallScore = 0;

    constructor(id, maxStudentInClass) {
        this.id = id;
        this.maxStudentInClass = maxStudentInClass;
        this.students.pop();
    }

    /**
     * 
     * @param {Group} group 
     */
    addGroup(group) {
        if (this.students.length + group.students.length > this.maxStudentInClass)
            return false;

        // check student not shown in group
        for (let stdGr of group.students) {
            if (this.students.includes(stdGr)) {
                return false;
            }
            if (this.bans.includes(stdGr.auid)) {
                return false;
            }
        }
        for (let ban of group.bans) {
            for (let std of this.students) {
                if (std.auid === ban)
                    return false;
            }
        }

        this.students = [...this.students, ...group.students];

        group.bans.forEach(auid => {
            if (!this.bans.includes(auid))
                this.bans.push(auid);
        });

        group.with.forEach(auid => {
            if (!this.with.includes(auid))
                this.with.push(auid);
        });

        group.choices.forEach(auid => {
            if (!this.choices.includes(auid))
                this.choices.push(auid);

        });

        this.executedChoices += group.executedChoices;
        this.removedChoices += group.removedChoices;

        this.calcDetails();
        return true;

    }

    calcDetails() {
        let amount = this.students.length;
        let boys = 0;
        let girls = 0;
        let Hev_All = 0;
        let Lim_All = 0;

        for (let std of this.students) {
            if (std.eqFields.gender === "נקבה") {
                girls++;
            } else {
                boys++;
            }

            Hev_All += this.valueOfField(std.eqFields.hev);
            Lim_All += this.valueOfField(std.eqFields.limudi);

            // change the class of the students
            std.class = this.id;
            std.classLocked = 1;

        }
        this.averageLim = Lim_All / amount;
        this.averageHev = Hev_All / amount;
        this.percentBoys = boys / amount * 100;
        this.boys = boys;
        this.girls = girls;
    }

    valueOfField(text) {
        let dict = {
            "דרוש שיפור": 1,
            "נמוכה": 2,
            "בינונית": 3,
            "גבוהה": 4
        };

        return dict[text];
    }

    makeClone() {
        let cloned = new Class(this.id, this.maxStudentInClass);

        cloned.students = this.students;
        cloned.with = this.with;
        cloned.bans = this.bans;
        cloned.choices = this.choices;
        cloned.boys = this.boys;
        cloned.girls = this.girls;
        cloned.averageHev = this.averageHev;
        cloned.averageLim = this.averageLim;
        cloned.percentBoys = this.percentBoys;
        cloned.overallScore = this.overallScore;


        return cloned;
    }
}


module.exports = { Class };