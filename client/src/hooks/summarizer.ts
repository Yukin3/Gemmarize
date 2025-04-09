const env = import.meta.env;
const API_URL = env.VITE_API_URL || "http://localhost:8080/api"; // fallback

export interface UploadResponse {
  _id: string;              // Summary ID
  title: string;            // Summary title
  summary: string;          // Full summary text
  paperId: string;          // Original uploaded paper ID
  instructions?: string;    // Optional instructions
}

export async function summarizeContent(
  fileOrText: File | string,
  contentType: "document" | "text" | "email",
  instructions?: string
): Promise<UploadResponse> {
  let uploadRes;

  // Step 1: Upload content
  if (contentType === "document" && fileOrText instanceof File) {
    const formData = new FormData();
    formData.append("file", fileOrText);
    formData.append("contentType", contentType);
    if (instructions) formData.append("instructions", instructions);

    uploadRes = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });
  } else if (typeof fileOrText === "string") {
    uploadRes = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: fileOrText,
        contentType,
        instructions,
      }),
    });
  } else {
    throw new Error("Invalid input format for summarizeContent.");
  }

  if (!uploadRes.ok) {
    const error = await uploadRes.json();
    throw new Error(error.error || "Failed to upload content.");
  }

  const uploadData = await uploadRes.json();
  const { paperId } = uploadData;

  // Step 2: Call Gemini summarize endpoint
  const summarizeRes = await fetch(`${API_URL}/summarize/${paperId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ instructions }),
  });

  if (!summarizeRes.ok) {
    const error = await summarizeRes.json();
    throw new Error(error.error || "Failed to generate summary.");
  }

  const summaryData = await summarizeRes.json();

  return {
    _id: summaryData._id,
    title: summaryData.title,
    summary: summaryData.summary,
    paperId: summaryData.paperId,
    instructions: summaryData.instructions,
  };
}
