export interface ResumeDraft {
  source: string;
  content: string;
}

// Manual edits remain authoritative until the underlying form changes.
export function resolveResumeDraft(
  draft: ResumeDraft | null,
  source: string,
  generated: string,
) {
  return draft?.source === source ? draft.content : generated;
}
