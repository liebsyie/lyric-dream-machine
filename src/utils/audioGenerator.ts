
export interface MusicParams {
  genre: string;
  mood: string;
  duration: string;
  vocalType?: string;
  title: string;
  artist: string;
}

export const generateAIMusic = (params: MusicParams): string => {
  console.log('Generating AI music with params:', params);
  
  // Create proper audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  
  // Parse duration to get seconds
  const durationMap: { [key: string]: number } = {
    '1-2 minutes': 90,
    '3-4 minutes': 210,
    '5 minutes': 300,
    '6 minutes': 360,
    '10 minutes': 600
  };
  
  const durationSeconds = durationMap[params.duration] || 90;
  const numSamples = sampleRate * durationSeconds;
  const buffer = audioContext.createBuffer(2, numSamples, sampleRate); // Stereo
  
  // Generate unique music based on parameters
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  
  // Base frequency mapping for genres
  const genreFreqMap: { [key: string]: number } = {
    'pop': 440,
    'jazz': 330,
    'rock': 523,
    'classical': 261,
    'electronic': 659,
    'hip hop': 196,
    'country': 392,
    'blues': 293,
    'r&b': 349,
    'reggae': 246
  };
  
  // Mood affects tempo and harmony
  const moodMultiplier: { [key: string]: number } = {
    'happy': 1.2,
    'sad': 0.8,
    'energetic': 1.5,
    'calm': 0.6,
    'aggressive': 1.8,
    'romantic': 0.9,
    'nostalgic': 0.7,
    'uplifting': 1.3
  };
  
  const baseFreq = genreFreqMap[params.genre.toLowerCase()] || 440;
  const tempoMod = moodMultiplier[params.mood.toLowerCase()] || 1.0;
  
  // Generate more sophisticated audio with melody, harmony, and rhythm
  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;
    
    // Create melody line
    const melodyFreq = baseFreq + Math.sin(time * 0.5 * tempoMod) * 100;
    const melody = Math.sin(2 * Math.PI * melodyFreq * time) * 0.3;
    
    // Add harmony (third and fifth)
    const harmonyFreq1 = melodyFreq * 1.25; // Major third
    const harmonyFreq2 = melodyFreq * 1.5;  // Perfect fifth
    const harmony1 = Math.sin(2 * Math.PI * harmonyFreq1 * time) * 0.2;
    const harmony2 = Math.sin(2 * Math.PI * harmonyFreq2 * time) * 0.15;
    
    // Add bass line
    const bassFreq = baseFreq * 0.5;
    const bass = Math.sin(2 * Math.PI * bassFreq * time) * 0.4;
    
    // Add rhythm/percussion simulation
    const beatFreq = 2 * tempoMod; // BPM related
    const rhythm = Math.sin(2 * Math.PI * beatFreq * time) * 0.1;
    
    // Genre-specific effects
    let genreEffect = 0;
    if (params.genre.toLowerCase().includes('jazz')) {
      genreEffect = Math.sin(2 * Math.PI * melodyFreq * 1.33 * time) * 0.1; // Jazz seventh
    } else if (params.genre.toLowerCase().includes('electronic')) {
      genreEffect = Math.sin(2 * Math.PI * melodyFreq * 2 * time) * 0.2; // Electronic harmonics
    }
    
    // Envelope (fade in/out)
    const fadeIn = Math.min(time * 2, 1);
    const fadeOut = Math.min((durationSeconds - time) * 2, 1);
    const envelope = Math.min(fadeIn, fadeOut);
    
    // Combine all elements
    const leftSample = (melody + harmony1 + bass + rhythm + genreEffect) * envelope;
    const rightSample = (melody + harmony2 + bass + rhythm + genreEffect * 0.8) * envelope;
    
    leftChannel[i] = Math.max(-1, Math.min(1, leftSample));
    rightChannel[i] = Math.max(-1, Math.min(1, rightSample));
  }
  
  // Convert to WAV blob URL
  const wavBlob = audioBufferToWav(buffer);
  return URL.createObjectURL(wavBlob);
};

const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bytesPerSample = 2;
  const blockAlign = numberOfChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const headerSize = 44;
  const fileSize = headerSize + dataSize;
  
  const arrayBuffer = new ArrayBuffer(fileSize);
  const view = new DataView(arrayBuffer);
  
  // Helper function to write string
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  // Write WAV header
  writeString(0, 'RIFF');
  view.setUint32(4, fileSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Write audio data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
};
