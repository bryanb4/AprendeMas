// src/services/api.js

// Este archivo simula las llamadas a tu backend
// Usamos un 'setTimeout' para simular la demora de la red

// Una base de datos falsa
const FAKE_USERS = [
  { id: 1, email: 'user@test.com', password: '123' } // Nunca hagas esto en la vida real
];

/**
 * Simula una petición de Login
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = FAKE_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        console.log("Mock API: Login exitoso para", email);
        // El backend real devolvería un "token"
        resolve({
          status: 'ok',
          token: 'fake-jwt-token-123456', 
          user: { id: user.id, email: user.email }
        });
      } else {
        console.log("Mock API: Fallo de login para", email);
        reject(new Error('Credenciales inválidas'));
      }
    }, 1000); // Simula 1 segundo de espera
  });
};

/**
 * Simula una petición de Registro
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export const mockRegister = (email, password) => {
   return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (FAKE_USERS.find(u => u.email === email)) {
        console.log("Mock API: Email ya registrado", email);
        reject(new Error('El correo ya está en uso'));
      } else {
        const newUser = { id: FAKE_USERS.length + 1, email, password };
        FAKE_USERS.push(newUser);
        console.log("Mock API: Registro exitoso para", email, FAKE_USERS);
        resolve({
          status: 'ok',
          user: { id: newUser.id, email: newUser.email }
        });
      }
    }, 1000);
  });
};