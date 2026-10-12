import {
  SegmentedControl,
  Tooltip,
  useMantineColorScheme,
  type MantineColorScheme,
} from "@mantine/core";
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { useIntl } from "react-intl";

export default function ColorSchemeToggle() {
  const intl = useIntl();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const options: {
    value: MantineColorScheme;
    label: string;
    icon: typeof IconSun;
  }[] = [
    {
      value: "auto",
      label: intl.formatMessage({ defaultMessage: "System theme" }),
      icon: IconDeviceDesktop,
    },
    {
      value: "light",
      label: intl.formatMessage({ defaultMessage: "Light theme" }),
      icon: IconSun,
    },
    {
      value: "dark",
      label: intl.formatMessage({ defaultMessage: "Dark theme" }),
      icon: IconMoon,
    },
  ];
  return (
    <SegmentedControl
      size="xs"
      value={colorScheme}
      onChange={(value) => setColorScheme(value)}
      data={options.map((option) => ({
        value: option.value,
        label: (
          <Tooltip label={option.label} withArrow>
            <option.icon size={14} aria-label={option.label} />
          </Tooltip>
        ),
      }))}
    />
  );
}
