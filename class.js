class Class {
    id;
    students = [];
    amount = 0;
    score = 0;
    boys=0;
    girls =0;


    constructor() {
        //this.name = name;
        
    }


    displayInfo() {
        return {
            id : this.id,
            students : this.students,
            amount : this.amount,
            score : this.score,
        };
    }

    changePreference() {

    }
}