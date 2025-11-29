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
        {/* Premium Header with Gradient */}
        <div className="resume-premium-header">
          <div className="resume-header-content">
            <div className="resume-header-icon">
              <i className="fa-solid fa-file-pdf"></i>
            </div>
            <div className="resume-header-text">
              <p>Download or view my complete profile</p>
            </div>
          </div>
          
          {/* View Toggle Buttons */}
          {fullPdfUrl && (
            <div className="resume-view-toggle">
              <button
                className={`toggle-btn ${activeView === "pdf" ? "active" : ""}`}
                onClick={() => setActiveView("pdf")}
              >
                <i className="fa-solid fa-file-pdf me-2"></i>
                PDF View
              </button>
              <button
                className={`toggle-btn ${activeView === "quick" ? "active" : ""}`}
                onClick={() => setActiveView("quick")}
              >
                <i className="fa-solid fa-bolt me-2"></i>
                Quick View
              </button>
            </div>
          )}
        </div>

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
      {/* Action Cards */}
      <div className="resume-action-cards">
        <a
          href={pdfUrl}
          download="Saurav_Dhoju_Resume.pdf"
          className="action-card download-card"
        >
          <div className="card-icon">
            <i className="fa-solid fa-download"></i>
          </div>
          <div className="card-content">
            <h4>Download Resume</h4>
            <p>Get PDF copy for offline viewing</p>
          </div>
          <div className="card-arrow">
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="action-card preview-card"
        >
          <div className="card-icon">
            <i className="fa-solid fa-external-link-alt"></i>
          </div>
          <div className="card-content">
            <h4>Open in New Tab</h4>
            <p>View in full browser window</p>
          </div>
          <div className="card-arrow">
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </a>
      </div>

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
              <div className="section-number">{String(key + 1).padStart(2, '0')}</div>
              <h3 dangerouslySetInnerHTML={{ __html: itemWrapper.locales.title }} />
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