// Import the necessary modules
const request = require('supertest');
const app = require('../../app'); // Replace './app' with the path to your app.js file
const mysql = require('mysql2/promise');

// Configure Jest to use a test database
let connection;
beforeAll(async () => {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RndmCodeGuy@20',
    database: 'ink_exchange',
  });

  await connection.query('DELETE FROM data_buyers');
});


// Test the user registration endpoint with missing required fields
describe('User Registration', () => {
  test('should fail to register a user with missing required fields', async () => {
    const response = await request(app)
        .post('/register')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          // Missing email field
          password: 'SecureP@ssw0rd',
        });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

// Clean up the test database after all tests have run
afterAll(async () => {
  await connection.query('DELETE FROM data_buyers');
  await connection.end();
});
