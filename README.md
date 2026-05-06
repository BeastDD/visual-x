# Visual X

**A TV-like experience for consuming video content from X (formerly Twitter).**

Random infinite playback • 9 thematic premade channels • User-created channels from any X accounts • Shareable channel codes • Modern dark TV interface

## 🚀 Live Demo

Open the app and start watching instantly:

```bash
git clone https://github.com/BeastDD/visual-x.git
cd visual-x
npm install
npm run dev
```

Then open http://localhost:3000

## ✨ Features

- **Infinite TV Mode**: Videos play one after another automatically with shuffle and loop
- **9 Premade Channels**: News, Pop Music, Adult X (18+), DocuSerie, Cartoon, Anime, Sports Highlights, Tech & Gadgets, Gaming Clips
- **Custom Channels**: Add any @username — pulls mock videos (real X API ready)
- **Shareable Codes**: Generate a code to share channels with friends
- **Keyboard Shortcuts**: Space (play/pause), ← → (skip), S (shuffle), F (TV mode)
- **Age Gate**: Proper warning for NSFW channel
- **Simulated X Login**: One-click demo login

## 🛠 Tech Stack

- Next.js 15 (App Router)
- TypeScript + Tailwind CSS
- Framer Motion (smooth animations)
- Sonner (beautiful toasts)
- Lucide Icons
- HTML5 Video (reliable auto-next)

## 🔑 Real X API Integration (Production)

To use real videos from X:

1. Go to https://developer.x.com and create a Project + App
2. Get your Bearer Token (or use OAuth 2.0 with user context)
3. Add to `.env.local`:
   ```
   X_BEARER_TOKEN=your_token_here
   ```
4. Replace mock data in `lib/mockData.ts` with real API calls:
   - Use `/2/tweets/search/recent?query=filter:videos` for channels
   - Use `/2/users/:id/timelines/reverse_chronological` for user feeds
   - Filter media fields for video URLs

**Note**: X API has rate limits. Use caching (Redis) and pagination in production.

## ⚠️ Important Legal & Content Notes

- This is a demo. Real deployment must comply with X Developer Agreement.
- Adult X channel is for demonstration only. Implement proper age verification (e.g. OAuth + age check) before going live.
- Videos are currently sample public-domain clips. Replace with real X video URLs.
- Do not redistribute X content commercially without proper licensing/partnership.

## 📦 Next Steps

- Add real X OAuth login with next-auth
- Connect to X API v2 for live video fetching
- Add backend (Supabase / PlanetScale) for persistent user channels & share codes
- Deploy to Vercel

## 📄 License

MIT — feel free to fork and build upon this foundation.

Built with ❤️ for the X community.