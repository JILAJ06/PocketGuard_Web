import Link from 'next/link';
import { ArrowDownTrayIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar simple */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold text-green-600">PocketGuard</div>
        <Link href="/terminos" className="text-gray-600 hover:text-green-600 font-medium">
          Legal
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 flex flex-col lg:flex-row items-center">
          
          {/* Texto de Venta */}
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
              Elimina el <span className="text-green-600">Impuesto de la Pereza</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8">
              Visualiza tu "Saldo Real Gastado" y recibe alertas proactivas sobre tus suscripciones antes de que te cobren.
              Toma el control de tus finanzas personales [cite: 20-21].
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href={process.env.NEXT_PUBLIC_APP_DOWNLOAD_LINK} 
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg transition shadow-lg"
              >
                <ArrowDownTrayIcon className="h-6 w-6 mr-2" />
                Descargar para Android
              </a>
            </div>
          </div>

          {/* Imagen / Mockup (Placeholder visual) */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-72 h-[580px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
              {/* Aquí iría una captura de tu app */}
              <div className="absolute inset-0 bg-green-50 flex items-center justify-center text-gray-400">
                Mockup PocketGuard App
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<ClockIcon className="h-8 w-8 text-green-600" />}
                title="Registro en < 3 Toques"
                desc="Diseñada para la inmediatez. Registra tus gastos en segundos, sin fricción[cite: 22]."
              />
              <FeatureCard 
                icon={<ShieldCheckIcon className="h-8 w-8 text-green-600" />}
                title="Alertas Preventivas"
                desc="Te avisamos antes de que se renueven tus suscripciones automáticas[cite: 21]."
              />
              <FeatureCard 
                icon={<span className="text-2xl font-bold text-green-600">$</span>}
                title="Saldo Real"
                desc="Conoce tu liquidez real descontando los gastos fijos futuros."
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 text-center text-gray-400 text-sm">
        © 2026 PocketGuard. Todos los derechos reservados.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}