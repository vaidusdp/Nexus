import React, { useEffect, useState } from 'react';
import { Plus, Lock, X } from 'lucide-react';
import { Button } from '../components/Button';
import { LobbyCard } from '../components/LobbyCard';
import API from '../api/axios';

export function Dashboard() {
  const [isBetaLockOpen, setIsBetaLockOpen] = useState(false);
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLobbies = async () => {
    try {
      setLoading(true);
      const response = await API.get('/lobby');

      if (response.data?.success) {
        setLobbies(response.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching lobbies:", error);
      setError('Failed to load active lobbies. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLobbies();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Active Lobbies</h1>
          <p className="text-gray-400">Join a game or create your own instance.</p>
        </div>
        <Button onClick={() => setIsBetaLockOpen(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          Create Lobby
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lobbies.map(lobby => (
          <LobbyCard key={lobby._id} lobby={lobby} onLobbyJoin={fetchLobbies} />
        ))}
      </div>

      {/* Themed Beta Restriction Warning Modal */}
      {isBetaLockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-vexor-card w-full max-w-md rounded-xl border border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-800/60 bg-[#111]">
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <Lock className="w-5 h-5 text-vexor-accent" />
                Beta Portal Restricted
              </h2>
              <button 
                onClick={() => setIsBetaLockOpen(false)} 
                className="text-gray-400 hover:text-white p-1.5 rounded-md transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-vexor-accent/10 border border-vexor-accent/30 rounded-full flex items-center justify-center mx-auto text-vexor-accent shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Lobby Creation Locked</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Lobby creation is locked for the public beta test phase.
                </p>
                <p className="text-gray-500 text-xs">
                  Explore active lobbies and join existing server instances via the dashboard.
                </p>
              </div>
            </div>
            <div className="p-5 border-t border-gray-800/60 bg-[#111] flex justify-end">
              <Button onClick={() => setIsBetaLockOpen(false)} variant="primary" className="px-6">
                Acknowledge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
