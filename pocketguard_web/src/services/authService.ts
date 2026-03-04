const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthService = {
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        return false; // Credenciales inválidas o error en el servidor
      }

      // Si necesitas guardar el token más adelante, se haría aquí:
      // const data = await response.json();
      // localStorage.setItem('token', data.token);

      return true;
    } catch (error) {
      console.error("Error en autenticación:", error);
      return false;
    }
  }
};