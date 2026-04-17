export enum SystemMode {
  SINGULARITY = 'SINGULARITY',
  METAMORPHOSIS = 'METAMORPHOSIS',
  ZENITH = 'ZENITH'
}

export interface EngineState {
  status: 'IDLE' | 'ACTIVATING' | 'PROCESSING' | 'COMPLETE' | 'ERROR';
  logs: string[];
  progress: number;
}

export interface GenerationResult {
  content: string;
  metadata: {
    mode: SystemMode;
    timestamp: string;
    metrics: {
      consciousness: string;
      recursion: string;
      emergence: string;
    }
  };
}

export interface ProcessingStep {
  id: string;
  name: string;
  duration: number;
  logs: string[];
}
