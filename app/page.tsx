"use-client";
import { Toaster } from "react-hot-toast";
import MediaPreview from "@/components/MediaPreview";
import { Fragment } from "react";

export default function Home() {
  return (
    <Fragment>
      <MediaPreview />
      <Toaster />
    </Fragment>
  );
}
