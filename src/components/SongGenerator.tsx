
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Music, Upload, Play, Download, Pause } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface SongGeneratorProps {
  onSongGenerated: (song: Song) => void;
}

const SongGenerator = ({ onSongGenerated }: SongGeneratorProps) => {
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateLyrics = () => {
    const sampleLyrics = {
      'pop': "Verse 1:\nDancing through the city lights tonight\nEverything's gonna be alright\nMusic pumping, hearts are beating fast\nThis moment's gonna last\n\nChorus:\nWe're unstoppable, unbreakable\nReaching for the stars above\nNothing's gonna stop us now\nThis is what we're dreaming of",
      'jazz': "Verse 1:\nSmoky room, piano keys so sweet\nRhythm makes my heart skip a beat\nSax is playing melodies so blue\nAll I need is me and you\n\nChorus:\nIn this jazzy state of mind\nLeave our worries far behind\nLet the music take control\nJazz will heal your weary soul",
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

    // Simulate AI generation process
    const steps = [
      "Analyzing genre and mood...",
      "Generating instrumental track...",
      "Processing vocal synthesis...",
      "Applying audio effects...",
      "Finalizing composition..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds per step
      setProgress((i + 1) * 20);
      toast({
        title: "Generating Song",
        description: steps[i]
      });
    }

    // Create mock audio URL (in real app, this would be from AI service)
    const mockAudioUrl = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCECS1/LNeSsFJHfJ8N2QQAoUXrTp66hVFApGn+DyvmYfCE=";
    setPreviewUrl(mockAudioUrl);

    const newSong: Song = {
      id: Date.now().toString(),
      title: formData.title,
      artist: formData.artist,
      genre: formData.genre,
      mood: formData.mood,
      vocalType: formData.vocalType,
      duration: formData.duration,
      version: formData.version,
      lyrics: formData.lyrics,
      coverUrl: coverFile ? URL.createObjectURL(coverFile) : undefined,
      audioUrl: mockAudioUrl,
      createdAt: new Date()
    };

    onSongGenerated(newSong);
    setIsGenerating(false);
    setProgress(100);

    toast({
      title: "Song Generated!",
      description: `"${formData.title}" has been created successfully!`
    });
  };

  const togglePreview = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
    toast({
      title: isPlaying ? "Paused" : "Playing",
      description: isPlaying ? "Preview paused" : "Playing song preview"
    });
  };

  const downloadSong = () => {
    if (!previewUrl) return;
    
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `${formData.artist}_${formData.title}.mp3`;
    link.click();
    
    toast({
      title: "Downloaded",
      description: "Song downloaded with full metadata!"
    });
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
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist Name *</label>
            <Input
              value={formData.artist}
              onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
              placeholder="Enter artist name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Genre *</label>
            <Input
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              placeholder="e.g., pop, jazz, lo-fi, classical"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mood/Theme</label>
            <Input
              value={formData.mood}
              onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
              placeholder="e.g., hopeful, nostalgic, dreamy"
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
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration *</label>
            <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
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
          <Select value={formData.version} onValueChange={(value) => setFormData(prev => ({ ...prev, version: value }))}>
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
            <Button variant="outline" size="sm" onClick={generateLyrics}>
              Generate AI Lyrics
            </Button>
          </div>
          <Textarea
            value={formData.lyrics}
            onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
            placeholder="Enter your lyrics or generate AI lyrics..."
            rows={8}
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
            />
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating song...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {previewUrl && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary">
            <Button variant="outline" size="sm" onClick={togglePreview}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <span className="flex-1 text-sm">Song Preview</span>
            <Button variant="outline" size="sm" onClick={downloadSong}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          onClick={generateSong}
          disabled={isGenerating}
          className="w-full music-gradient hover:opacity-90"
        >
          {isGenerating ? 'Generating...' : 'Generate Song'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SongGenerator;
