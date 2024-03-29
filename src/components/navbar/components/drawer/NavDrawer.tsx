import React from "react";
import { Box, Divider, Drawer, Group, RemoveScroll } from "@mantine/core";
import JadeLogo from "../../../JadeLogo";
import DrawerNavLinks from "./DrawerNavLinks";
import ThemeToggler from "../theme-toggler/ThemeToggler";
import AuthItems from "../../../auth-items/AuthItems";
import { LinkData } from "@/src/lib/types/nav";

const DrawerHeader = () => (
  <Drawer.Header>
    <Group className="grow" justify="space-between">
      <JadeLogo h={48} />
      <Box>
        <ThemeToggler />
      </Box>
    </Group>
    <Drawer.CloseButton />
  </Drawer.Header>
);

const DrawerBody = ({
  links,
  onClose,
}: {
  links: LinkData[];
  onClose: () => void;
}) => (
  <Drawer.Body>
    <DrawerNavLinks links={links} onClick={onClose} />
    <Divider className="my-3" size="sm" />
    <Group className="grow my-2" justify="center">
      <AuthItems additionalOnClick={onClose} />
    </Group>
  </Drawer.Body>
);

type Props = {
  links: Array<LinkData>;
  opened: boolean;
  onClose: () => void;
};

const NavDrawer = ({ links, opened, onClose }: Props) => {
  return (
    <Drawer.Root
      className={RemoveScroll.classNames.zeroRight}
      opened={opened}
      onClose={onClose}
      zIndex={40}
      position="left"
      transitionProps={{
        transition: "rotate-left",
        duration: 150,
        timingFunction: "linear",
      }}
      closeOnClickOutside
      closeOnEscape
      hiddenFrom="xs"
    >
      <Drawer.Content
        className={`${RemoveScroll.classNames.fullWidth} ${RemoveScroll.classNames.zeroRight}`}
      >
        <DrawerHeader />
        <DrawerBody links={links} onClose={onClose} />
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default NavDrawer;
