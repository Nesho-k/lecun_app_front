import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

export default function DigitCanvas() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [brush, setBrush] = useState(25);

    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [scores, setScores] = useState(null);
    const [error, setError] = useState(null);

    const API_URL = useMemo(
        () => import.meta.env.VITE_API_URL || "http://localhost:8000",
        []
    );

    // Init canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Canvas fixed size for consistency
        const size = 280;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        // Background black, draw white (MNIST-like)
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, size, size);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "white";
        ctx.lineWidth = brush;
    }, []);

    // Update brush size
    useEffect(() => {
        const ctx = ctxRef.current;
        if (!ctx) return;
        ctx.lineWidth = brush;
    }, [brush]);

    function getPos(e) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Mouse
        if (e.clientX !== undefined) {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }

        // Touch
        const t = e.touches?.[0] || e.changedTouches?.[0];
        return {
            x: t.clientX - rect.left,
            y: t.clientY - rect.top,
        };
    }

    function startDraw(e) {
        e.preventDefault();
        setIsDrawing(true);
        const ctx = ctxRef.current;
        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const ctx = ctxRef.current;
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function endDraw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        setIsDrawing(false);
        const ctx = ctxRef.current;
        ctx.closePath();
    }

    function clearCanvas() {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setPrediction(null);
        setScores(null);
        setError(null);
    }

    async function predict() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setLoading(true);
        setError(null);

        try {
            // Export to PNG blob
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
            if (!blob) throw new Error("Impossible de convertir le dessin en image.");

            const form = new FormData();
            form.append("file", blob, "digit.png");

            const res = await fetch(`${API_URL}/lecun/predict`, {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || `Erreur API (${res.status})`);
            }

            /** @type {import("./DigitCanvas").PredictResponse} */
            const data = await res.json();

            setPrediction(data.prediction);
            setScores(data.scores);
        } catch (err) {
            setError(err?.message || "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    }

    // Small helper: show top-3 logits indices
    function top3FromScores(arr) {
        if (!arr || arr.length !== 10) return null;
        const pairs = arr.map((v, i) => ({ i, v }));
        pairs.sort((a, b) => b.v - a.v);
        return pairs.slice(0, 3);
    }

    const top3 = top3FromScores(scores);

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-6 justify-center items-start">
                {/* Canvas card */}
                <div className="rounded-2xl border bg-white shadow-sm p-5">
                    <h2 className="text-lg font-semibold">Dessinez un chiffre</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Dessinez un chiffre entre 0 et 9, puis cliquez sur <span className="font-medium">Prédire</span>.
                    </p>

                    <div className="mt-4 flex justify-center">
                        <div className="rounded-xl overflow-hidden border">
                            <canvas
                                ref={canvasRef}
                                className="touch-none bg-black"
                                onMouseDown={startDraw}
                                onMouseMove={draw}
                                onMouseUp={endDraw}
                                onMouseLeave={endDraw}
                                onTouchStart={startDraw}
                                onTouchMove={draw}
                                onTouchEnd={endDraw}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-gray-700">Épaisseur du trait</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="range"
                                min={15}
                                max={35}
                                value={brush}
                                onChange={(e) => setBrush(clamp(parseInt(e.target.value, 10), 10, 40))}
                                className="w-full accent-gray-900"
                            />
                            <div className="w-12 text-right text-sm tabular-nums">{brush}px</div>
                        </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={clearCanvas}
                            className="flex-1 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                            disabled={loading}
                        >
                            Effacer
                        </button>
                        <button
                            onClick={predict}
                            className="flex-1 rounded-xl bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Prédiction..." : "Prédire"}
                        </button>
                    </div>
                </div>

                {/* Result card */}
                <div className="rounded-2xl border bg-white shadow-sm p-5 min-h-[220px] w-[360px]">
                    <h2 className="text-lg font-semibold">Résultat</h2>

                    {!prediction && !error && (
                        <div className="mt-2 text-gray-600">
                            En attente d'une prédiction...
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
                            <div className="font-semibold">Erreur</div>
                            <div className="mt-1">{error}</div>
                            <div className="mt-2 text-red-700/80">
                                Vérifie que ton backend FastAPI tourne et que <code className="px-1">VITE_API_URL</code> pointe dessus.
                            </div>
                        </div>
                    )}

                    {prediction !== null && !error && (
                        <div className="mt-6">
                            <div className="text-sm text-gray-600">Chiffre prédit</div>
                            <div className="mt-2 text-6xl font-bold tabular-nums">{prediction}</div>

                            {top3 && (
                                <div className="mt-6">
                                    <div className="text-sm font-semibold">Top 3 (logits)</div>
                                    <div className="mt-2 grid gap-2">
                                        {top3.map((p) => (
                                            <div
                                                key={p.i}
                                                className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"
                                            >
                                                <div className="font-medium">Classe {p.i}</div>
                                                <div className="tabular-nums text-gray-700">{p.v.toFixed(3)}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-3 text-xs text-gray-500">
                                        (Ton backend renvoie les <span className="font-medium">logits</span>, pas des probabilités.)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Note explicative */}
                <div className="w-[680px] rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-green-800 mb-2">Note</h3>
                    <p className="text-sm text-green-700 leading-relaxed">
                        L'objectif de ce projet était de reproduire fidèlement l'architecture CNN implémentée par Yann LeCun en 1989.
                        J'ai volontairement utilisé les techniques de l'époque (Tanh, Average Pooling, MSE) plutôt que les outils
                        modernes (ReLU, Max Pooling, Cross-Entropy). Cela explique les erreurs de prédiction qui peuvent intervenir.
                    </p>
                </div>
            </div>
        </div>
    );
}
