/**
 * Sound Effect System
 * Exchange-specific sound effects and volume control features
 */

import React from 'react'

export enum SoundType {
  // Trading Related
  TRADE_SUCCESS = 'trade_success',
  TRADE_ERROR = 'trade_error',
  ORDER_FILL = 'order_fill',
  ORDER_CANCEL = 'order_cancel',

  // Notification Related  
  PRICE_ALERT = 'price_alert',
  WHALE_ALERT = 'whale_alert',
  NEW_TRADER = 'new_trader',

  // UI Interaction
  BUTTON_CLICK = 'button_click',
  BUTTON_HOVER = 'button_hover',
  TAB_SWITCH = 'tab_switch',
  MODAL_OPEN = 'modal_open',
  MODAL_CLOSE = 'modal_close',

  // Price Movement
  PRICE_UP = 'price_up',
  PRICE_DOWN = 'price_down',
  BIG_MOVE = 'big_move',

  // System
  NOTIFICATION = 'notification',
  ERROR = 'error',
  SUCCESS = 'success'
}

interface SoundConfig {
  enabled: boolean
  volume: number
  uiSounds: boolean
  tradingSounds: boolean
  alertSounds: boolean
}

class SoundManager {
  private static instance: SoundManager
  private audioContext: AudioContext | null = null
  private sounds: Map<SoundType, AudioBuffer> = new Map()
  private config: SoundConfig = {
    enabled: true,
    volume: 0.3,
    uiSounds: true,
    tradingSounds: true,
    alertSounds: true
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudioContext()
      this.loadConfig()
      this.generateSounds()
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  private loadConfig() {
    if (typeof window === 'undefined') return

    const saved = localStorage.getItem('cryptoindex_sound_config')
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) }
      } catch (error) {
        console.warn('Failed to load sound config:', error)
      }
    }
  }

  private saveConfig() {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('cryptoindex_sound_config', JSON.stringify(this.config))
    } catch (error) {
      console.warn('Failed to save sound config:', error)
    }
  }

  private generateSounds() {
    if (!this.audioContext) return

    // Sound generation functions
    const generateTone = (frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer => {
      const sampleRate = this.audioContext!.sampleRate
      const length = sampleRate * duration
      const buffer = this.audioContext!.createBuffer(1, length, sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        let value = 0

        switch (type) {
          case 'sine':
            value = Math.sin(2 * Math.PI * frequency * t)
            break
          case 'square':
            value = Math.sign(Math.sin(2 * Math.PI * frequency * t))
            break
          case 'sawtooth':
            value = 2 * (t * frequency - Math.floor(t * frequency + 0.5))
            break
          case 'triangle':
            value = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1
            break
        }

        // Envelope (fade in/out)
        const fadeTime = 0.01
        const fadeLength = fadeTime * sampleRate
        if (i < fadeLength) {
          value *= i / fadeLength
        } else if (i > length - fadeLength) {
          value *= (length - i) / fadeLength
        }

        data[i] = value * 0.3
      }

      return buffer
    }

    const generateNoise = (duration: number, filterFreq?: number): AudioBuffer => {
      const sampleRate = this.audioContext!.sampleRate
      const length = sampleRate * duration
      const buffer = this.audioContext!.createBuffer(1, length, sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1
      }

      return buffer
    }

    const generateChord = (frequencies: number[], duration: number): AudioBuffer => {
      const sampleRate = this.audioContext!.sampleRate
      const length = sampleRate * duration
      const buffer = this.audioContext!.createBuffer(1, length, sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        let value = 0

        frequencies.forEach(freq => {
          value += Math.sin(2 * Math.PI * freq * t)
        })

        value /= frequencies.length

        // Envelope
        const fadeTime = 0.02
        const fadeLength = fadeTime * sampleRate
        if (i < fadeLength) {
          value *= i / fadeLength
        } else if (i > length - fadeLength) {
          value *= (length - i) / fadeLength
        }

        data[i] = value * 0.2
      }

      return buffer
    }

    // Trading related sounds
    this.sounds.set(SoundType.TRADE_SUCCESS, generateChord([523.25, 659.25, 783.99], 0.3)) // C5-E5-G5 major chord
    this.sounds.set(SoundType.TRADE_ERROR, generateTone(200, 0.3, 'sawtooth'))
    this.sounds.set(SoundType.ORDER_FILL, generateChord([440, 554.37], 0.2)) // A4-C#5
    this.sounds.set(SoundType.ORDER_CANCEL, generateTone(300, 0.15, 'triangle'))

    // Notification related sounds
    this.sounds.set(SoundType.PRICE_ALERT, generateTone(800, 0.25, 'sine'))
    this.sounds.set(SoundType.WHALE_ALERT, generateChord([196, 246.94, 293.66], 0.4)) // G3-B3-D4
    this.sounds.set(SoundType.NEW_TRADER, generateTone(1000, 0.2, 'triangle'))

    // UI interaction sounds
    this.sounds.set(SoundType.BUTTON_CLICK, generateTone(600, 0.1, 'sine'))
    this.sounds.set(SoundType.BUTTON_HOVER, generateTone(400, 0.05, 'sine'))
    this.sounds.set(SoundType.TAB_SWITCH, generateTone(500, 0.08, 'triangle'))
    this.sounds.set(SoundType.MODAL_OPEN, generateTone(700, 0.15, 'sine'))
    this.sounds.set(SoundType.MODAL_CLOSE, generateTone(500, 0.15, 'sine'))

    // Price movement sounds
    this.sounds.set(SoundType.PRICE_UP, generateTone(880, 0.1, 'sine')) // A5 - high pitch
    this.sounds.set(SoundType.PRICE_DOWN, generateTone(440, 0.1, 'sine')) // A4 - lower pitch
    this.sounds.set(SoundType.BIG_MOVE, generateChord([220, 440, 880], 0.25)) // A3-A4-A5 octaves

    // System sounds
    this.sounds.set(SoundType.NOTIFICATION, generateTone(660, 0.2, 'sine'))
    this.sounds.set(SoundType.ERROR, generateTone(200, 0.4, 'sawtooth'))
    this.sounds.set(SoundType.SUCCESS, generateChord([523.25, 659.25], 0.25)) // C5-E5
  }

  public async play(soundType: SoundType, customVolume?: number) {
    if (!this.config.enabled || !this.audioContext || !this.sounds.has(soundType)) {
      return
    }

    // Check category-specific settings
    const category = this.getSoundCategory(soundType)
    if (!this.isCategoryEnabled(category)) {
      return
    }

    try {
      // Resume audio context if suspended (required by browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      const buffer = this.sounds.get(soundType)!
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffer
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Set volume
      const volume = customVolume !== undefined ? customVolume : this.config.volume
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)

      source.start(0)
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  }

  private getSoundCategory(soundType: SoundType): 'ui' | 'trading' | 'alert' {
    const uiSounds = [
      SoundType.BUTTON_CLICK,
      SoundType.BUTTON_HOVER,
      SoundType.TAB_SWITCH,
      SoundType.MODAL_OPEN,
      SoundType.MODAL_CLOSE
    ]

    const tradingSounds = [
      SoundType.TRADE_SUCCESS,
      SoundType.TRADE_ERROR,
      SoundType.ORDER_FILL,
      SoundType.ORDER_CANCEL,
      SoundType.PRICE_UP,
      SoundType.PRICE_DOWN,
      SoundType.BIG_MOVE
    ]

    if (uiSounds.includes(soundType)) return 'ui'
    if (tradingSounds.includes(soundType)) return 'trading'
    return 'alert'
  }

  private isCategoryEnabled(category: 'ui' | 'trading' | 'alert'): boolean {
    switch (category) {
      case 'ui': return this.config.uiSounds
      case 'trading': return this.config.tradingSounds
      case 'alert': return this.config.alertSounds
      default: return true
    }
  }

  // Configuration methods
  public setEnabled(enabled: boolean) {
    this.config.enabled = enabled
    this.saveConfig()
  }

  public setVolume(volume: number) {
    this.config.volume = Math.max(0, Math.min(1, volume))
    this.saveConfig()
  }

  public setUISounds(enabled: boolean) {
    this.config.uiSounds = enabled
    this.saveConfig()
  }

  public setTradingSounds(enabled: boolean) {
    this.config.tradingSounds = enabled
    this.saveConfig()
  }

  public setAlertSounds(enabled: boolean) {
    this.config.alertSounds = enabled
    this.saveConfig()
  }

  public getConfig(): SoundConfig {
    return { ...this.config }
  }

  // Test sound method
  public testSound(soundType: SoundType) {
    this.play(soundType, 0.5)
  }

  // Convenience methods for common sound patterns
  public playTradeSuccess() {
    this.play(SoundType.TRADE_SUCCESS)
  }

  public playTradeError() {
    this.play(SoundType.TRADE_ERROR)
  }

  public playPriceChange(isPositive: boolean, magnitude: number = 1) {
    if (magnitude > 2) {
      this.play(SoundType.BIG_MOVE)
    } else if (isPositive) {
      this.play(SoundType.PRICE_UP)
    } else {
      this.play(SoundType.PRICE_DOWN)
    }
  }

  public playUIInteraction(type: 'click' | 'hover' | 'tab' | 'modal-open' | 'modal-close') {
    const soundMap = {
      'click': SoundType.BUTTON_CLICK,
      'hover': SoundType.BUTTON_HOVER,
      'tab': SoundType.TAB_SWITCH,
      'modal-open': SoundType.MODAL_OPEN,
      'modal-close': SoundType.MODAL_CLOSE
    }

    this.play(soundMap[type])
  }
}

