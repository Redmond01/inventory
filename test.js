

const{log} = console

class objectOrientedProgramming {
    constructor(name, age, school, group){
        this.name = name;
        this.age = age;
        this.school = school;
        this.group= group;
    }
    cosntructAsentenceWithAll(){
        console.log(`hello my name is ${this.name} and i am from 
        ${this.school}. I am ${this.age} years old, and I am part of ${this.group}`)
    }
}
const newStyleOfFunction = new objectOrientedProgramming(name='raymond',age=24, school='saapade', group='the best coder')
newStyleOfFunction.cosntructAsentenceWithAll()