'use client';
import { useState, useEffect } from 'react';

const GAMES = [
  { id: 'improv', title: 'Импровизация', desc: 'Придумай историю на случайную тему', prompt: 'Расскажи короткую историю о встрече с инопланетянином в супермаркете.' },
  { id: 'story', title: 'Сторителлинг', desc: 'Свяжи три случайных слова в рассказ', prompt: 'Составь историю, используя слова: зонт, трамвай, кактус.' },
  { id: 'humor', title: 'Юмор', desc: 'Придумай шутку или каламбур', prompt: 'Придумай шутку про программиста и кофе.' },
  { id: 'diction', title: 'Дикция', desc: 'Произнеси скороговорку чётко', prompt: 'Скажи скороговорку: «Шла Саша по шоссе и сосала сушку». Оцени чёткость.' },
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<typeof GAMES[0] | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('talksy-streak');
    if (saved) setStreak(Number(saved));
  }, []);

  const handleReview = async () => {
    if (!selectedGame || !answer.trim()) return;
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: selectedGame.prompt, userAnswer: answer }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('talksy-streak', String(newStreak));
    } catch {
      setFeedback('Не удалось получить обратную связь. Попробуй ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Talksy Clone</h1>
          <div className="bg-gray-800 px-4 py-2 rounded-full text-sm">🔥 Стрик: {streak}</div>
        </header>

        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => { setSelectedGame(game); setAnswer(''); setFeedback(''); }}
                className="bg-[#1A1F2E] hover:bg-[#232A3D] transition p-6 rounded-2xl text-left border border-gray-700"
              >
                <h2 className="text-xl font-semibold mb-1">{game.title}</h2>
                <p className="text-gray-400 text-sm">{game.desc}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-[#1A1F2E] rounded-2xl p-6 border border-gray-700">
            <button onClick={() => setSelectedGame(null)} className="text-sm text-gray-400 mb-4 hover:text-white">← Назад к играм</button>
            <h2 className="text-2xl font-bold mb-2">{selectedGame.title}</h2>
            <p className="text-gray-300 mb-4">{selectedGame.prompt}</p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Напиши свой ответ здесь..."
              className="w-full bg-[#0A0F1E] border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleReview}
              disabled={loading || !answer.trim()}
              className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
            >
              {loading ? 'Анализируем...' : 'Получить фидбек'}
            </button>
            {feedback && (
              <div className="mt-6 bg-[#0A0F1E] border border-purple-500/30 rounded-xl p-4 text-gray-200 whitespace-pre-wrap">
                <span className="text-purple-400 font-semibold block mb-2">🤖 Обратная связь:</span>
                {feedback}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
         }
