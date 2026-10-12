export default function createCommentId(): string {
  return crypto.randomUUID();
}
