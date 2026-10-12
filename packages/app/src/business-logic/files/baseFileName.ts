/** File name without its last extension. */
export default function baseFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/u, "");
}
