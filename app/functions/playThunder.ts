export function playThunder(audioCtx: AudioContext) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
  
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(40, audioCtx.currentTime) // low rumble
  
    gain.gain.setValueAtTime(1, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2)
  
    osc.connect(gain)
    gain.connect(audioCtx.destination)
  
    osc.start()
    osc.stop(audioCtx.currentTime + 2)
  }
  