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
        return false; 
      }

      return true;
    } catch (error) {
      console.error("Error en autenticación:", error);
      return false;
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al restablecer la contraseña');
      }

    } catch (error) {
      throw error;
    }
  }
};