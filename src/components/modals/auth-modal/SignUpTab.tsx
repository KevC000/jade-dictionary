"use client";

import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import { Button, Center, PasswordInput, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import React, { useState } from "react";
import classes from "./AuthModal.module.css";
import VerifyEmailModal from "../verify-email-modal/VerifyEmailModal";
import { createNewUserWithEmailAndPassword, sendVerificationEmail } from "@/src/lib/firebase/authentication";

type Props = {};

const SignUpTab = (props: Props) => {
  const firebase = useFirebaseContext();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
      passwordConfirmation: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });
  const [errorMessage, setErrorMessage] = useState("");

  const signUp = async () => {
    const { email, password, passwordConfirmation } = form.values;

    // Basic validation
    if (!email || !password || !passwordConfirmation) {
      setErrorMessage(
        "Email, password, and confirmation password are required"
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Email format validation (simple example)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    try {
      const { user, error } = await createNewUserWithEmailAndPassword(
        firebase.auth,
        firebase.firestore,
        email,
        password
      );
      if (error) {
        setErrorMessage(error);
        return; // Stop further execution if there is an error
      }
      modals.closeAll();
      sendVerificationEmail(firebase.auth);
      informVerifyEmail();
    } catch (error: any) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const informVerifyEmail = () => {
    modals.open({
      title: "Verify Email!",
      children: <VerifyEmailModal email={form.values.email} />,
    });
  };

  return (
    <>
      <form className="pa-2">
        <TextInput
          required
          label="Email"
          placeholder="johndoe123@gmail.com"
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          error={form.errors.email && "Invalid email"}
          radius="md"
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue("password", event.currentTarget.value)
          }
          error={form.errors.password}
          radius="md"
        />
        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm your password"
          value={form.values.passwordConfirmation}
          onChange={(event) =>
            form.setFieldValue(
              "passwordConfirmation",
              event.currentTarget.value
            )
          }
          error={form.errors.confirmPassword}
          radius="md"
        />
        <Center>
          <Text size="sm" color="red">
            {errorMessage}
          </Text>
        </Center>
        <Button
          className={`${classes.jadeButtons} my-2`}
          onClick={signUp}
          fullWidth
        >
          Sign Up
        </Button>
      </form>
    </>
  );
};

export default SignUpTab;
