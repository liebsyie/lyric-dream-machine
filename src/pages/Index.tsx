
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Music, ListMusic } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PinAuth from '@/components/PinAuth';
import SongGenerator from '@/components/SongGenerator';
import PlaylistManager from '@/components/PlaylistManager';
import SongLibrary from '@/components/SongLibrary';
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

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadSongs();
      setupRealtimeSubscription();
    }
  }, [isAuthenticated]);

  const loadSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading songs:', error);
        toast({
          title: "Error",
          description: "Failed to load songs",
          variant: "destructive"
        });
        return;
      }

      setSongs(data || []);
    } catch (error) {
      console.error('Error loading songs:', error);
      toast({
        title: "Error", 
        description: "Failed to load songs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('songs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs'
        },
        (payload) => {
          console.log('Song change received:', payload);
          if (payload.eventType === 'INSERT') {
            setSongs(prev => [payload.new as Song, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setSongs(prev => prev.filter(song => song.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setSongs(prev => prev.map(song => 
              song.id === payload.new.id ? payload.new as Song : song
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (!isAuthenticated) {
    return <PinAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleSongGenerated = (song: Song) => {
    // Song will be automatically added via realtime subscription
    console.log('Song generated:', song);
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) {
        console.error('Error deleting song:', error);
        toast({
          title: "Error",
          description: "Failed to delete song",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      toast({
        title: "Error",
        description: "Failed to delete song", 
        variant: "destructive"
      });
    }
  };

  const handleCloneSong = async (song: Song) => {
    try {
      const clonedSong = {
        title: `${song.title} (Remix)`,
        artist: song.artist,
        genre: song.genre,
        mood: song.mood,
        vocal_type: song.vocal_type,
        duration: song.duration,
        version: song.version,
        lyrics: song.lyrics,
        cover_url: song.cover_url,
        audio_url: song.audio_url
      };

      const { error } = await supabase
        .from('songs')
        .insert([clonedSong]);

      if (error) {
        console.error('Error cloning song:', error);
        toast({
          title: "Error",
          description: "Failed to clone song",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error cloning song:', error);
      toast({
        title: "Error",
        description: "Failed to clone song",
        variant: "destructive"
      });
    }
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
                    loading={loading}
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
