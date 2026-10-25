/** The paths of the session API, relative to the app's origin. */
export default {
  session: (sessionId: string) => `/api/sessions/${sessionId}`,
  review: (sessionId: string) => `/api/sessions/${sessionId}/review`,
  reviewVersion: (sessionId: string, versionId: string) =>
    `/api/sessions/${sessionId}/versions/${versionId}`,
  socket: (sessionId: string) => `/api/sessions/${sessionId}/socket`,
};
