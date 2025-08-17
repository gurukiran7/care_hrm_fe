export const GENDER_TYPES = [
    { id: "male", text: "Male", icon: "M" },
    { id: "female", text: "Female", icon: "F" },
    { id: "transgender", text: "Transgender", icon: "TRANS" },
    { id: "non_binary", text: "Non Binary", icon: "TRANS" },
  ] as const;
export const RESULTS_PER_PAGE_LIMIT = 14;

export const LocalStorageKeys = {
  accessToken: "care_access_token",
  refreshToken: "care_refresh_token",
  patientTokenKey: "care_patient_token",
  loginPreference: "care_login_preference",
};
export const DEFAULT_ALLOWED_EXTENSIONS = [
  "image/*",
  "video/*",
  "audio/*",
  "text/plain",
  "text/csv",
  "application/rtf",
  "application/msword",
  "application/vnd.oasis.opendocument.text",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.spreadsheet,application/pdf",
];
export const BACKEND_ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "mp4",
  "mov",
  "avi",
  "wmv",
  "mp3",
  "wav",
  "ogg",
  "txt",
  "csv",
  "rtf",
  "doc",
  "odt",
  "pdf",
  "xls",
  "xlsx",
  "ods",
];

export const FILE_EXTENSIONS = {
  IMAGE: ["jpeg", "jpg", "png", "gif", "svg", "bmp", "webp", "jfif"],
  AUDIO: ["mp3", "wav"],
  VIDEO: [
    "webm",
    "mpg",
    "mp2",
    "mpeg",
    "mpe",
    "mpv",
    "ogg",
    "mp4",
    "m4v",
    "avi",
    "wmv",
    "mov",
    "qt",
    "flv",
    "swf",
    "mkv",
  ],
  PRESENTATION: ["pptx"],
  DOCUMENT: ["pdf", "docx"],
} as const;

export const getVideoMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    flv: "video/x-flv",
    mpg: "video/mpeg",
    mp2: "video/mpeg",
    mpeg: "video/mpeg",
    mpe: "video/mpeg",
    mpv: "video/mpeg",
    ogg: "video/ogg",
    swf: "video/x-shockwave-flash",
    wmv: "video/x-ms-wmv",
    m4v: "video/mp4",
    m4a: "audio/mp4",
    m4b: "audio/mp4",
    m4p: "audio/mp4",
  };

  return mimeTypes[extension] || `video/${extension}`;
};
export const PREVIEWABLE_FILE_EXTENSIONS = [
  "html",
  "htm",
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  ...FILE_EXTENSIONS.VIDEO,
] as const;

export const HRRoles = ["administrator", "facilityadministrator", "admin"];