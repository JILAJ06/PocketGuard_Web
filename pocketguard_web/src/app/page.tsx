import Link from 'next/link';
import { ArrowDownTrayIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full z-10 relative">
        <div className="text-3xl font-extrabold text-green-700 tracking-tighter">PocketGuard</div>
        <Link href="/terminos" className="text-gray-600 hover:text-green-700 font-medium transition-colors">
          Términos y Privacidad
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between w-full">
          
          {/* Columna Izquierda: Texto de Venta */}
          <div className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0 lg:pr-12">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Dile adiós al <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                Impuesto de la Pereza
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              ¿Sabes cuánto gastas realmente? Visualiza tu <strong>"Saldo Real Gastado"</strong> y recibe alertas antes de que tus suscripciones se renueven automáticamente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="https://github.com/JILAJ06/PocketGuard/releases/download/v1.0.0/PocketGuard.apk" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-green-600 hover:bg-green-700 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
              >
                <ArrowDownTrayIcon className="h-6 w-6 mr-2" />
                Descargar App para Android
              </a>
            </div>
          </div>

          {/* Columna Derecha: Mockup del Teléfono */}
          <div className="lg:w-1/2 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            
            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden ring-4 ring-gray-200">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
              <div className="relative w-full h-full bg-white">
                <img 
                  src="/app-screenshot.jpg" 
                  alt="Captura de la aplicación PocketGuard" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<BoltIcon className="h-10 w-10 text-green-600" />}
              title="Registro de Gastos al Instante"
              desc="Diseñada para la movilidad. Registra tus transacciones diarias (café, transporte) en segundos para no perder el hábito."
            />
            <FeatureCard 
              icon={<ShieldCheckIcon className="h-10 w-10 text-green-600" />}
              title="Alertas Preventivas"
              desc="El sistema predice tus ciclos de facturación y te avisa antes de que se realice el cobro automático."
            />
            <FeatureCard 
              icon={<span className="text-4xl font-black text-green-600 leading-none">$</span>}
              title="Saldo Real Gastado"
              desc="Conoce tu liquidez verdadera. Descontamos tus gastos fijos futuros del dinero que tienes disponible hoy."
            />
          </div>
        </div>
      </section>

      <footer className="bg-white py-10 text-center border-t border-gray-100">
        <p className="text-gray-500">© 2026 PocketGuard. Ingeniería en Tecnologías de la Información.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="mb-6 bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}