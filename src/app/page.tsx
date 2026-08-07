import { Hero } from '@/components/Hero';
import { Calculator } from '@/components/Calculator';
import { Dashboard } from '@/components/Dashboard';
import { EcoMap } from '@/components/EcoMap';
import { Challenges } from '@/components/Challenges';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      
      {/* Calculator Section */}
      <section id="calculator" className="min-h-screen w-full bg-[#022c22] border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins text-emerald-400 mb-4">Carbon Footprint Calculator</h2>
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto">Calculate your daily impact and find out where you can improve to earn more EP and unlock new areas in the Eco Map.</p>
          </div>
          <Calculator />
        </div>
      </section>
      
      {/* Dashboard Section */}
      <section id="dashboard" className="min-h-screen w-full bg-[#03362a] border-t border-white/5 py-24 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-teal-600/10 blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins text-emerald-400 mb-4">Your Green Dashboard</h2>
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto">Track your overall progress, level up your eco rank, and see the real-world impact of your sustainable choices.</p>
          </div>
          <Dashboard />
        </div>
      </section>
      
      {/* Challenges Section */}
      <section id="challenges" className="min-h-screen w-full bg-[#022c22] border-t border-white/5 py-24 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins text-emerald-400 mb-4">Eco Challenges</h2>
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto">Complete real-world challenges to earn EP, level up your rank, and unlock new areas on the map.</p>
          </div>
          <Challenges />
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="map" className="min-h-screen w-full bg-[#03362a] border-t border-white/5 py-24 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins text-emerald-400 mb-4">Interactive Eco Map</h2>
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto">Explore the world you are helping to save. Earn EP from challenges to clear the fog of war and unlock new regions.</p>
          </div>
          <EcoMap />
        </div>
      </section>
    </main>
  );
}
