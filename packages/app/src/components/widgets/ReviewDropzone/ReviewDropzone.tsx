import { Alert, Group, List, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconAlertTriangle, IconFileUpload } from "@tabler/icons-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import styles from "./ReviewDropzone.module.css";

/** Opens a review file dropped on the dropzone or anywhere else on the page. */
export default function ReviewDropzone() {
  const intl = useIntl();
  const { openReviewFile, problems, isLoading } = useOpenReviewFile();
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const openDroppedFile = useEffectEvent((file: File) => {
    void openReviewFile(file);
  });

  useEffect(() => {
    // Counts nested dragenter/dragleave pairs, since dragleave also fires
    // when the drag moves between elements of the page.
    let dragDepth = 0;
    // Ignore drags of text or links, which can't be review files.
    const isFileDrag = (event: DragEvent) =>
      event.dataTransfer?.types.includes("Files") ?? false;
    const handleDragEnter = (event: DragEvent) => {
      if (isFileDrag(event)) {
        dragDepth += 1;
        setIsDraggingFile(true);
      }
    };
    const handleDragLeave = (event: DragEvent) => {
      if (isFileDrag(event)) {
        dragDepth = Math.max(0, dragDepth - 1);
        setIsDraggingFile(dragDepth > 0);
      }
    };
    const handleDragOver = (event: DragEvent) => {
      if (isFileDrag(event)) {
        // Allows dropping, instead of the browser opening the file.
        event.preventDefault();
      }
    };
    const handleDrop = (event: DragEvent) => {
      dragDepth = 0;
      setIsDraggingFile(false);
      // The dropzone opens the files dropped on it by itself.
      if (dropzoneRef.current?.contains(event.target as Node)) {
        return;
      }
      const file = event.dataTransfer?.files[0];
      if (file) {
        event.preventDefault();
        openDroppedFile(file);
      }
    };
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const problemsText = problems
    .map((problem) =>
      problem.location
        ? `${problem.location}: ${problem.message}`
        : problem.message,
    )
    .join("\n");
  return (
    <Stack gap="sm">
      <Dropzone
        ref={dropzoneRef}
        mod={{ "page-drag": isDraggingFile }}
        classNames={{ root: styles["dropzone"], inner: styles["inner"] }}
        multiple={false}
        loading={isLoading}
        onDrop={(files) => {
          const file = files[0];
          if (file) {
            void openReviewFile(file);
          }
        }}
      >
        <Stack
          align="center"
          justify="center"
          gap={4}
          h="100%"
          style={{ pointerEvents: "none" }}
        >
          <IconFileUpload size={44} stroke={1.5} />
          <Text size="lg">
            <FormattedMessage defaultMessage="Drop here" />
          </Text>
        </Stack>
      </Dropzone>
      {problems.length > 0 && (
        <Alert
          color="red"
          icon={<IconAlertTriangle />}
          title={
            <Group gap="xs">
              <FormattedMessage defaultMessage="The file is not a valid review" />
              <CopyIconButton
                value={problemsText}
                label={intl.formatMessage({
                  defaultMessage: "Copy the problems",
                })}
              />
            </Group>
          }
        >
          <List size="sm" spacing={4}>
            {problems.map((problem, index) => (
              <List.Item key={index}>
                {problem.location && (
                  <Text span ff="monospace" size="sm">
                    {problem.location}:{" "}
                  </Text>
                )}
                {problem.message}
              </List.Item>
            ))}
          </List>
        </Alert>
      )}
    </Stack>
  );
}
