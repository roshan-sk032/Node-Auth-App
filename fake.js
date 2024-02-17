// const { faker } = require('@faker-js/faker');
// const hashPassword = require('./services/hashPassword');

// async function DummyData() {
//   let array = [];
//   for (let i = 0; i < 2; i++) {
//     let userData = {}; 
//     const first_name = faker.person.firstName();
//     const last_name = faker.person.lastName();
//     const username = faker.internet.userName();
//     const email = faker.internet.email().toLowerCase();
//     const password = await hashPassword(first_name + '@123');
//     const confirm_password = password
//     userData = {first_name: first_name, last_name: last_name, username: username, email: email, password: password, confirm_password:confirm_password};
//     array.push(userData);
//   }
//   console.log(array);
// }

// DummyData();
