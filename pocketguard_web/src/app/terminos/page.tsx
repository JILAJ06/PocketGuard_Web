import React from 'react';

export default function TerminosYCondiciones() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Términos y Aviso de Privacidad
        </h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-green-700 mb-2">1. Fundamento Constitucional</h2>
            <p>
              PocketGuard respeta sus derechos de privacidad conforme a los artículos 6 y 16 de la 
              Constitución Política de los Estados Unidos Mexicanos. Toda persona tiene derecho a la 
              protección de sus datos personales, al acceso, rectificación y cancelación de los mismos [cite: 113-116].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-700 mb-2">2. Ley Federal de Protección de Datos (LFPDPPP)</h2>
            <p>
              En cumplimiento con la LFPDPPP, hacemos de su conocimiento lo siguiente:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Consentimiento (Art. 8):</strong> Para el tratamiento de datos sensibles (financieros), 
                solicitaremos su consentimiento expreso. No crearemos bases de datos sin una finalidad legítima [cite: 120-121].
              </li>
              <li>
                <strong>Identidad del Responsable (Art. 15):</strong> PocketGuard actúa como el responsable del tratamiento 
                de sus datos personales y financieros con el fin de gestionar sus gastos y alertas [cite: 124-126].
              </li>
              <li>
                <strong>Finalidad del Tratamiento:</strong> Los datos se usan exclusivamente para predecir ciclos 
                de facturación, alertar sobre cobros y calcular su "Saldo Real Gastado" [cite: 20-21].
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-700 mb-2">3. Seguridad de los Datos (Art. 19)</h2>
            <p>
              Cualquier vulneración de seguridad que afecte sus derechos patrimoniales o morales será informada 
              de forma inmediata para que pueda tomar las medidas correspondientes [cite: 136-138].
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
            <p>Última actualización: Febrero 2026</p>
            <p>PocketGuard - Gestión Inteligente de Gastos</p>
          </div>
        </div>
      </div>
    </div>
  );
}