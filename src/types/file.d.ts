import type {
  file_details,
} from "@prisma/client";

export type file_details = file_details & {
  isUploading: boolean;
  hasError: boolean;
  resourceUrl?: string;
  results?: unknown;
  beganProcessingAt?: Date;
};