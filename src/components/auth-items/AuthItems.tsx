"use client";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import React, { useEffect } from "react";
import UserMenu from "./UserMenu";
import AuthButtons from "./buttons/AuthButtons";

type Props = {
  additionalOnClick?: () => void;
  shrinkUser?: boolean;
};

const AuthItems = ({ additionalOnClick, shrinkUser = false }: Props) => {
  const firebase = useFirebaseContext();
  useEffect(() => {}, [firebase.currentUser]);

  return firebase.currentUser ? (
    <UserMenu shrink={shrinkUser} onClose={() => additionalOnClick?.()} />
  ) : (
    <AuthButtons additionalOnClick={additionalOnClick} />
  );
};

export default AuthItems;
