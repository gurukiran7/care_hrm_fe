
  import type { CreateFileRequest, CreateFileResponse, FileUploadModel } from "../../lib/types/common";
import { Type } from "../../Utils/request/api";
  import { type PaginatedResponse } from "../../Utils/request/types";
  
  export default {
    createUpload: {
      path: "/api/hrm/employee-documents/",
      method: "POST" as const,
      TBody: Type<CreateFileRequest>(),
      TRes: Type<CreateFileResponse>(),
    },
    viewUpload: {
      path: "/api/hrm/employee-documents/",
      method: "GET" as const,
      TRes: Type<PaginatedResponse<FileUploadModel>>(),
    },
    retrieveUpload: {
      path: "/api/hrm/employee-documents/{id}/",
      method: "GET" as const,
      TRes: Type<FileUploadModel>(),
    },
    editUpload: {
      path: "/api/hrm/employee-documents/{id}/",
      method: "PUT" as const,
      TBody: Type<Partial<FileUploadModel>>(),
      TRes: Type<FileUploadModel>(),
    },
    markUploadCompleted: {
      path: "/api/hrm/employee-documents/{id}/mark_upload_completed/",
      method: "POST" as const,
      TRes: Type<FileUploadModel>(),
    },
    archiveUpload: {
      path: "/api/hrm/employee-documents/{id}/archive/",
      method: "POST" as const,
      TRes: Type<FileUploadModel>(),
      TBody: Type<{ archive_reason: string }>(),
    },
  };
  