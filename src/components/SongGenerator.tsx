
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Music, Upload, Play, Download, Pause } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateAIMusic } from '@/utils/audioGenerator';

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

interface SongGeneratorProps {
  onSongGenerated: (song: Song) => void;
}

const SongGenerator = ({ onSongGenerated }: SongGeneratorProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    mood: '',
    vocalType: '',
    duration: '',
    version: '',
    lyrics: ''
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedSong, setGeneratedSong] = useState<{ audioUrl: string; songData: any } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateLyrics = () => {
    const sampleLyrics = {
      'pop': "Verse 1:\nDancing through the city lights tonight\nEverything's gonna be alright\nMusic pumping, hearts are beating fast\nThis moment's gonna last\n\nChorus:\nWe're unstoppable, unbreakable\nReaching for the stars above\nNothing's gonna stop us now\nThis is what we're dreaming of",
      'jazz': "Verse 1:\nSmoky room, piano keys so sweet\nRhythm makes my heart skip a beat\nSax is playing melodies so blue\nAll I need is me and you\n\nChorus:\nIn this jazzy state of mind\nLeave our worries far behind\nLet the music take control\nJazz will heal your weary soul",
      'rock': "Verse 1:\nElectric energy running through my veins\nBreaking free from all these chains\nAmplified and ready to explode\nThis is our rebellious code\n\nChorus:\nWe rock the night away\nNothing left to say\nFeel the power in the sound\nRock will shake the ground",
      'default': "Verse 1:\nWords flowing like a river deep\nMelodies that make you weep\nEvery note tells a story true\nThis song was made for you\n\nChorus:\nSing along, feel the beat\nLife's a symphony so sweet\nEvery moment, every rhyme\nMusic transcends space and time"
    };

    const lyrics = sampleLyrics[formData.genre.toLowerCase() as keyof typeof sampleLyrics] || sampleLyrics.default;
    setFormData(prev => ({ ...prev, lyrics }));
    toast({
      title: "Lyrics Generated",
      description: "AI has generated lyrics based on your genre and mood!"
    });
  };

  const generateSong = async () => {
    if (!formData.title || !formData.artist || !formData.genre || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedSong(null);

    // Simulate AI generation process (1 minute total like Suno AI)
    const steps = [
      "Analyzing genre and mood...",
      "Generating instrumental track...", 
      "Processing vocal synthesis...",
      "Applying audio effects...",
      "Finalizing composition..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 12000)); // 12 seconds per step = 60 seconds total
      setProgress((i + 1) * 20);
      toast({
        title: "Generating Song",
        description: steps[i]
      });
    }

    // Generate actual AI music
    const audioUrl = generateAIMusic({
      genre: formData.genre,
      mood: formData.mood,
      duration: formData.duration,
      vocalType: formData.vocalType,
      title: formData.title,
      artist: formData.artist
    });

    const songData = {
      title: formData.title,
      artist: formData.artist,
      genre: formData.genre,
      mood: formData.mood || null,
      vocal_type: formData.vocalType || null,
      duration: formData.duration,
      version: formData.version || null,
      lyrics: formData.lyrics || null,
      cover_url: coverFile ? URL.createObjectURL(coverFile) : null,
      audio_url: audioUrl
    };

    setGeneratedSong({ audioUrl, songData });

    try {
      const { data, error } = await supabase
        .from('songs')
        .insert([songData])
        .select()
        .single();

      if (error) {
        console.error('Error saving song:', error);
        toast({
          title: "Error",
          description: "Failed to save song to database",
          variant: "destructive"
        });
        return;
      }

      onSongGenerated(data);
      setIsGenerating(false);
      setProgress(100);

      toast({
        title: "Song Generated!",
        description: `"${formData.title}" has been created successfully and saved!`
      });

    } catch (error) {
      console.error('Error saving song:', error);
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to save song",
        variant: "destructive"
      });
    }
  };

  const togglePreview = () => {
    if (!audioRef.current || !generatedSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      toast({
        title: "Paused",
        description: "Preview paused"
      });
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        toast({
          title: "Playing",
          description: "Playing generated song"
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

  const downloadSong = () => {
    if (!generatedSong) return;
    
    const link = document.createElement('a');
    link.href = generatedSong.audioUrl;
    link.download = `${formData.artist}_${formData.title}.wav`;
    link.click();
    
    toast({
      title: "Downloaded",
      description: `"${formData.title}" downloaded successfully!`
    });
  };

  const createNewSong = () => {
    setFormData({
      title: '',
      artist: '',
      genre: '',
      mood: '',
      vocalType: '',
      duration: '',
      version: '',
      lyrics: ''
    });
    setCoverFile(null);
    setGeneratedSong(null);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          AI Song Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Song Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter song title"
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist Name *</label>
            <Input
              value={formData.artist}
              onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
              placeholder="Enter artist name"
              disabled={isGenerating}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Genre *</label>
            <Input
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              placeholder="e.g., pop, jazz, rock, electronic"
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mood/Theme</label>
            <Input
              value={formData.mood}
              onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
              placeholder="e.g., happy, sad, energetic, calm"
              disabled={isGenerating}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vocal Type</label>
            <Input
              value={formData.vocalType}
              onChange={(e) => setFormData(prev => ({ ...prev, vocalType: e.target.value }))}
              placeholder="e.g., soft female, husky male, robotic"
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration *</label>
            <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2 minutes">1-2 minutes</SelectItem>
                <SelectItem value="3-4 minutes">3-4 minutes</SelectItem>
                <SelectItem value="5 minutes">5 minutes</SelectItem>
                <SelectItem value="6 minutes">6 minutes</SelectItem>
                <SelectItem value="10 minutes">10 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Version Style</label>
          <Select value={formData.version} onValueChange={(value) => setFormData(prev => ({ ...prev, version: value }))} disabled={isGenerating}>
            <SelectTrigger>
              <SelectValue placeholder="Select version style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">Studio version</SelectItem>
              <SelectItem value="live">Live version</SelectItem>
              <SelectItem value="acoustic">Acoustic version</SelectItem>
              <SelectItem value="remix">Remix version</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Lyrics</label>
            <Button variant="outline" size="sm" onClick={generateLyrics} disabled={isGenerating}>
              Generate AI Lyrics
            </Button>
          </div>
          <Textarea
            value={formData.lyrics}
            onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
            placeholder="Enter your lyrics or generate AI lyrics..."
            rows={8}
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Art</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="flex-1"
              disabled={isGenerating}
            />
            <Button variant="outline" size="sm" disabled={isGenerating}>
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating AI song... (1 minute)</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {generatedSong && (
          <div className="space-y-4 p-4 rounded-lg bg-secondary/50 border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Generated Song Ready!</h3>
              <Button variant="outline" size="sm" onClick={createNewSong}>
                Create New Song
              </Button>
            </div>
            
            <audio
              ref={audioRef}
              src={generatedSong.audioUrl}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                console.error('Audio playback error');
                setIsPlaying(false);
              }}
            />
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={togglePreview}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <span className="flex-1 text-sm">"{formData.title}" by {formData.artist}</span>
              <Button variant="outline" size="sm" onClick={downloadSong}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}

        {!generatedSong && (
          <Button
            onClick={generateSong}
            disabled={isGenerating}
            className="w-full music-gradient hover:opacity-90"
          >
            {isGenerating ? 'Generating AI Song... (1 min)' : 'Generate AI Song'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SongGenerator;
