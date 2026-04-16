

import { UserProfile, TenantConfig } from "../types";
import { TENANT_CONFIG } from "./config";
import { generateBaseSystemInstruction } from "./prompts";
import { generateSimpleResponse } from "./geminiService";
import { generateTTS, playAudioBase64 } from "./ttsService";

export class LiveSession {
  public onStatusChange: ((status: string) => void) | null = null;
  public onAudioLevel: ((level: number) => void) | null = null;
  public onTurnComplete: ((userText: string, modelText: string) => void) | null = null;
  
  private recognition: any = null;
  private isConnected = false;
  private isProcessing = false;
  private userProfile: UserProfile | null = null;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'tr-TR'; // Default to Turkish for this app
      
      this.recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.onAudioLevel?.(0);
        this.onStatusChange?.('processing');
        await this.handleUserTranscript(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          this.onStatusChange?.('error');
        }
      };

      this.recognition.onend = () => {
        if (this.isConnected && !this.isProcessing) {
            // Restart listening if still connected and not processing/playing audio
            try {
                this.recognition.start();
                this.onStatusChange?.('connected');
            } catch (e) {}
        }
      };
      
      this.recognition.onaudiostart = () => {
         this.onAudioLevel?.(0.8);
      };
      this.recognition.onaudioend = () => {
         this.onAudioLevel?.(0);
      };
    } else {
      console.warn("SpeechRecognition not supported in this browser.");
    }
  }

  async connect(userProfile: UserProfile) {
    this.userProfile = userProfile;
    this.isConnected = true;
    this.onStatusChange?.('connecting');
    
    if (this.recognition) {
        try {
            this.recognition.start();
            this.onStatusChange?.('connected');
            await this.sendWelcomeTrigger();
        } catch (e) {
            console.error("Failed to start recognition", e);
            this.onStatusChange?.('error');
        }
    } else {
        this.onStatusChange?.('error');
    }
  }

  private async sendWelcomeTrigger() {
      this.isProcessing = true;
      let welcomeText = "Connection Open. ";
      if (this.userProfile?.role === 'GUEST') welcomeText = 'West İstanbul Marina, hoş geldiniz.';
      else if (this.userProfile?.role === 'CAPTAIN') welcomeText = 'West İstanbul Marina, dinlemede. Kanal 72.';
      else welcomeText = `Sistemler aktif ${this.userProfile?.name?.split(' ')[0]} Bey.`;

      const audioBase64 = await generateTTS(welcomeText, 'Kore');
      if (audioBase64) {
          await playAudioBase64(audioBase64);
      }
      this.isProcessing = false;
      if (this.isConnected) {
          try { this.recognition?.start(); } catch (e) {}
      }
  }

  private async handleUserTranscript(transcript: string) {
      if (!this.userProfile) return;
      
      this.isProcessing = true;
      this.onStatusChange?.('generating');
      
      // Generate response using standard Gemini
      const responseText = await generateSimpleResponse(
          transcript,
          this.userProfile,
          [], // registry
          [], // tenders
          0, // vesselsInPort
          [], // messages
          TENANT_CONFIG
      );

      // Generate TTS
      const audioBase64 = await generateTTS(responseText, 'Kore');
      if (audioBase64) {
          await playAudioBase64(audioBase64);
      }

      if (this.onTurnComplete) {
          this.onTurnComplete(transcript, responseText);
      }
      
      this.isProcessing = false;
      if (this.isConnected) {
          this.onStatusChange?.('connected');
          try { this.recognition?.start(); } catch (e) {}
      }
  }

  async disconnect() {
    this.isConnected = false;
    if (this.recognition) {
        this.recognition.stop();
    }
    this.onStatusChange?.('disconnected');
  }
}