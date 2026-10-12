import exampleReviewPath from "./exampleReviewPath.ts";
import useOpenReviewFile from "./useOpenReviewFile.ts";

/** Opens the example review, as if the user had dropped its file. */
export default function useOpenExampleReview() {
  const { openReviewFile } = useOpenReviewFile();
  return async () => {
    const response = await fetch(exampleReviewPath);
    const fileName = exampleReviewPath.split("/").at(-1)!;
    await openReviewFile(new File([await response.text()], fileName));
  };
}
