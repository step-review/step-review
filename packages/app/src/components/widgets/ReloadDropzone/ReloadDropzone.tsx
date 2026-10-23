import { Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconFileUpload } from "@tabler/icons-react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";

/**
 * Accepts a review file dropped anywhere on the page, e.g. after the agent
 * reviewed the PR again.
 */
export default function ReloadDropzone() {
  const { openReviewFile, problems } = useOpenReviewFile();
  useEffect(() => {
    if (problems.length > 0) {
      window.alert(problems.map((problem) => problem.message).join("\n"));
    }
  }, [problems]);
  return (
    <Dropzone.FullScreen
      multiple={false}
      onDrop={(files) => {
        const file = files[0];
        if (file) {
          void openReviewFile(file);
        }
      }}
    >
      <Group justify="center" mih="60vh" style={{ pointerEvents: "none" }}>
        <IconFileUpload size={48} stroke={1.5} />
        <Text size="xl">
          <FormattedMessage defaultMessage="Drop the review file to reload it" />
        </Text>
      </Group>
    </Dropzone.FullScreen>
  );
}
