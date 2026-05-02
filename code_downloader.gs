function downloadAndSaveFile() {
  const url = "your_link_for_downlaod";
  const chunkSizeBytes = 49.5 * 1024 * 1024;
  const folderId = "folder_id";

  const section = 1; 

  let total;
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, method: "get", headers: { "User-Agent": "Mozilla/5.0" } });
    const contentLength = response.getHeaders()["Content-Length"];
    if (!contentLength) {
      Logger.log("Error: Content-Length header not found.");
      return;
    }
    total = parseInt(contentLength, 10);
    if (isNaN(total)) {
      Logger.log("Error: Invalid Content-Length value.");
      return;
    }
    Logger.log("Total file size: " + total + " bytes");
  } catch (e) {
    Logger.log("Error fetching file size: " + e);
    return;
  }

  const folder = folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();

  let start = 0;
  let part = 1;

  const filesPerSection = 20;
  const startPart = (section - 1) * filesPerSection;
  const endPart = startPart + filesPerSection - 1;

  start += (section - 1) * filesPerSection * chunkSizeBytes;
  part = startPart;

  while (start < total && part <= endPart) {
    const end = Math.min(start + chunkSizeBytes - 1, total - 1);

    const res = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: {
        "Range": `bytes=${start}-${end}`,
        "User-Agent": "Mozilla/5.0"
      }
    });

    const code = res.getResponseCode();
    if (code !== 206 && code !== 200) {
      Logger.log(`Chunk ${part} failed. status=${code}`);
      return;
    }

    const blob = res.getBlob();
    const fileName = `model_part_${String(part).padStart(5, "0")}.bin`;
    folder.createFile(blob.setName(fileName));

    Logger.log(`Saved ${fileName} bytes ${start}-${end}`);
    start = end + 1;
    part++;
  }

  Logger.log("Done. section=" + section);
}
