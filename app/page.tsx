'use client';

import React, { useState } from 'react';
import { SearchIcon, FilmIcon, CheckCircleIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import MovieCard from '@/components/MovieCard';

interface MovieRecommendation {
  title: string;
  year: string;
  reason: string;
  genre: string;
  streaming: string;
}

const formSchema = z.object({
  favoriteMovie: z.string().min(1, {
    message: 'Please enter a movie title',
  }).max(100, {
    message: 'Movie title is too long',
  }),
});

// Helper function to format recommendation chain
function formatRecommendationChain(chain: string[]) {
  if (chain.length <= 4) {
    return chain.join(' → ');
  }
  
  const firstTwo = chain.slice(0, 2);
  const lastTwo = chain.slice(-2);
  
  return `${firstTwo.join(' → ')} → ... → ${lastTwo.join(' → ')}`;
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendationChain, setRecommendationChain] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favoriteMovie: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError('');
    setRecommendations([]);
    setWatchedMovies(new Set());

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favoriteMovie: values.favoriteMovie.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      setRecommendations(data.recommendations);
      setRecommendationChain([values.favoriteMovie]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchedToggle = async (movieId: string) => {
    const isCurrentlyWatched = watchedMovies.has(movieId);
    
    // Update the watched movies state
    setWatchedMovies(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyWatched) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });

    // If marking as watched, get new recommendations based on this movie
    // Only if we haven't already used this movie as a source recently
    if (!isCurrentlyWatched) {
      const movie = recommendations.find(m => `${m.title}-${m.year}` === movieId);
      if (movie && !recommendationChain.includes(movie.title)) {
        setLoading(true);
        try {
          const response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              favoriteMovie: movie.title,
              excludeMovies: Array.from(watchedMovies).map(id => {
                const [title, year] = id.split('-');
                return { title, year };
              })
            }),
          });

          const data = await response.json();

          if (response.ok && data.recommendations) {
            // Replace recommendations instead of adding to them
            // Filter out movies that are already watched
            const watchedTitles = new Set(Array.from(watchedMovies).map(id => id.split('-')[0]));
            
            const filteredRecommendations = data.recommendations.filter(
              (rec: MovieRecommendation) => !watchedTitles.has(rec.title)
            );

            if (filteredRecommendations.length > 0) {
              setRecommendations(filteredRecommendations);
              setRecommendationChain(prev => [...prev, movie.title]);
            }
          }
        } catch (err) {
          console.error('Error getting additional recommendations:', err);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {recommendations.length === 0 
                ? "Analyzing your favorite movie..." 
                : "Getting more recommendations..."
              }
            </h3>
            <p className="text-gray-600">
              {recommendations.length === 0 
                ? "We're finding the perfect movies for you based on your taste"
                : "We're discovering new films based on your selection"
              }
            </p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FilmIcon size={48} className="text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-black">Movie Recommender</h1>
          </div>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Tell us your favorite movie and we&apos;ll recommend similar films you might love
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="favoriteMovie"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <SearchIcon size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                        <Input
                          {...field}
                          placeholder="Enter your favorite movie (e.g., The Matrix, Inception, Pulp Fiction)"
                          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-2"></div>
                    Finding recommendations...
                  </div>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
            </form>
          </Form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {recommendations.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  Movie Recommendations
                </h2>
                {recommendationChain.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm text-gray-600 mt-1 cursor-help">
                          Based on: <span className="font-medium underline decoration-dotted">
                            {formatRecommendationChain(recommendationChain)}
                          </span>
                        </p>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium text-xs">Full recommendation chain:</p>
                          <div className="text-xs space-y-1">
                            {recommendationChain.map((movie, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-gray-400 text-xs w-4">{index + 1}.</span>
                                <span>{movie}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span>{watchedMovies.size} watched</span>
                </div>
                <div className="flex items-center gap-2">
                  <FilmIcon className="w-4 h-4 text-blue-500" />
                  <span>{recommendations.length} recommendations</span>
                </div>

              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((movie, index) => (
                <MovieCard
                  key={`${movie.title}-${movie.year}`}
                  movie={movie}
                  isWatched={watchedMovies.has(`${movie.title}-${movie.year}`)}
                  onWatchedToggle={handleWatchedToggle}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
