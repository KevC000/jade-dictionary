import {
  Menu,
  Group,
  Center,
  Burger,
  Container,
  AccordionChevron,
} from "@mantine/core";
import classes from "./Navbar.module.css";
import React from "react";
import Link from "next/link";

type Props = {
  link: Link;
};

const MenuItem = ({ link }: Props) => {
  if (link.links !== undefined) {
    const menuLinks = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    return (
      <Menu
        key={link.label}
        trigger="hover"
        transitionProps={{ exitDuration: 0 }}
        withinPortal
      >
        <Menu.Target>
          <a
            href={link.link}
            className={classes.link}
            onClick={(event) => event.preventDefault()}
          >
            <Center>
              <span className={classes.linkLabel}>{link.label}</span>
              <AccordionChevron size="0.9rem" />
            </Center>
          </a>
        </Menu.Target>
        <Menu.Dropdown>{menuLinks}</Menu.Dropdown>
      </Menu>
    );
  }
  return (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Link>
  );
};

export default MenuItem;
