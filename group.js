class Group {
    id = 0;
    students = [];
    bans = [];
    with = [];
    choices = [];

    
    constructor(id){
        this.id = id;
    }

    addStudent(elem){
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

    displayInfo() {
        return {
            id : this.id,
            students : this.students
        };
    }

}
module.exports = Group;