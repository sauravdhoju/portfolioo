import "./ArticleResumeEnhanced.scss";
import React, { useState } from "react";
import Article from "/src/components/articles/base/Article.jsx";
import { useData } from "/src/providers/DataProvider.jsx";

/**
 * Premium Resume component with modern glassmorphism design
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleResumeEnhanced({ dataWrapper, id }) {
  const data = useData();
  const profile = data.getProfile();
  const resumePdfUrl = profile.resumePdfUrl;

  const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null);
  const [activeView, setActiveView] = useState("pdf");

  const fullPdfUrl = resumePdfUrl
    ? `${import.meta.env.BASE_URL}${resumePdfUrl}`
    : null;

  return (
    <Article
      id={id}
      type={Article.Types.SPACING_DEFAULT}
      dataWrapper={dataWrapper}
      className="article-resume-enhanced"
      selectedItemCategoryId={selectedItemCategoryId}
      setSelectedItemCategoryId={setSelectedItemCategoryId}
    >
      <div className="resume-premium-container">
        {/* Content Area */}
        {activeView === "pdf" && fullPdfUrl ? (
          <ResumePDFViewerPremium pdfUrl={fullPdfUrl} />
        ) : (
          <ResumeQuickViewPremium dataWrapper={dataWrapper} />
        )}
      </div>
    </Article>
  );
}

/**
 * Premium PDF Viewer with glassmorphism effects
 */
function ResumePDFViewerPremium({ pdfUrl }) {
  return (
    <div className="resume-pdf-premium">
      {/* PDF Viewer with Premium Border */}
      <div className="resume-pdf-viewer-premium">
        <div className="pdf-border-glow"></div>
        <iframe src={pdfUrl} title="Resume PDF" className="resume-pdf-iframe" />
      </div>
    </div>
  );
}

/**
 * Premium Quick View with clean list design
 */
function ResumeQuickViewPremium({ dataWrapper }) {
  const filteredItems = dataWrapper.getOrderedItemsFilteredBy(null);

  return (
    <div className="resume-quick-view-premium">
      <div className="quick-view-grid">
        {filteredItems.map((itemWrapper, key) => (
          <div key={key} className="premium-section-card">
            <div className="card-header">
              <div className="section-number">
                {String(key + 1).padStart(2, "0")}
              </div>
              <h3
                dangerouslySetInnerHTML={{ __html: itemWrapper.locales.title }}
              />
            </div>
            <div
              className="card-body"
              dangerouslySetInnerHTML={{ __html: itemWrapper.locales.text }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleResumeEnhanced;
