import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import Button from "@mui/material/Button"; // Import Material-UI Button component

const TinyMce = ({ onEditorClose }) => {
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    console.log(data);
  };

  const saveContent = () => {
    // Implement your save logic here
  };

  const exitEditor = () => {
    // Implement your exit logic here
    if (onEditorClose) {
      onEditorClose();
    }
  };

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        width: "1000px",
        margin: "auto",
      }}
    >
      <Editor
        apiKey="tdppbg8xgnomfpycxmg723usgc1um96bnmptc9gz8nzkp1b2"
        init={{
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: (request, respondWith) =>
            respondWith.string(() =>
              Promise.reject("See docs to implement AI Assistant"),
            ),
        }}
        initialValue="Welcome to TinyMCE!"
      />
      <div style={{ marginTop: "20px", textAlign: "end" }}>
        {" "}
        {/* Add margin-top to create space */}
        <Button
          variant="contained"
          onClick={saveContent}
          style={{
            marginRight: "8px",
            backgroundColor: "#3f51b5",
            color: "white",
            marginBottom: "20px",
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={exitEditor}
          style={{
            backgroundColor: "#f50057",
            color: "white",
            marginBottom: "20px",
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TinyMce;
