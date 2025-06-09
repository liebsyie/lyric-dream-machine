
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Music, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverUrl?: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverUrl?: string;
  isPublic: boolean;
  createdAt: Date;
}

interface PlaylistManagerProps {
  songs: Song[];
}

const PlaylistManager = ({ songs }: PlaylistManagerProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name",
        variant: "destructive"
      });
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      description: newPlaylistDescription,
      songs: [],
      isPublic: false,
      createdAt: new Date()
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setIsCreateDialogOpen(false);

    toast({
      title: "Playlist Created",
      description: `"${newPlaylistName}" has been created successfully!`
    });
  };

  const deletePlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    
    toast({
      title: "Playlist Deleted",
      description: `"${playlist?.name}" has been deleted`
    });
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, songs: [...playlist.songs, song] }
        : playlist
    ));

    toast({
      title: "Song Added",
      description: `"${song.title}" added to playlist`
    });
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, songs: playlist.songs.filter(s => s.id !== songId) }
        : playlist
    ));

    toast({
      title: "Song Removed",
      description: "Song removed from playlist"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Playlists</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="music-gradient hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect">
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Playlist Name</label>
                <Input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <Input
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              <Button onClick={createPlaylist} className="w-full music-gradient hover:opacity-90">
                Create Playlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="glass-effect">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{playlist.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{playlist.songs.length} songs</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deletePlaylist(playlist.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {playlist.songs.slice(0, 3).map((song) => (
                  <div key={song.id} className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                    <Music className="h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {playlist.songs.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{playlist.songs.length - 3} more songs
                  </p>
                )}

                {playlist.songs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No songs in this playlist yet
                  </p>
                )}

                <div className="pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        Add Songs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-effect max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Songs to "{playlist.name}"</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {songs.filter(song => !playlist.songs.find(ps => ps.id === song.id)).map((song) => (
                          <div key={song.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                            <div className="flex items-center gap-3">
                              <Music className="h-4 w-4" />
                              <div>
                                <p className="font-medium">{song.title}</p>
                                <p className="text-sm text-muted-foreground">{song.artist}</p>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => addSongToPlaylist(playlist.id, song)}
                              className="music-gradient hover:opacity-90"
                            >
                              Add
                            </Button>
                          </div>
                        ))}
                        {songs.filter(song => !playlist.songs.find(ps => ps.id === song.id)).length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            All available songs are already in this playlist
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {playlists.length === 0 && (
          <Card className="glass-effect col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first playlist to organize your generated songs
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="music-gradient hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Playlist
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;
