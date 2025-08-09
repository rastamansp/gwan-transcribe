export interface TranscriptionJob {
  transcriptionId: string;
  fileUrl: string;
  language?: string;
}

export interface IQueueService {
  addTranscriptionJob(job: TranscriptionJob): Promise<void>;
  addTranslationJob(job: TranscriptionJob): Promise<void>;
}
