'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface VoiceRecorderProps {
  onRecordingComplete: (file: File) => void
  onClear: () => void
  hasRecording: boolean
}

export function VoiceRecorder({ onRecordingComplete, onClear, hasRecording }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [micError, setMicError] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const MAX_DURATION = 120 // 2 minutes

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const startRecording = async () => {
    setMicError(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], 'voice-recording.webm', { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecordingComplete(file)
        cleanup()
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording()
            return MAX_DURATION
          }
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      console.error('Microphone access denied:', err)
      setMicError(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setDuration(0)
    onClear()
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Show the recorded audio with play button
  if (hasRecording && audioUrl) {
    return (
      <div className="flex items-center gap-3 p-3 bg-pcc-50 border border-pcc-200 rounded-lg">
        <div className="w-9 h-9 rounded-full bg-pcc-600 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <audio src={audioUrl} controls className="flex-1 h-9" />
        <span className="text-xs text-muted-foreground font-mono">{formatTime(duration)}</span>
        <button
          type="button"
          onClick={discardRecording}
          className="text-red-500 hover:text-red-700 transition-colors duration-150 p-1"
          title="Discard recording"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    )
  }

  // Recording in progress
  if (isRecording) {
    return (
      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
        <span className="text-sm font-semibold text-red-700">Recording...</span>
        <span className="text-sm font-mono text-red-600 ml-auto">{formatTime(duration)} / {formatTime(MAX_DURATION)}</span>
        <button
          type="button"
          onClick={stopRecording}
          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700 transition-colors duration-150"
        >
          Stop
        </button>
      </div>
    )
  }

  // Default state — start recording button
  return (
    <div className="space-y-2">
      {micError && (
        <div className="p-2.5 border border-red-200 bg-red-50 text-red-700 text-xs font-medium rounded-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          Microphone access was denied. Please allow microphone permission in your browser settings.
          <span className="font-urdu ml-1">مائیکروفون کی اجازت دیں</span>
        </div>
      )}
      <button
        type="button"
        onClick={startRecording}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-pcc-300 text-pcc-700 bg-pcc-50 rounded-lg hover:bg-pcc-100 hover:border-pcc-400 transition-colors duration-150 text-sm font-medium w-full justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        <span>Record Voice Message (Max 2 min)</span>
        <span className="font-urdu text-xs text-pcc-500">وائس پیغام ریکارڈ کریں</span>
      </button>
    </div>
  )
}
