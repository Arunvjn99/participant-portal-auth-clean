import { useState, useRef, useCallback, useEffect } from "react";

interface UseTextToSpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * useTextToSpeech - Hook for text-to-speech using Web Audio API
 * Sends text to backend proxy and plays returned audio via AudioContext
 * 
 * Architecture:
 * - Single persistent AudioContext (created after user interaction)
 * - Fetch audio as ArrayBuffer
 * - Decode using AudioContext.decodeAudioData()
 * - Play via AudioBufferSourceNode
 * - Handle browser autoplay restrictions
 */
export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Single persistent AudioContext (created after user interaction)
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Current audio source node (for interruption)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Track if AudioContext has been initialized (after user gesture)
  const isInitializedRef = useRef(false);

  /**
   * Initialize AudioContext after user interaction
   * This unlocks the AudioContext and allows playback
   */
  const initializeAudioContext = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      // Already initialized
      return audioContextRef.current;
    }

    console.log("🎙 Initializing AudioContext after user interaction");
    
    // Create AudioContext (must be after user gesture)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    isInitializedRef.current = true;
    
    return audioContext;
  }, []);

  /**
   * Ensure AudioContext is resumed (handles browser autoplay restrictions)
   */
  const ensureAudioContextResumed = useCallback(async (audioContext: AudioContext) => {
    if (audioContext.state === "suspended") {
      console.log("🔊 Resuming suspended AudioContext");
      try {
        await audioContext.resume();
        console.log("✅ AudioContext resumed successfully");
      } catch (error) {
        console.error("❌ Failed to resume AudioContext:", error);
        throw new Error("Could not resume audio context");
      }
    }
  }, []);

  const speak = useCallback(
    async (text: string) => {
      // Stop any currently playing audio
      if (currentSourceRef.current) {
        console.log("⏹ Stopping current audio playback");
        try {
          currentSourceRef.current.stop();
          currentSourceRef.current.disconnect();
        } catch (error) {
          // Source may have already stopped
          console.warn("Warning stopping source:", error);
        }
        currentSourceRef.current = null;
      }

      try {
        setIsSpeaking(true);
        options.onStart?.();

        // STEP 1: Initialize AudioContext (if not already done)
        let audioContext = audioContextRef.current;
        if (!audioContext || audioContext.state === "closed") {
          audioContext = initializeAudioContext();
        }

        // STEP 2: Ensure AudioContext is resumed
        await ensureAudioContextResumed(audioContext);

        // STEP 3: Fetch TTS audio as ArrayBuffer
        console.log("🎙 Fetching TTS audio for text:", text.substring(0, 50) + "...");
        
        const response = await fetch("/api/voice/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: "Text-to-Speech failed" }));
          throw new Error(error.message || "Text-to-Speech failed");
        }

        // Get audio as ArrayBuffer (not blob)
        const arrayBuffer = await response.arrayBuffer();
        console.log("✅ Received audio ArrayBuffer, size:", arrayBuffer.byteLength, "bytes");

        // STEP 4: Decode audio buffer
        console.log("🔊 Decoding audio buffer");
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
        console.log("✅ Audio decoded successfully, duration:", audioBuffer.duration, "seconds");

        // STEP 5: Create AudioBufferSourceNode and play
        console.log("▶️ Creating AudioBufferSourceNode");
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        // Track current source for interruption
        currentSourceRef.current = source;

        // Handle playback end
        source.onended = () => {
          console.log("⏹ Audio playback ended");
          setIsSpeaking(false);
          options.onEnd?.();
          currentSourceRef.current = null;
        };

        // Handle playback errors
        source.onerror = (error) => {
          console.error("❌ Audio playback error:", error);
          setIsSpeaking(false);
          options.onError?.("Could not play audio");
          currentSourceRef.current = null;
        };

        // Start playback
        console.log("▶️ Starting audio playback");
        console.log("🔊 Using voice: en-US-Neural2-F");
        source.start(0);
        console.log("✅ Audio playback started successfully");

      } catch (error) {
        console.error("❌ TTS Error:", error);
        setIsSpeaking(false);
        options.onError?.(
          error instanceof Error
            ? error.message
            : "Could not generate or play speech audio"
        );
        options.onEnd?.();
        currentSourceRef.current = null;
      }
    },
    [options, initializeAudioContext, ensureAudioContextResumed]
  );

  const stop = useCallback(() => {
    console.log("⏹ Stopping TTS playback");
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
        currentSourceRef.current.disconnect();
      } catch (error) {
        // Source may have already stopped
        console.warn("Warning stopping source:", error);
      }
      currentSourceRef.current = null;
    }
    setIsSpeaking(false);
    options.onEnd?.();
  }, [options]);

  const interrupt = useCallback(() => {
    stop();
  }, [stop]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    console.log("🧹 Cleaning up TTS resources");
    stop();
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch((error) => {
        console.warn("Warning closing AudioContext:", error);
      });
      audioContextRef.current = null;
    }
    isInitializedRef.current = false;
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isSpeaking,
    speak,
    stop,
    interrupt,
    cleanup,
    // Expose initialization function for user gesture
    initializeAudioContext,
    // Expose resume function for explicit unlocking
    ensureAudioContextResumed: async () => {
      if (audioContextRef.current) {
        await ensureAudioContextResumed(audioContextRef.current);
      }
    },
  };
};
