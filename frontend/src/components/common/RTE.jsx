import React from "react";
import { Editor } from "@tinymce/tinymce-react";
export default function RTE({ onInit, initialValue }) {
  return (
    <div>
      <Editor
        onInit={onInit}
        apiKey="8tg8n4wu5t1vw0aez0o2unssvkpj3i0r3dtrgg4hrqape550"
        init={{
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
        }}
        initialValue={initialValue || ""}
      />
    </div>
  );
}