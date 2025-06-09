import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Download, Edit, Copy, Trash2, Search, Pause } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  vocal_type: string;
  duration: string;
  version: string;
  lyrics: string;
  cover_url?: string;
  audio_url?: string;
  created_at: string;
}

interface SongLibraryProps {
  songs: Song[];
  loading: boolean;
  onDeleteSong: (songId: string) => void;
  onCloneSong: (song: Song) => void;
}

const SongLibrary = ({ songs, loading, onDeleteSong, onCloneSong }: SongLibraryProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || song.genre.toLowerCase().includes(filterGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  const uniqueGenres = [...new Set(songs.map(song => song.genre))];

  const playSong = (song: Song) => {
    if (!song.audio_url || !audioRef.current) return;

    if (currentlyPlaying === song.id) {
      // Pause current song
      audioRef.current.pause();
      setCurrentlyPlaying(null);
      toast({
        title: "Paused",
        description: `"${song.title}" paused`
      });
    } else {
      // Play new song
      audioRef.current.src = song.audio_url;
      audioRef.current.play().then(() => {
        setCurrentlyPlaying(song.id);
        toast({
          title: "Now Playing",
          description: `"${song.title}" by ${song.artist}`
        });
      }).catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Error",
          description: "Could not play audio",
          variant: "destructive"
        });
      });
    }
  };

  const downloadSong = (song: Song) => {
    if (!song.audio_url) return;
    
    const link = document.createElement('a');
    link.href = song.audio_url;
    link.download = `${song.artist}_${song.title}.wav`;
    link.click();
    
    toast({
      title: "Downloaded",
      description: `"${song.title}" downloaded successfully!`
    });
  };

  const deleteSong = (song: Song) => {
    // Stop playing if this song is currently playing
    if (currentlyPlaying === song.id && audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    }
    
    onDeleteSong(song.id);
    toast({
      title: "Song Deleted",
      description: `"${song.title}" has been deleted`
    });
  };

  const cloneSong = (song: Song) => {
    onCloneSong(song);
    toast({
      title: "Song Cloned",
      description: `"${song.title}" has been cloned for remixing`
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            placeholder="Filter by genre..."
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="sm:w-48"
          />
        </div>

        {uniqueGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterGenre === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterGenre('')}
            >
              All
            </Button>
            {uniqueGenres.map((genre) => (
              <Button
                key={genre}
                variant={filterGenre === genre ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterGenre(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="glass-effect" />
          <Skeleton className="glass-effect" />
          <Skeleton className="glass-effect" />
          <Skeleton className="glass-effect" />
          <Skeleton className="glass-effect" />
          <Skeleton className="glass-effect" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={() => setCurrentlyPlaying(null)}
        onError={() => {
          console.error('Audio playback error');
          setCurrentlyPlaying(null);
        }}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          placeholder="Filter by genre..."
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="sm:w-48"
        />
      </div>

      {uniqueGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterGenre === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterGenre('')}
          >
            All
          </Button>
          {uniqueGenres.map((genre) => (
            <Button
              key={genre}
              variant={filterGenre === genre ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterGenre(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map((song) => (
          <Card key={song.id} className="glass-effect">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{song.title}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>
                {song.cover_url && (
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">{song.genre}</Badge>
                {song.mood && <Badge variant="outline">{song.mood}</Badge>}
                <Badge variant="outline">{song.duration}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {song.vocal_type && (
                  <p className="text-sm text-muted-foreground">
                    Vocal: {song.vocal_type}
                  </p>
                )}
                
                {song.version && (
                  <p className="text-sm text-muted-foreground">
                    Style: {song.version}
                  </p>
                )}

                <div className="flex flex-wrap gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => playSong(song)}
                    className={currentlyPlaying === song.id ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {currentlyPlaying === song.id ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadSong(song)}>
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => cloneSong(song)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteSong(song)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  Created {new Date(song.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSongs.length === 0 && songs.length > 0 && (
        <Card className="glass-effect">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No songs found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {songs.length === 0 && (
        <Card className="glass-effect">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-3 rounded-full music-gradient mb-4">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium mb-2">No songs yet</h3>
            <p className="text-muted-foreground text-center">
              Generate your first AI song to get started!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SongLibrary;
