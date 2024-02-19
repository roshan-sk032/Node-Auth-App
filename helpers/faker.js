const { faker } = require('@faker-js/faker');
const hashPassword = require('./hashPassword');
const {Users} = require('../models/userModel')

async function dummyData() {
  let array = [];
  let hashedPassword=await hashPassword('Password' + '@123');
  for (let i = 0; i < 1; i++) {

    array.push({
      first_name: faker.person.firstName(), 
      last_name: faker.person.lastName(), 
      username: faker.internet.userName(), 
      user_type:'user', 
      email: faker.internet.email().toLowerCase(), 
      password: hashedPassword
    });
  }
  return array;
}

async function taskDummyData() {
    let array = [];
    const users = await Users.find().sort({_id:-1})
    
    for (let i = 0; i < 1; i++) {
        
        array.push({
          title:faker.word.sample(),
          description:faker.lorem.sentence(),
          user:users[i].id
        })
    }
    return array;
}

module.exports = {dummyData,taskDummyData};
