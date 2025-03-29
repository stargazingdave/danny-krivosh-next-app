export function createRainSound(audioCtx: AudioContext) {
    const bufferSize = 2 * audioCtx.sampleRate
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
  
    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }
  
    const whiteNoise = audioCtx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true
  
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime)
  
    whiteNoise.connect(filter)
    filter.connect(audioCtx.destination)
  
    whiteNoise.start()
  }
  