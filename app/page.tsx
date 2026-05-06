'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume2, Users, Share2, Plus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { premadeChannels, Channel, Video, generateShareCode } from '../lib/mockData';
import { signIn, useSession, signOut } from 'next-auth/react';

interface User {
  name: string;
  handle: string;
}

export default function VisualX() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<Channel[]>(premadeChannels);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [showTVMode, setShowTVMode] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [myChannels, setMyChannels] = useState<Channel[]>([]);
  const [sharedChannels, setSharedChannels] = useState<Channel[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentVideo = currentChannel ? currentChannel.videos[currentVideoIndex] : null;
  const queue = currentChannel ? currentChannel.videos : [];

  // Real X Login via NextAuth
  const handleLogin = () => {
    signIn('twitter');
  };

  const handleLogout = () => {
    signOut();
    setUser(null);
    setCurrentChannel(null);
    setShowTVMode(false);
    toast.info('Logged out');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentChannel || !showTVMode) return;
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowRight') nextVideo();
      if (e.key === 'ArrowLeft') prevVideo();
      if (e.key.toLowerCase() === 's') setIsShuffle(!isShuffle);
      if (e.key.toLowerCase() === 'f') toggleTVMode();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChannel, showTVMode, isShuffle]);

  // Video progress
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      progressInterval.current = setInterval(() => {
        const vid = videoRef.current;
        if (vid && vid.duration) {
          setProgress((vid.currentTime / vid.duration) * 100);
        }
      }, 200);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
    } else {
      vid.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextVideo = () => {
    if (!currentChannel) return;
    let nextIndex = currentVideoIndex + 1;
    if (nextIndex >= queue.length) {
      if (isShuffle) {
        const shuffled = [...queue].sort(() => Math.random() - 0.5);
        currentChannel.videos = shuffled;
        nextIndex = 0;
      } else {
        nextIndex = 0;
      }
    }
    setCurrentVideoIndex(nextIndex);
    setProgress(0);
    setIsPlaying(true);
    setTimeout(() => {
      videoRef.current?.play().catch(console.error);
    }, 100);
  };

  const prevVideo = () => {
    if (!currentChannel) return;
    let prevIndex = currentVideoIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;
    setCurrentVideoIndex(prevIndex);
    setProgress(0);
    setIsPlaying(true);
  };

  const selectChannel = (channel: Channel) => {
    if (channel.isNSFW) {
      setShowAgeGate(true);
      setCurrentChannel(channel);
      return;
    }
    setCurrentChannel(channel);
    setCurrentVideoIndex(0);
    setProgress(0);
    setIsPlaying(false);
    setShowTVMode(true);
    toast.success(`Now playing: ${channel.name}`);
  };

  const confirmAgeGate = () => {
    setShowAgeGate(false);
    if (currentChannel) {
      setShowTVMode(true);
      toast.success(`Entering ${currentChannel.name} - 18+`);
    }
  };

  const toggleTVMode = () => {
    if (!currentChannel) return;
    setShowTVMode(!showTVMode);
  };

  const handleVideoEnd = () => {
    nextVideo();
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const vid = videoRef.current;
    if (vid && vid.duration) {
      vid.currentTime = percent * vid.duration;
      setProgress(percent * 100);
    }
  };

  const changeVolume = (newVol: number) => {
    const vid = videoRef.current;
    if (vid) vid.volume = newVol;
    setVolume(newVol);
  };

  const addCustomChannel = () => {
    if (!newHandle.trim()) return;
    const handle = newHandle.trim().replace('@', '');
    const newChannel: Channel = {
      id: `custom-${Date.now()}`,
      name: `${handle}'s Feed`,
      icon: 'ðŸ‘¤',
      description: `Videos from @${handle}`,
      isCustom: true,
      videos: [
        ...premadeChannels[0].videos.slice(0, 2).map((v, i) => ({
          ...v,
          id: `custom-${handle}-${i}`,
          title: `${handle} - Post ${i + 1}`,
          username: `@${handle}`,
          channel: `${handle}'s Feed`
        }))
      ]
    };
    setMyChannels(prev => [...prev, newChannel]);
    setChannels(prev => [...prev, newChannel]);
    setNewHandle('');
    setShowAddChannel(false);
    toast.success(`Added @${handle}'s channel`);
  };

  const shareCurrentChannel = () => {
    if (!currentChannel) return;
    const code = generateShareCode();
    setShareCode(code);
    setShowShareModal(true);
    toast.success('Share code generated!');
  };

  const redeemShareCode = (code: string) => {
    const mockChannel = premadeChannels[1];
    const redeemed: Channel = {
      ...mockChannel,
      id: `shared-${code}`,
      name: `${mockChannel.name} (Shared)`,
      isCustom: true
    };
    setSharedChannels(prev => [...prev, redeemed]);
    setChannels(prev => [...prev, redeemed]);
    toast.success('Channel added from share code!');
  };

  return (
    <div className="min-h-screen bg-x-black text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-x-red rounded-xl flex items-center justify-center text-2xl">📺</div>
              <div>
                <h1 className="text-2xl font-bold tracking-tighter">VISUAL X</h1>
                <p className="text-[10px] text-white/50 -mt-1">TV FOR X</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">{session.user?.name}</div>
                  <div className="text-xs text-white/50">@{session.user?.name}</div>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-all active:scale-[0.985]"
              >
                <span>Sign in with X</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="pt-16 flex h-screen">
        {/* Sidebar */}
        <div className="w-72 border-r border-white/10 bg-black/60 p-4 flex flex-col">
          <div className="px-3 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm tracking-widest text-white/70">CHANNELS</h2>
              <button 
                onClick={() => setShowAddChannel(true)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-x-red"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto pr-2">
            {channels.map((channel, idx) => (
              <motion.button
                key={channel.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => selectChannel(channel)}
                className={`channel-card w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left ${currentChannel?.id === channel.id ? 'bg-white/10 border border-x-red/50' : 'hover:bg-white/5'}`}
              >
                <div className="text-2xl flex-shrink-0">{channel.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium flex items-center gap-2">
                    {channel.name}
                    {channel.isNSFW && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-px rounded">18+</span>}
                    {channel.isCustom && <span className="text-xs bg-white/20 px-1.5 py-px rounded">CUSTOM</span>}
                  </div>
                  <div className="text-xs text-white/50 truncate">{channel.description}</div>
                </div>
                <div className="text-xs text-white/40">{channel.videos.length}</div>
              </motion.button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-white/10 text-xs text-white/50 px-3">
            <div>9 Premade • {myChannels.length + sharedChannels.length} Custom</div>
            <div className="mt-1">Press <span className="font-mono">F</span> for TV Mode</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {!currentChannel ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="mx-auto w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                  <span className="text-6xl">📺</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tighter mb-3">Welcome to Visual X</h2>
                <p className="text-white/60 mb-8">Select a channel from the sidebar to begin the infinite TV experience.</p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <div className="font-semibold mb-1">TV Mode</div>
                    <div className="text-xs text-white/50">Random • Auto-next • Infinite</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <div className="font-semibold mb-1">Custom Feeds</div>
                    <div className="text-xs text-white/50">Link any X accounts</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Video Player Area */}
              <div className="flex-1 relative bg-black flex items-center justify-center p-6">
                <div className="w-full max-w-[1100px] aspect-video bg-black rounded-3xl overflow-hidden tv-glow border border-white/10 shadow-2xl">
                  <div className="video-container relative h-full">
                    {currentVideo && (
                      <video
                        ref={videoRef}
                        src={currentVideo.url}
                        className="w-full h-full"
                        autoPlay={isPlaying}
                        onEnded={handleVideoEnd}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onLoadedMetadata={() => {
                          if (videoRef.current) videoRef.current.volume = volume;
                        }}
                        playsInline
                      />
                    )}

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="text-sm text-white/60">NOW PLAYING FROM</div>
                          <div className="text-2xl font-semibold tracking-tight">{currentChannel.name}</div>
                          <div className="text-white/70">{currentVideo?.title}</div>
                          <div className="text-xs text-white/50">{currentVideo?.username}</div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={toggleTVMode} className="control-btn px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm flex items-center gap-2">
                            {showTVMode ? 'Exit TV' : 'Enter TV Mode'}
                          </button>
                          <button onClick={shareCurrentChannel} className="control-btn p-3 bg-white/10 hover:bg-white/20 rounded-full">
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div 
                        className="h-1.5 bg-white/20 rounded-full cursor-pointer mb-4" 
                        onClick={seekTo}
                      >
                        <div 
                          className="progress-bar rounded-full" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>

                      {/* Bottom Controls */}
                      <div className="flex items-center gap-4 text-white">
                        <button onClick={prevVideo} className="control-btn p-2">
                          <SkipBack size={22} />
                        </button>
                        <button 
                          onClick={togglePlay} 
                          className="control-btn p-3 bg-white text-black rounded-full hover:bg-white/90"
                        >
                          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                        </button>
                        <button onClick={nextVideo} className="control-btn p-2">
                          <SkipForward size={22} />
                        </button>

                        <div className="flex-1" />

                        <div className="flex items-center gap-3">
                          <button onClick={() => setIsShuffle(!isShuffle)} className={`control-btn p-2 ${isShuffle ? 'text-x-red' : ''}`}>
                            <Shuffle size={20} />
                          </button>

                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <Volume2 size={18} />
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.05"
                              value={volume}
                              onChange={(e) => changeVolume(parseFloat(e.target.value))}
                              className="w-24 accent-x-red"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Bar */}
              <div className="h-14 border-t border-white/10 bg-black/80 px-6 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-white/60">
                  <div>Channel {currentChannel.name}</div>
                  <div>•</div>
                  <div>{currentVideoIndex + 1} / {queue.length}</div>
                  <div>•</div>
                  <div className={isShuffle ? 'text-x-red' : ''}>Shuffle {isShuffle ? 'ON' : 'OFF'}</div>
                </div>
                <div className="text-xs text-white/40">Space: Play/Pause • ← → : Skip • S: Shuffle • F: Full TV</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Channel Modal */}
      <AnimatePresence>
        {showAddChannel && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]" onClick={() => setShowAddChannel(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/20 rounded-3xl p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-2">Create Custom Channel</h3>
              <p className="text-white/60 text-sm mb-6">Link any X account to pull videos automatically (demo mode)</p>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  placeholder="@username"
                  className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-x-red"
                />
                <button 
                  onClick={addCustomChannel}
                  className="px-8 bg-x-red hover:bg-red-600 rounded-2xl font-semibold transition-all active:scale-[0.985]"
                >
                  Add
                </button>
              </div>
              <p className="text-[10px] text-white/40 mt-3">In production this would use the X API to fetch recent media from the account.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]" onClick={() => setShowShareModal(false)}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-950 border border-white/20 rounded-3xl p-8 w-full max-w-sm text-center"
            >
              <div className="mx-auto w-16 h-16 bg-x-red/10 rounded-full flex items-center justify-center mb-4">
                <Share2 className="text-x-red" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Share Channel</h3>
              <p className="text-white/60 mb-6">Anyone with this code can add it to their dashboard</p>
              
              <div className="bg-white/5 font-mono text-4xl tracking-[4px] py-4 rounded-2xl mb-6 border border-white/10">
                {shareCode}
              </div>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareCode);
                  toast.success('Code copied to clipboard!');
                }}
                className="w-full py-3.5 bg-white text-black font-semibold rounded-2xl mb-3 active:scale-[0.985]"
              >
                Copy Code
              </button>
              <button onClick={() => setShowShareModal(false)} className="text-sm text-white/50 hover:text-white">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Age Gate */}
      <AnimatePresence>
        {showAgeGate && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md text-center p-10"
            >
              <div className="text-7xl mb-6">🔞</div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">18+ Content</h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                This channel contains mature content. By continuing you confirm you are 18 years or older.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => { setShowAgeGate(false); setCurrentChannel(null); }}
                  className="flex-1 py-4 border border-white/30 rounded-2xl hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAgeGate}
                  className="flex-1 py-4 bg-x-red hover:bg-red-600 rounded-2xl font-semibold transition-all active:scale-[0.985]"
                >
                  I am 18+ - Enter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
