"use client";

import type { ReactNode } from "react";
import { useId, useRef } from "react";

const resumeAccept =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function ResumeUploadButton({
  children = "Upload Resume",
  className,
}: {
  children?: ReactNode;
  className: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => inputRef.current?.click()}
        aria-controls={inputId}
      >
        {children}
      </button>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={resumeAccept}
        className="sr-only"
        tabIndex={-1}
      />
    </>
  );
}
