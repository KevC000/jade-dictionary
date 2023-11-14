import { Button, ButtonProps } from "@mantine/core";
import {} from "@mantine/ds";
import { IconBrandFacebook } from "@tabler/icons-react";

export function FacebookButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<"button">
) {
  return (
    <Button
      className="my-2"
      leftSection={
        <IconBrandFacebook
          style={{ width: "1rem", height: "1rem" }}
          color="#00ACEE"
        />
      }
      variant="default"
      {...props}
      fullWidth
    />
  );
}