// Export singleton instance
export const soundManager = SoundManager.getInstance()

// React hook for sound management
export function useSoundManager() {
  return {
    play: soundManager.play.bind(soundManager),
    playTradeSuccess: soundManager.playTradeSuccess.bind(soundManager),
    playTradeError: soundManager.playTradeError.bind(soundManager),
    playPriceChange: soundManager.playPriceChange.bind(soundManager),
    playUIInteraction: soundManager.playUIInteraction.bind(soundManager),
    testSound: soundManager.testSound.bind(soundManager),
    setEnabled: soundManager.setEnabled.bind(soundManager),
    setVolume: soundManager.setVolume.bind(soundManager),
    setUISounds: soundManager.setUISounds.bind(soundManager),
    setTradingSounds: soundManager.setTradingSounds.bind(soundManager),
    setAlertSounds: soundManager.setAlertSounds.bind(soundManager),
    getConfig: soundManager.getConfig.bind(soundManager)
  }
}

// Higher-order component for adding sound effects to buttons
export function withSoundEffects<T extends { onClick?: (e?: any) => any; onMouseEnter?: (e?: any) => any }>(
  Component: React.ComponentType<T>,
  soundType: SoundType = SoundType.BUTTON_CLICK
) {
  return function SoundEnhancedComponent(props: T) {
    const { onClick, onMouseEnter, ...otherProps } = props as T & Record<string, any>

    const handleClick = (event: any) => {
      soundManager.play(soundType)
      onClick?.(event)
    }

    const handleHover = (event: any) => {
      soundManager.play(SoundType.BUTTON_HOVER)
      onMouseEnter?.(event)
    }

    return (
      // Use createElement to avoid over-constraining generic T at call site
      (React.createElement as any)(Component as any, {
        ...(otherProps as any),
        onClick: handleClick,
        onMouseEnter: handleHover,
      })
    )
  }
}
