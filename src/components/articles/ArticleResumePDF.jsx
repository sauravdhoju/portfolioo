import "./ArticleResumePDF.scss";
import React, { useState } from "react";
import Article from "/src/components/articles/base/Article.jsx";
import { useData } from "/src/providers/DataProvider.jsx";

/**
 * Component to display and download PDF resume
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleResumePDF({ dataWrapper, id }) {
  const data = useData();
  const profile = data.getProfile();
  const resumePdfUrl = profile.resumePdfUrl;

  const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null);

  if (!resumePdfUrl) {
    return (
      <Article
        id={id}
        type={Article.Types.SPACING_DEFAULT}
        dataWrapper={dataWrapper}
        className="article-resume-pdf"
        selectedItemCategoryId={selectedItemCategoryId}
        setSelectedItemCategoryId={setSelectedItemCategoryId}
      >
        <div className="resume-pdf-placeholder">
          <i className="fa-solid fa-file-pdf fa-3x mb-3 text-muted"></i>
          <p className="text-muted">Resume PDF not available</p>
        </div>
      </Article>
    );
  }

  const fullPdfUrl = `${import.meta.env.BASE_URL}${resumePdfUrl}`;

  return (
    <Article
      id={id}
      type={Article.Types.SPACING_DEFAULT}
      dataWrapper={dataWrapper}
      className="article-resume-pdf"
      selectedItemCategoryId={selectedItemCategoryId}
      setSelectedItemCategoryId={setSelectedItemCategoryId}
    >
      <div className="resume-pdf-container">
        {/* Action Buttons */}
        <div className="resume-pdf-actions">
          <a
            href={fullPdfUrl}
            download="Saurav_Dhoju_Resume.pdf"
            className="btn btn-primary btn-resume-action"
          >
            <i className="fa-solid fa-download me-2"></i>
            Download Resume
          </a>
          <a
            href={fullPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-resume-action"
          >
            <i className="fa-solid fa-external-link-alt me-2"></i>
            Open in New Tab
          </a>
        </div>

        {/* PDF Viewer */}
        <div className="resume-pdf-viewer">
          <iframe
            src={fullPdfUrl}
            title="Resume PDF"
            className="resume-pdf-iframe"
          />
          
          {/* Fallback for browsers that don't support iframe PDF viewing */}
          <div className="resume-pdf-fallback">
            <i className="fa-solid fa-file-pdf fa-4x mb-3"></i>
            <p>Your browser doesn't support PDF viewing.</p>
            <a
              href={fullPdfUrl}
              download="Saurav_Dhoju_Resume.pdf"
              className="btn btn-primary"
            >
              <i className="fa-solid fa-download me-2"></i>
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </Article>
  );
}

export default ArticleResumePDF;