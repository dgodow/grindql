/* WITH COMPOSITION */

// COMPOSER FUNCTIONS THAT PROCESS STATE (INSTEAD OF CLASSES)

const barker = (state) => ({
  bark: () => console.log("Woof, I am " + state.name);
});

const driver = (state) => ({
  drive: () => state.position = state.position + state.speed;
});

barker({name: "karo"}).bark();

// FACTORY FUNCTION THAT COMBINES COMPOSERS INTO A NEW OBJECT

const murderRobotDog = (name) => {
  let state = {
    name,
    speed = 100,
    position: 0
  }
  
  // Returns an object that combines all of the methods/state from the composer functions
  return Object.assign(
    {},
    barker(state),
    driver(state),
    killer(state)
  )
};

murderRobotDog("sniffles").bark();

/////////////////////////////////////////////////////////////////////////////////////////////////////////

/* WITH CLASSES */

class Person {
  constructor (fn, ln) {
    this.firstName = fn;
    this.lastName = ln;
  }
  
  getInfo () {
    return "Hi, I am " + this.firstName + " " + this.lastName;
  }
}

class Employee extends Person {
  constructor (fn, ln, eid) {
    super(fn, ln);
    this.empid = eid;
  }
  
  getId () {
    return "Hi, my employee ID is " + this.empid;
  }
}

const e1 = new Employee('John', 'Doe', 123);

/* WITH COMPOSITION */

function getInfo (fn, ln) {
  return "Hi, I am " + fn + " " + ln;
}

function createPerson (fn, ln) {
  return {
    getInfo: function () {return getInfo(fn, ln)};
  }
}

function getId (empid) {
  return "Hi, my employee ID is " + empid;
}

function createEmployee (fn, ln, empid) {
  return {
    getId: function () {return getId(empid)},
    getInfo: function () {return getInfo(fn, ln});
  }
};

const e2 = createEmployee("John", "Doe", 123);