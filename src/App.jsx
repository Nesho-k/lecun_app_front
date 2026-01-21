import { useState } from 'react'
import DigitCanvas from './components/DigitCanvas'
import ProjectInfo from './components/ProjectInfo'

function App() {
  const [activeTab, setActiveTab] = useState('prediction')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-gray-800 via-gray-900 to-black relative overflow-hidden">
        {/* Effet de fond subtil */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiA0MGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="max-w-6xl mx-auto px-6 py-10 relative">
          {/* Titre principal */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Reconnaissance de Chiffres
            </h1>
            <p className="text-gray-400 mt-2">Méthode LeCun (1989)</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center">
            <div className="inline-flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1.5 border border-white/20">
              <button
                onClick={() => setActiveTab('prediction')}
                className={`px-8 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'prediction'
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Prédiction
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-8 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'about'
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                À propos
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'prediction' ? <DigitCanvas /> : <ProjectInfo />}
      </main>
    </div>
  )
}

export default App
