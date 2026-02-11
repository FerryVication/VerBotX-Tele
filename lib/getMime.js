import fileType from "file-type";

export async function getMimeType(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Input is not a buffer");
  }
  const type = await fileType.fromBuffer(buffer);
  if (!type) {
    throw new Error("Unable to determine MIME type");
  }
  return type.mime;
}
