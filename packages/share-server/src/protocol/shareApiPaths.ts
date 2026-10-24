/** The paths of the share API, relative to the app's origin. */
export default {
  share: (shareId: string) => `/api/shares/${shareId}`,
  review: (shareId: string) => `/api/shares/${shareId}/review`,
  reviewVersion: (shareId: string, versionId: string) =>
    `/api/shares/${shareId}/versions/${versionId}`,
  socket: (shareId: string) => `/api/shares/${shareId}/socket`,
};
