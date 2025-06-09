
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Music, ListMusic } from 'lucide-react';
import PinAuth from '@/components/PinAuth';
import SongGenerator from '@/components/SongGenerator';
import PlaylistManager from '@/components/PlaylistManager';
import SongLibrary from '@/components/SongLibrary';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  vocalType: string;
  duration: string;
  version: string;
  lyrics: string;
  coverUrl?: string;
  audioUrl?: string;
  createdAt: Date;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  if (!isAuthenticated) {
    return <PinAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleSongGenerated = (song: Song) => {
    setSongs(prev => [song, ...prev]);
  };

  const handleDeleteSong = (songId: string) => {
    setSongs(prev => prev.filter(song => song.id !== songId));
  };

  const handleCloneSong = (song: Song) => {
    const clonedSong: Song = {
      ...song,
      id: Date.now().toString(),
      title: `${song.title} (Remix)`,
      createdAt: new Date()
    };
    setSongs(prev => [clonedSong, ...prev]);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full music-gradient pulse-glow">
              <Music className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Music Creator & Playlist Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate professional songs with AI vocals, lyrics, and custom arrangements
          </p>
        </div>

        <Card className="glass-effect mb-6">
          <CardContent className="p-0">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="library" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  My Songs
                </TabsTrigger>
                <TabsTrigger value="playlists" className="flex items-center gap-2">
                  <ListMusic className="h-4 w-4" />
                  Playlists
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="generate" className="mt-0">
                  <SongGenerator onSongGenerated={handleSongGenerated} />
                </TabsContent>
                
                <TabsContent value="library" className="mt-0">
                  <SongLibrary 
                    songs={songs} 
                    onDeleteSong={handleDeleteSong}
                    onCloneSong={handleCloneSong}
                  />
                </TabsContent>
                
                <TabsContent value="playlists" className="mt-0">
                  <PlaylistManager songs={songs} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Professional AI Music Creator - Generate, Edit, and Manage Your Songs</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
