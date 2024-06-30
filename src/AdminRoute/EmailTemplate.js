import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button, MenuItem, Select } from "@mui/material";

// import tinymce from 'tinymce';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const EmailTemplate = () => {
  const [selectedSection, setSelectedSection] = useState(
    "Internal Stakeholders",
  );
  const [selectedStatus, setSelectedStatus] = useState("Planned");
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorContent, setEditorContent] = useState("Welcome to TinyMCE!");
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [editClicked, setEditClicked] = useState(false);
  const sections = ["Internal Stakeholders", "East & West"];
  const statuses = [
    "Planned",
    "Started",
    "Inprogress",
    "Completed",
    "Delay",
    "Disregard",
  ];

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  useEffect(() => {
    if (editClicked) {
      const apiDomain = process.env.REACT_APP_API_DOMAIN;
      const url = `${apiDomain}/client/template/api/templates?sections=${encodeURIComponent(selectedSection)}&templateName=${encodeURIComponent(selectedStatus)}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.text) {
            setEditorContent(data.text);
            setCurrentTemplateId(data._id);
            setEditorVisible(true);
          } else {
            setEditorContent("No content available for this template.");
            setEditorVisible(true);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setEditorContent("Failed to load the template.");
          setEditorVisible(true);
        })
        .finally(() => {
          setEditClicked(false); // Reset after the fetch operation
        });
    }

    // Cleanup on component unmount or dependency change
    return () => {
      if (
        window.tinymce &&
        window.tinymce.editors &&
        window.tinymce.editors.length > 0
      ) {
        window.tinymce.editors.forEach((editor) => {
          editor.destroy();
        });
      }
    };
  }, [editClicked, selectedSection, selectedStatus]); // Add any other dependencies as needed

  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const saveContent = () => {
    if (!currentTemplateId) {
      console.error("Template ID is undefined.");
      return;
    }

    fetch(
      `${apiDomain}/client/template/api/template/${currentTemplateId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName: selectedStatus,
          text: editorContent,
          section: selectedSection,
        }),
      },
    )
      .then((response) => response.json())
      .then((updatedTemplate) => {
        console.log("Template updated successfully:", updatedTemplate);
        // Additional logic to handle successful update can go here
      })
      .catch((error) => {
        console.error("Failed to update template:", error);
      });
  };
  useEffect(() => {
    return () => {
      if (
        window.tinymce &&
        window.tinymce.editors &&
        window.tinymce.editors.length > 0
      ) {
        window.tinymce.editors.forEach((editor) => {
          editor.destroy();
        });
      }
    };
  }, []);

  const exitEditor = () => {
    setEditorVisible(false);
  };

  return (
    <div className="email-template-container" style={{ marginTop: "120px" }}>
      <div className="section-selection">
        <div className="clients-section">
          <h3>Clients :</h3>
          <Select
            value={selectedSection}
            onChange={handleSectionChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            variant="outlined"
            style={{ marginBottom: "20px", width: "100%" }}
          >
            {sections.map((section) => (
              <MenuItem key={section} value={section}>
                {section}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="template-section">
          <h3>Template :</h3>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            variant="outlined"
            displayEmpty
            defaultValue="Planned"
            style={{ width: 150, height: "40px", marginBottom: "20px" }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            onClick={() => setEditClicked(true)}
            style={{
              backgroundColor: "#3f51b5",
              color: "white",
              marginRight: "8px",
            }}
          >
            Edit
          </Button>
          {/* Assuming the View button will have functionality later */}
          <Button
            variant="contained"
            color="secondary"
            style={{ backgroundColor: "#f50057", color: "white" }}
          >
            View
          </Button>
        </div>
      </div>

      {editorVisible && (
        <div className="editor-container">
          <ErrorBoundary>
            <Editor
              apiKey="lud1cjagcrpz8hdk5bthmm5awi1etdhk5wc2medji7da1nl9"
              value={editorContent}
              key={currentTemplateId}
              onEditorChange={(content, editor) => setEditorContent(content)}
              init={{
                height: 500,
                menubar: false,
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
            />
          </ErrorBoundary>
          <div className="editor-actions">
            <Button
              variant="contained"
              onClick={saveContent}
              style={{
                marginRight: "8px",
                backgroundColor: "#3f51b5",
                color: "white",
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={exitEditor}
              style={{ backgroundColor: "#f50057", color: "white" }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplate;
