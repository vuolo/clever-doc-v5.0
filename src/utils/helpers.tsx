import { type CSSProperties } from "react";

export function getFormattedFileSize(size: number): string {
  if (size < 1) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(size) / Math.log(k));

  return `${parseFloat((size / Math.pow(k, i)).toFixed(2))} ${sizes[i] ?? ""}`;
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const dropzoneStyles = {
  focused: {
    borderColor: "#2196f3",
    backgroundColor: "rgba(32, 148, 243, 0.05)",
    borderStyle: "solid",
    borderWidth: 2,
  } as CSSProperties,
  accept: {
    borderColor: "#38a169",
    backgroundColor: "rgba(56, 161, 105, .05)",
    borderStyle: "solid",
    borderWidth: 2,
  } as CSSProperties,
  reject: {
    borderColor: "#ff1744",
    backgroundColor: "rgba(255, 23, 68, .05)",
    borderStyle: "solid",
    borderWidth: 2,
  } as CSSProperties,
};

export function toastMessage(header: string, message: string) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-900">{header}</p>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function getFileExtension(file_name: string) {
  return file_name.split(".").pop() ?? "error";
}

export function getFileBaseName(file_name: string) {
  return file_name.split(".").slice(0, -1).join(".") ?? "error";
}

export function getUniqueFileName(file_name: string, file_id: string) {
  const fileExtension = getFileExtension(file_name);
  const FILE_EXTENSION_REGEX = new RegExp(`.${fileExtension}$`);
  const fileNameNoExtension = file_name.replace(FILE_EXTENSION_REGEX, "");
  return `${fileNameNoExtension}-${file_id}.${fileExtension}`;
}
