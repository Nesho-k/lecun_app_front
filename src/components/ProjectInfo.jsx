function ProjectInfo() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-3">
          Reconnaissance de Chiffres Manuscrits
        </h2>
        <p className="text-gray-300 leading-relaxed max-w-2xl">
          Reproduction de l'architecture CNN décrite dans l'article de recherche
          "Handwritten Digit Recognition with a Back-Propagation Network" de Yann LeCun (1989).
        </p>
      </div>

      {/* Comment j'ai construit le projet */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Comment j'ai construit ce projet ?</h3>

        <div className="space-y-6">
          {/* Étape 1 */}
          <div className="border-l-4 border-gray-800 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">1. Étude de l'article de recherche</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              J'ai commencé par lire et analyser l'article original de Yann LeCun de 1989.
              L'objectif était de comprendre l'architecture du réseau de neurones convolutif (CNN)
              proposé : couches de convolution, pooling, et couches entièrement connectées.
              J'ai noté que la fonction d'activation utilisée était Tanh (ReLU n'existait pas encore)
              et que la fonction de coût était la MSE.
            </p>
          </div>

          {/* Étape 2 */}
          <div className="border-l-4 border-gray-800 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">2. Préparation des données MNIST</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              J'ai utilisé le dataset MNIST qui contient 60 000 images d'entraînement et 10 000 images
              de test. Chaque image fait 28x28 pixels en niveaux de gris. J'ai normalisé les valeurs
              des pixels entre -1 et 1 (au lieu de 0-255) et appliqué un encodage One-Hot sur les labels
              pour faciliter le calcul de la fonction de coût.
            </p>
          </div>

          {/* Étape 3 */}
          <div className="border-l-4 border-gray-800 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">3. Construction du modèle CNN avec PyTorch</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              J'ai implémenté l'architecture décrite dans le papier :
            </p>
            <ul className="mt-2 space-y-1 text-gray-600 text-sm ml-4">
              <li><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Conv2d</span> (1→4 filtres, kernel 5x5) + Tanh</li>
              <li><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">AvgPool2d</span> (kernel 2x2)</li>
              <li><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Conv2d</span> (4→12 filtres, kernel 5x5) + Tanh</li>
              <li><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">AvgPool2d</span> (kernel 2x2)</li>
              <li><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">Linear</span> (192→10 neurones)</li>
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              J'ai utilisé Average Pooling plutôt que Max Pooling car c'était la technique
              de l'époque, et Tanh comme fonction d'activation.
            </p>
          </div>

          {/* Étape 4 */}
          <div className="border-l-4 border-gray-800 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">4. Entraînement du modèle</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              J'ai entraîné le modèle sur 20 epochs avec :
            </p>
            <ul className="mt-2 space-y-1 text-gray-600 text-sm ml-4">
              <li><span className="font-semibold">Fonction de coût :</span> MSE (Mean Squared Error)</li>
              <li><span className="font-semibold">Optimiseur :</span> SGD avec momentum (lr=0.01, momentum=0.9)</li>
              <li><span className="font-semibold">Batch size :</span> 5 images</li>
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
              La loss est passée de 0.03 à 0.01, montrant une bonne convergence du modèle.
            </p>
          </div>

          {/* Étape 5 */}
          <div className="border-l-4 border-gray-800 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">5. API Backend avec FastAPI</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              J'ai créé une API REST avec FastAPI qui expose un endpoint <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">/predict-file</span>.
              L'API charge les poids du modèle entraîné et effectue le prétraitement de l'image :
              conversion en niveaux de gris, redimensionnement de 280x280 vers 28x28, et normalisation.
              Le redimensionnement utilise l'algorithme BOX qui fait une moyenne des pixels,
              adapté pour une réduction d'un facteur 10.
            </p>
          </div>

          {/* Étape 6 */}
          <div className="border-l-4 border-gray-800 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">6. Interface web (React + Tailwind)</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              J'ai développé cette interface avec un canvas HTML5 pour dessiner les chiffres.
              Le canvas fait 280x280 pixels (10x la taille MNIST) avec un fond noir et un trait blanc,
              reproduisant les conditions des images d'entraînement. L'épaisseur du trait est
              modifiable entre 15 et 35 pixels pour correspondre à l'épaisseur des chiffres MNIST.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture du modèle */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Architecture du CNN</h3>
        <div className="overflow-x-auto">
          <div className="flex items-center justify-center gap-2 min-w-max py-4">
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Input</div>
              <div className="font-mono text-sm font-semibold">28x28x1</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-gray-800 text-white rounded-lg p-3 text-center">
              <div className="text-xs text-gray-300">Conv + Tanh</div>
              <div className="font-mono text-sm font-semibold">24x24x4</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-gray-600 text-white rounded-lg p-3 text-center">
              <div className="text-xs text-gray-300">AvgPool</div>
              <div className="font-mono text-sm font-semibold">12x12x4</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-gray-800 text-white rounded-lg p-3 text-center">
              <div className="text-xs text-gray-300">Conv + Tanh</div>
              <div className="font-mono text-sm font-semibold">8x8x12</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-gray-600 text-white rounded-lg p-3 text-center">
              <div className="text-xs text-gray-300">AvgPool</div>
              <div className="font-mono text-sm font-semibold">4x4x12</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Flatten</div>
              <div className="font-mono text-sm font-semibold">192</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="bg-gray-800 text-white rounded-lg p-3 text-center">
              <div className="text-xs text-gray-300">Dense</div>
              <div className="font-mono text-sm font-semibold">10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">🐍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Backend</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></div>
              Python
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></div>
              PyTorch
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></div>
              FastAPI
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></div>
              Pillow (traitement d'image)
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">⚛️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Frontend</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></div>
              React
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></div>
              Tailwind CSS
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></div>
              Vite
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></div>
              Canvas API
            </li>
          </ul>
        </div>
      </div>

      {/* Difficultés rencontrées */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Difficultés rencontrées</h3>
        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            <span className="font-semibold">• Prétraitement de l'image :</span> Les images du canvas
            n'avaient pas le même format que MNIST. J'ai dû analyser la distribution des pixels
            pour comprendre que le redimensionnement créait des valeurs trop sombres.
          </p>
          <p>
            <span className="font-semibold">• Épaisseur du trait :</span> Un trait trop fin sur le canvas
            devenait quasi invisible après redimensionnement. J'ai analysé l'épaisseur des traits
            MNIST pour déterminer la plage optimale (20-30px sur un canvas 280x280).
          </p>
          <p>
            <span className="font-semibold">• Algorithme de redimensionnement :</span> L'algorithme BOX (moyenne des pixels) est la plus adapté
            pour une réduction d'un facteur 10.
          </p>
          <p>
            <span className="font-semibold">• Normalisation :</span> Il fallait reproduire exactement
            la normalisation de l'entraînement : (pixel / 255) * 2 - 1 pour obtenir des valeurs entre -1 et 1.
          </p>
        </div>
      </div>

      {/* Référence */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Référence</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          <span className="font-semibold">LeCun, Y., Boser, B., Denker, J. S., Henderson, D., Howard, R. E., Hubbard, W., & Jackel, L. D.</span> (1989).
          Backpropagation Applied to Handwritten Zip Code Recognition.
          <span className="italic"> Neural Computation, 1</span>(4), 541-551.
        </p>
        <a
          href="https://proceedings.neurips.cc/paper/1989/file/53c3bce66e43be4f209556518c2fcb54-Paper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 text-sm text-gray-800 hover:text-black font-medium underline underline-offset-2"
        >
          Lire le papier de recherche (PDF)
        </a>
      </div>
    </div>
  )
}

export default ProjectInfo
