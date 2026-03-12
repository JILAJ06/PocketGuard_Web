const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthService = {
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
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

  async adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      console.log('🔍 Intentando login con:', { email, apiUrl: `${API_URL}/api/admin/login` });
      console.log('📤 Request body:', JSON.stringify({ email, password }));
      
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Response status:', response.status, response.statusText);
      
      // Intentar leer la respuesta como texto primero
      const responseText = await response.text();
      console.log('📥 Response raw text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('📦 Response data (parsed):', result);
      } catch (e) {
        console.error('❌ Error parsing JSON:', e);
        return {
          success: false,
          error: 'Error al procesar respuesta del servidor'
        };
      }

      if (!response.ok) {
        console.log('❌ Login fallido:', result.message || result.errors);
        return { 
          success: false, 
          error: result.message || `Error ${response.status}: ${response.statusText}` 
        }; 
      }

      // Debug: mostrar toda la estructura
      console.log('🔎 Estructura completa de result:', {
        success: result.success,
        hasData: !!result.data,
        dataKeys: result.data ? Object.keys(result.data) : [],
        dataContent: result.data
      });

      if (result.success) {
        // Buscar el token en diferentes ubicaciones posibles
        const token = result.data?.token || result.token || result.data?.accessToken;
        
        if (token) {
          console.log('✅ Login exitoso, token encontrado');
          return { success: true, token };
        }
        
        console.log('⚠️ Login exitoso pero no se encontró token en la respuesta');
        console.log('📋 Datos disponibles:', result.data);
      }
      
      console.log('⚠️ Respuesta inesperada del servidor');
      return { 
        success: false, 
        error: result.message || 'No se recibió token del servidor' 
      };
    } catch (error: any) {
      console.error("❌ Error en autenticación admin:", error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión con el servidor' 
      };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al restablecer la contraseña');
      }

    } catch (error) {
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return { success: false, message: result.message || 'Error al enviar el correo' };
      }

      return { success: true, message: result.message };
    } catch (error) {
      console.error("Error en forgot password:", error);
      return { success: false, message: 'Error de conexión' };
    }
  }
};