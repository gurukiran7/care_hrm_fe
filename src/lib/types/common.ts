import type { UserBase } from "../../types/employee/employee";

export type FileCategory =
  | "unspecified"
  | "employee_document";

  export interface CreateFileRequest {
    file_type: string | number;
    file_category: FileCategory;
    name: string;
    associating_id: string;
    original_name: string;
    mime_type: string;
  }
  export interface CreateFileResponse {
    id: string;
    file_type: string;
    file_category: FileCategory;
    signed_url: string;
    internal_name: string;
  }
  
  

export interface FileUploadModel {
  id?: string;
  name?: string;
  associating_id?: string;
  created_date?: string;
  upload_completed?: boolean;
  uploaded_by?: UserBase;
  file_category?: FileCategory;
  read_signed_url?: string;
  is_archived?: boolean;
  archive_reason?: string;
  extension?: string;
  archived_by?: UserBase;
  mime_type?: string;
  archived_datetime?: string;
}
