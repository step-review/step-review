import { Image } from "@mantine/core";
import fileIconsPath from "../../../business-logic/file-icons/fileIconsPath.ts";
import materialFileIconManifest from "../../../business-logic/file-icons/materialFileIconManifest.ts";
import resolveFileIcon from "../../../business-logic/file-icons/resolveFileIcon.ts";

interface Props {
  path: string;
  size: number;
}

/** The icon VS Code's Material Icon Theme shows for a file. */
export default function FileIcon({ path, size }: Props) {
  const { iconName, lightIconName } = resolveFileIcon(
    path,
    materialFileIconManifest,
  );
  if (iconName === lightIconName) {
    return <Image src={`${fileIconsPath}/${iconName}.svg`} w={size} h={size} />;
  }
  return (
    <>
      <Image
        src={`${fileIconsPath}/${iconName}.svg`}
        w={size}
        h={size}
        lightHidden
      />
      <Image
        src={`${fileIconsPath}/${lightIconName}.svg`}
        w={size}
        h={size}
        darkHidden
      />
    </>
  );
}
