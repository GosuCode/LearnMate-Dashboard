import React, { useState } from "react";
import type { ChangeEvent } from "react";

type BlockType = "text" | "pdf" | "image" | "video" | "code";

interface TextBlock {
  id: string;
  type: "text";
  content: string;
}

interface FileBlock {
  id: string;
  type: Exclude<BlockType, "text" | "code">; // only pdf, image, video
  file?: File | null;
  fileUrl?: string;
}

interface CodeBlock {
  id: string;
  type: "code";
  content: string; // code content as string
}

type Block = TextBlock | FileBlock | CodeBlock;

const EditorForm: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "text", content: "This is some intro text" },
    { id: "2", type: "pdf", fileUrl: "https://example.com/abc.pdf" },
    { id: "3", type: "text", content: "Explanation of the PDF above" },
  ]);

  const addBlock = (type: BlockType) => {
    let newBlock: Block;

    if (type === "text") {
      newBlock = { id: crypto.randomUUID(), type: "text", content: "" };
    } else if (type === "code") {
      newBlock = { id: crypto.randomUUID(), type: "code", content: "" };
    } else {
      // pdf, image, video
      newBlock = { id: crypto.randomUUID(), type, file: null };
    }

    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateTextBlock = (id: string, content: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id && b.type === "text" ? { ...b, content } : b
      )
    );
  };

  const updateFileBlock = (id: string, file: File | null) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id && b.type !== "text"
          ? { ...b, file, fileUrl: undefined }
          : b
      )
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Optional: Preview URL for local file uploads
  const getFilePreview = (block: FileBlock) => {
    if (block.file) return URL.createObjectURL(block.file);
    return block.fileUrl || null;
  };

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block) => (
        <div
          key={block.id}
          className="border p-4 rounded bg-gray-50"
          style={{ position: "relative" }}
        >
          {block.type === "text" && (
            <textarea
              value={block.content}
              onChange={(e) => updateTextBlock(block.id, e.target.value)}
              placeholder="Enter text"
              className="w-full p-2 border"
            />
          )}

          {block.type !== "text" && (
            <>
              <input
                type="file"
                accept={
                  block.type === "pdf"
                    ? "application/pdf"
                    : block.type === "image"
                      ? "image/*"
                      : block.type === "video"
                        ? "video/*"
                        : undefined
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] ?? null;
                  updateFileBlock(block.id, file);
                }}
              />
              {/* Preview for PDFs/images/videos */}
              {(block.type === "pdf" ||
                block.type === "image" ||
                block.type === "video") &&
                getFilePreview(block) && (
                  <div className="mt-2">
                    {block.type === "pdf" && (
                      <a
                        href={getFilePreview(block)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View PDF
                      </a>
                    )}
                    {block.type === "image" && (
                      <img
                        src={getFilePreview(block)!}
                        alt="preview"
                        className="max-w-xs max-h-48 mt-2"
                      />
                    )}
                    {block.type === "video" && (
                      <video
                        src={getFilePreview(block)!}
                        controls
                        className="max-w-xs max-h-48 mt-2"
                      />
                    )}
                  </div>
                )}
            </>
          )}

          <button
            onClick={() => removeBlock(block.id)}
            className="text-red-500 mt-2 absolute top-2 right-2"
            aria-label="Remove block"
            type="button"
          >
            &times;
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <button
          onClick={() => addBlock("text")}
          className="bg-blue-500 text-white px-3 py-1 rounded"
          type="button"
        >
          + Text
        </button>
        <button
          onClick={() => addBlock("pdf")}
          className="bg-green-500 text-white px-3 py-1 rounded"
          type="button"
        >
          + PDF
        </button>
        <button
          onClick={() => addBlock("image")}
          className="bg-purple-600 text-white px-3 py-1 rounded"
          type="button"
        >
          + Image
        </button>
        <button
          onClick={() => addBlock("video")}
          className="bg-yellow-600 text-white px-3 py-1 rounded"
          type="button"
        >
          + Video
        </button>
      </div>

      <button
        onClick={() => console.log(blocks)}
        className="bg-black text-white mt-4 px-4 py-2 rounded"
        type="button"
      >
        Save Blocks
      </button>
    </div>
  );
};

export default EditorForm;
