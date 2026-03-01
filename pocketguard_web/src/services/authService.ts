// Simulación de servicio de autenticación (SOA)
export const AuthService = {
  async loginDeveloper(password: string): Promise<boolean> {
    // Simulamos una llamada asíncrona al servidor
    return new Promise((resolve) => {
      setTimeout(() => {
        // En un caso real, esto llamaría a tu API Node.js
        // Para el proyecto, usamos una contraseña maestra definida en .env.local o fija aquí
        const isValid = password === "dev123"; // Contraseña para los desarrolladores
        resolve(isValid);
      }, 800);
    });
  }
};