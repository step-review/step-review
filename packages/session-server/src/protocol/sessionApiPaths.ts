/** The paths of the session API, relative to the app's origin. */
export default {
  session: (sessionId: string) => `/api/sessions/${sessionId}`,
  review: (sessionId: string) => `/api/sessions/${sessionId}/review`,
  socket: (sessionId: string) => `/api/sessions/${sessionId}/socket`,
};
