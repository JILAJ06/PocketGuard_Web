import React from 'react';

export default function TerminosYCondiciones() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Encabezado */}
        <div className="bg-green-700 px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Términos Legales y Aviso de Privacidad
          </h1>
          <p className="text-green-100 mt-2 text-lg">
            Comprometidos con la protección de tus datos personales y financieros.
          </p>
        </div>
        
        <div className="p-8 sm:p-12 space-y-10 text-gray-700 leading-relaxed">
          
          {/* Nueva Sección: Naturaleza Académica del Proyecto */}
          <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Aviso Importante: Proyecto Académico
            </h2>
            <p className="text-blue-800 mb-4">
              PocketGuard es una plataforma desarrollada exclusivamente para fines educativos y académicos como parte del Proyecto Integrador II de la Universidad Politécnica de Chiapas. 
            </p>
            <ul className="list-disc list-inside space-y-2 text-blue-800 ml-2">
              <li><strong>Uso de Datos:</strong> Todos los datos financieros y personales proporcionados por los usuarios serán utilizados única y exclusivamente para realizar pruebas, validaciones y reportes estadísticos dentro del marco de este proyecto académico.</li>
              <li><strong>No Comercialización:</strong> Bajo ninguna circunstancia los datos recopilados serán vendidos, compartidos, cedidos o utilizados con fines de lucro o comerciales por parte de terceros o de los desarrolladores.</li>
              <li><strong>Limitación de Responsabilidad:</strong> Al ser un prototipo en fase de Beta Testing, la plataforma y el equipo desarrollador no se hacen responsables por la pérdida de datos, errores de cálculo, fallos en las notificaciones, o cualquier otro daño derivado del uso de la aplicación. El usuario utiliza la plataforma bajo su propio riesgo para fines experimentales.</li>
            </ul>
          </section>

          {/* Sección 1: Normativas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-100 pb-2">
              1. Fundamento Constitucional
            </h2>
            <p className="mb-4">
              El proyecto se fundamenta en los derechos de privacidad y protección de datos consagrados en la 
              Constitución Política de los Estados Unidos Mexicanos. A continuación, se citan los artículos 
              pertinentes que garantizan estos derechos:
            </p>
            
            <div className="bg-gray-50 border-l-4 border-green-500 p-4 mb-4 italic">
              <h3 className="font-bold text-gray-900 not-italic mb-1">Artículo 6, Apartado A, Fracción II:</h3>
              "La información que se refiere a la vida privada y los datos personales será protegida en los 
              términos y con las excepciones que fijen las leyes. Para tal efecto, los sujetos obligados contarán 
              con las facultades suficientes para su atención..."
            </div>

            <div className="bg-gray-50 border-l-4 border-green-500 p-4 italic">
              <h3 className="font-bold text-gray-900 not-italic mb-1">Artículo 16, Párrafo 2:</h3>
              "Toda persona tiene derecho a la protección de sus datos personales, al acceso, rectificación y 
              cancelación de los mismos (Derechos ARCO), así como a manifestar su oposición, en los términos que fije la ley..."
            </div>
          </section>

          {/* Sección 2: LFPDPPP */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-green-100 pb-2">
              2. Ley Federal de Protección de Datos (LFPDPPP)
            </h2>
            <p className="mb-6">
              Para garantizar el cumplimiento legal en el manejo de información financiera (datos patrimoniales) 
              y personal de los usuarios, PocketGuard se adhiere a las siguientes disposiciones, limitadas al entorno académico:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-green-800 mb-2">Sobre el Consentimiento Expreso (Artículo 8)</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  Requisito obligatorio al manejar datos sensibles o patrimoniales financieros.
                  "Tratándose de datos personales sensibles, el responsable deberá obtener el consentimiento expreso 
                  y por escrito de la persona titular para su tratamiento... No podrán crearse bases de datos que 
                  contengan datos personales sensibles, sin que se justifique la creación de las mismas para finalidades 
                  legítimas..."
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-green-800 mb-2">Sobre el Aviso de Privacidad (Artículos 15 y 16)</h3>
                <p className="mb-2">Documento transparente sobre el uso de información financiera del usuario. El aviso de privacidad contiene, al menos:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600">
                  <li>La identidad y domicilio del equipo responsable del proyecto académico.</li>
                  <li>Los datos personales sometidos a tratamiento (información financiera para cálculos de gráficas).</li>
                  <li>Las finalidades del tratamiento (validación de la hipótesis del proyecto).</li>
                  <li>Las opciones para limitar el uso o divulgación de datos.</li>
                  <li>Los medios para ejercer los derechos ARCO.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-green-800 mb-2">Sobre la Seguridad Técnica (Artículo 19)</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  Encriptación y medidas estrictas para evitar y notificar vulneraciones de datos.
                  "Las vulneraciones de seguridad ocurridas en cualquier fase del tratamiento de datos personales... 
                  le serán informadas de forma inmediata por el responsable, a fin de que pueda tomar las medidas 
                  correspondientes a la defensa de sus derechos."
                </p>
              </div>
            </div>
          </section>

          {/* Referencias */}
          <section className="border-t pt-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Referencias Normativas</h3>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>Cámara de Diputados del H. Congreso de la Unión. (2010). Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</li>
              <li>Constitución Política de los Estados Unidos Mexicanos (Artículos 6º y 16º). Diario Oficial de la Federación.</li>
            </ul>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-400">© 2026 PocketGuard - Universidad Politécnica de Chiapas. Proyecto Académico.</p>
          </div>
        </div>
      </div>
    </div>
  );
}