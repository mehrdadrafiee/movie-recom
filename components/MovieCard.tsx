import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, TagIcon } from "lucide-react";
import StreamingPlatform from "@/components/StreamingPlatform";

interface MovieRecommendation {
  title: string;
  year: string;
  reason: string;
  genre: string;
  streaming: string;
}

export default function MovieCard({ movie, isWatched, onWatchedToggle, loading }: { movie: MovieRecommendation, isWatched: boolean, onWatchedToggle: (movieId: string) => void, loading: boolean }) {
  const movieId = `${movie.title}-${movie.year}`;

  return (
    <Card className={`${isWatched ? 'bg-green-50 border-green-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className={`text-lg ${isWatched ? 'text-green-800 line-through' : ''}`}>
              {movie.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="flex items-center text-sm text-gray-600">
          <CalendarIcon size={16} className="mr-2" />
          {movie.year}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center">
          <TagIcon size={16} className="mr-2" />
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
            {movie.genre}
          </span>
        </div>
        <StreamingPlatform streaming={movie.streaming} />
        <p className="text-sm leading-relaxed text-gray-700">
          {movie.reason}
        </p>
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Checkbox disabled={loading} checked={isWatched} onCheckedChange={() => onWatchedToggle(movieId)} />
          <span className="text-sm text-muted-foreground">Watched</span>
        </div>
      </CardFooter>
    </Card>
  );
}