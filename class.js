const {Group} = require('./group');
const Student = require("./student")

class Class {
    id;
    students = [new Student()];
    bans = [];
    with = [];
    choices = [];
    averageHev = 0;
    averageLimudi = 0;
    percentBoys = 0; 
    boys = 0;
    girls = 0;


    constructor(id) {
        this.id = id;
        this.students.pop();
    }
    // /**
    //  * @param {Class} cls
    //  */
    // constructor(cls){
    //     this.id = cls.id;
    //     this.students = cls.students;
    //     this.bans = cls.bans;
    //     this.with = cls.with;
    //     this.choices = cls.choices;
    //     this.averageHev = cls.averageHev;
    //     this.averageLimudi = cls.averageLimudi;
    //     this.percentBoys = cls.percentBoys;
    //     this.boys = cls.boys;
    //     this.girls = cls.girls;
    // }

    /**
     * 
     * @param {Group} group 
     */
    addGroup(group) {
        // check student not shown in group
        for (let stdGr of group.students){
            if (this.students.includes(stdGr)){
                return false;
            }
            if (this.bans.includes(stdGr.auid)){
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

        this.calcDetails()

    }

    calcDetails(){
        let amount = this.students.length;
        let boys = 0;
        let girls = 0;
        let Hev_All = 0;
        let Limudi_All = 0;

        for (let std of this.students){
            if (std.eqFields.gender === "נקבה"){
                girls++;
            } else {
                boys++;
            }

            Hev_All += this.valueOfField(std.eqFields.hev);
            Limudi_All += this.valueOfField(std.eqFields.limudi);

            // change the class of the students
            std.class = this.id;
            std.classLocked = 1;

        }
        this.averageLimudi = Limudi_All/amount;
        this.averageHev = Hev_All/amount;
        this.percentBoys = boys/amount * 100;
        this.boys = boys;
        this.girls = girls;
    }

    valueOfField(text){
        let dict = {
            "דרוש שיפור" : 1,
            "נמוכה" : 2,
            "בינונית" : 3,
            "גבוהה" : 4
        };

        return dict[text];
    }
}


module.exports = { Class };