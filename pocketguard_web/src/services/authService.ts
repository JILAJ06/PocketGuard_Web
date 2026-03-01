// Simulación de servicio de autenticación (SOA)
export const AuthService = {
  async login(username: string, password: string): Promise<boolean> {
    // Simulamos una llamada asíncrona al servidor
    return new Promise((resolve) => {
      setTimeout(() => {
        // Credenciales quemadas para el prototipo escolar
        // En producción, esto enviaría un POST a tu API Node.js
        const isUserValid = username === "admin" || username === "desarrollador";
        const isPassValid = password === "dev123"; 
        
        resolve(isUserValid && isPassValid);
      }, 1000); // Simula un poco de lag de red
    });
  }
};