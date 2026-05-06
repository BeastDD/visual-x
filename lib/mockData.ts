export interface Video {
  id: string;
  url: string;
  title: string;
  username: string;
  channel: string;
  thumbnail?: string;
}

export interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  isNSFW?: boolean;
  isCustom?: boolean;
  videos: Video[];
}

const sampleVideos: Omit<Video, 'channel'>[] = [
  { id: 'v1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Big Buck Bunny - Classic Short', username: '@animationstudio' },
  { id: 'v2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: 'Elephants Dream - Open Movie', username: '@blenderfoundation' },
  { id: 'v3', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', title: 'Sintel - Epic Fantasy Short', username: '@blender' },
  { id: 'v4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Tears_of_Steel.mp4', title: 'Tears of Steel - Sci-Fi Action', username: '@blender' },
  { id: 'v5', url: 'https://test-streams.github.io/streams/xbox.mp4', title: 'Xbox Trailer - Gaming Highlights', username: '@xbox' },
  { id: 'v6', url: 'https://test-streams.github.io/streams/bbb.mp4', title: 'Big Buck Bunny Remastered', username: '@demo' },
  // Add more real X-style samples here. In production replace with X API media URLs
];

export const premadeChannels: Channel[] = [
  {
    id: 'news',
    name: 'News',
    icon: '📰',
    description: 'Breaking news clips and updates from X',
    videos: [
      { ...sampleVideos[0], id: 'n1', title: 'World News Update - Major Events', username: '@cnn', channel: 'News' },
      { ...sampleVideos[1], id: 'n2', title: 'Tech News Today', username: '@techcrunch', channel: 'News' },
      { ...sampleVideos[2], id: 'n3', title: 'Politics Roundup', username: '@bbcnews', channel: 'News' },
    ]
  },
  {
    id: 'popmusic',
    name: 'Pop Music',
    icon: '🎵',
    description: 'Latest pop hits, performances & music videos',
    videos: [
      { ...sampleVideos[0], id: 'p1', title: 'Taylor Swift - New Era Performance', username: '@taylorswift', channel: 'Pop Music' },
      { ...sampleVideos[3], id: 'p2', title: 'The Weeknd - Live from X', username: '@theweeknd', channel: 'Pop Music' },
      { ...sampleVideos[4], id: 'p3', title: 'Billie Eilish - Hit Single', username: '@billieeilish', channel: 'Pop Music' },
    ]
  },
  {
    id: 'adult',
    name: 'Adult X',
    icon: '🔞',
    description: 'Mature content - 18+ only',
    isNSFW: true,
    videos: [
      { ...sampleVideos[1], id: 'a1', title: 'Exclusive Adult Clip 01', username: '@adultcreator1', channel: 'Adult X' },
      { ...sampleVideos[2], id: 'a2', title: 'Mature Content Highlight', username: '@nsfwvault', channel: 'Adult X' },
    ]
  },
  {
    id: 'docusserie',
    name: 'DocuSerie',
    icon: '🎥',
    description: 'Documentaries and serialized storytelling',
    videos: [
      { ...sampleVideos[0], id: 'd1', title: 'Planet Earth Highlights', username: '@natgeo', channel: 'DocuSerie' },
      { ...sampleVideos[3], id: 'd2', title: 'True Crime Series - Episode 1', username: '@netflix', channel: 'DocuSerie' },
    ]
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    icon: '🦸',
    description: 'Classic and modern cartoons',
    videos: [
      { ...sampleVideos[1], id: 'c1', title: 'Looney Tunes Best Moments', username: '@looneytunes', channel: 'Cartoon' },
      { ...sampleVideos[4], id: 'c2', title: 'SpongeBob - Funny Clips', username: '@spongebob', channel: 'Cartoon' },
    ]
  },
  {
    id: 'anime',
    name: 'Anime',
    icon: '🌸',
    description: 'Popular anime clips and highlights',
    videos: [
      { ...sampleVideos[2], id: 'an1', title: 'Attack on Titan - Epic Scene', username: '@aot_official', channel: 'Anime' },
      { ...sampleVideos[3], id: 'an2', title: 'Jujutsu Kaisen Best Fights', username: '@jujutsukaisen', channel: 'Anime' },
      { ...sampleVideos[0], id: 'an3', title: 'Demon Slayer - Hashira Training', username: '@demonslayer', channel: 'Anime' },
    ]
  },
  {
    id: 'sports',
    name: 'Sports Highlights',
    icon: '⚽',
    description: 'Goals, dunks, and unforgettable moments',
    videos: [
      { ...sampleVideos[4], id: 's1', title: 'NBA Top 10 Plays', username: '@nba', channel: 'Sports Highlights' },
      { ...sampleVideos[5], id: 's2', title: 'Premier League Goals', username: '@premierleague', channel: 'Sports Highlights' },
    ]
  },
  {
    id: 'tech',
    name: 'Tech & Gadgets',
    icon: '💻',
    description: 'Latest tech reviews and unboxings',
    videos: [
      { ...sampleVideos[1], id: 't1', title: 'iPhone 17 Review', username: '@mkbhd', channel: 'Tech & Gadgets' },
      { ...sampleVideos[2], id: 't2', title: 'AI Breakthrough 2026', username: '@verge', channel: 'Tech & Gadgets' },
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming Clips',
    icon: '🎮',
    description: 'Epic gameplay and esports moments',
    videos: [
      { ...sampleVideos[4], id: 'g1', title: 'Valorant Ace Clutch', username: '@valorant', channel: 'Gaming Clips' },
      { ...sampleVideos[0], id: 'g2', title: 'Fortnite Highlights', username: '@fortnite', channel: 'Gaming Clips' },
      { ...sampleVideos[3], id: 'g3', title: 'League of Legends World', username: '@lolesports', channel: 'Gaming Clips' },
    ]
  },
];

export const getAllVideos = () => premadeChannels.flatMap(c => c.videos);

export const generateShareCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();