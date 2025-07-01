# Movie Recommender

A beautiful Next.js application that recommends movies similar to your favorite films using OpenAI's GPT model.

## Features

- 🎬 Enter your favorite movie and get personalized recommendations
- 🤖 Powered by OpenAI's GPT-3.5-turbo for intelligent movie suggestions
- 🎨 Modern, responsive UI with beautiful gradients and animations
- 📱 Mobile-friendly design
- ⚡ Fast and efficient API calls

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie-recom
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   To get an OpenAI API key:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Sign up or log in
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How it works

1. Enter your favorite movie in the search input
2. Click "Get Recommendations" 
3. The app sends your movie to OpenAI's API
4. OpenAI analyzes the movie and returns 5 similar recommendations
5. Each recommendation includes:
   - Movie title
   - Release year
   - Genre
   - Brief explanation of why it's similar

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - Movie recommendations
- **Lucide React** - Icons

## API Endpoints

- `POST /api/recommendations` - Get movie recommendations
  - Body: `{ "favoriteMovie": "string" }`
  - Returns: `{ "recommendations": [...] }`

## Deployment

This app can be easily deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel
4. Deploy!

## License

MIT
