import { useState, useRef, useCallback } from "react";
import { UIState } from "../types/voice";

interface UseSpeechToTextOptions {
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
  onStateChange?: (state: "idle" | "recording" | "processing") => void;
}

/**
 * useSpeechToText - Hook for speech-to-text using Google Cloud API
 * Records audio and sends to backend proxy for transcription
 */
export const useSpeechToText = (options: UseSpeechToTextOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        },
      });

      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        // Process audio
        setIsProcessing(true);
        options.onStateChange?.("processing");

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          // Send to backend STT endpoint
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const response = await fetch("/api/voice/stt", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Speech-to-Text failed");
          }

          const data = await response.json();

          if (data.transcript) {
            options.onTranscript(data.transcript);
          } else {
            options.onError("I couldn't hear that clearly. You can try again or type instead.");
          }
        } catch (error) {
          console.error("STT Error:", error);
          options.onError(
            error instanceof Error
              ? error.message
              : "I couldn't hear that clearly. You can try again or type instead."
          );
        } finally {
          setIsProcessing(false);
          options.onStateChange?.("idle");
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      options.onStateChange?.("recording");
    } catch (error) {
      console.error("Microphone access error:", error);
      options.onError("Microphone access denied. Please enable microphone permissions.");
      options.onStateChange?.("idle");
    }
  }, [options]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      options.onStateChange?.("idle");
    }
  }, [isRecording, options]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setIsProcessing(false);
    options.onStateChange?.("idle");
  }, [options]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    cancelRecording();
  }, [cancelRecording]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording,
    cleanup,
  };
};
