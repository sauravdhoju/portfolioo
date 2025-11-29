import "./ArticleThread.scss";
import React, { useEffect, useState } from "react";
import Article from "/src/components/articles/base/Article.jsx";
import Collapsable from "/src/components/capabilities/Collapsable.jsx";
import {
  ArticleItemInfoForTimelines,
  ArticleItemInfoForTimelinesBody,
  ArticleItemInfoForTimelinesHeader,
  ArticleItemInfoForTimelinesPreviewFooter,
} from "/src/components/articles/partials/ArticleItemInfoForTimelines";

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleThread({ dataWrapper, id }) {
  const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null);

  return (
    <Article
      id={dataWrapper.uniqueId}
      type={Article.Types.SPACING_DEFAULT}
      dataWrapper={dataWrapper}
      className={`article-thread`}
      selectedItemCategoryId={selectedItemCategoryId}
      setSelectedItemCategoryId={setSelectedItemCategoryId}
    >
      <ArticleThreadItems
        dataWrapper={dataWrapper}
        selectedItemCategoryId={selectedItemCategoryId}
      />
    </Article>
  );
}

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {String} selectedItemCategoryId
 * @return {JSX.Element}
 * @constructor
 */
function ArticleThreadItems({ dataWrapper, selectedItemCategoryId }) {
  const filteredItems = dataWrapper.getOrderedItemsFilteredBy(
    selectedItemCategoryId
  );
  const maxRowsCollapseThreshold =
    dataWrapper.settings.maxRowsCollapseThreshold;

  return (
    <Collapsable
      className={`article-thread-items`}
      id={dataWrapper.uniqueId}
      breakpointId={"any"}
      initialVisibleItems={maxRowsCollapseThreshold}
      itemsPerStep={3}
      trailingItemComponent={ArticleThreadTrailingItem}
    >
      {filteredItems.map((itemWrapper, key) => (
        <ArticleThreadItem itemWrapper={itemWrapper} key={key} />
      ))}
    </Collapsable>
  );
}

/**
 * Format a date to a readable string (e.g., "July 28, 2025")
 * @param {Date} date
 * @returns {string}
 */
function formatDateLong(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate duration between two dates
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {{days: number, months: number}}
 */
function calculateDuration(startDate, endDate) {
  const diffTime = endDate - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate months difference
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  const totalMonths = yearsDiff * 12 + monthsDiff;
  
  return {
    days: diffDays,
    months: totalMonths,
  };
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticleThreadItem({ itemWrapper }) {
  let durationText = "";

  // Calculate duration if start date is available
  if (itemWrapper?.dateStart instanceof Date) {
    const startDateFormatted = formatDateLong(itemWrapper.dateStart);
    let endDateFormatted = "";
    let endDate = itemWrapper.dateEnd;
    
    // If no end date, use present date
    if (!endDate || !(endDate instanceof Date)) {
      endDate = new Date();
      endDateFormatted = "Present";
    } else {
      endDateFormatted = formatDateLong(endDate);
    }
    
    const duration = calculateDuration(itemWrapper.dateStart, endDate);
    
    durationText = `Duration: ${startDateFormatted} - ${endDateFormatted} (${duration.months} month${duration.months !== 1 ? 's' : ''}) (${duration.days} day${duration.days !== 1 ? 's' : ''})`;
  }

  return (
    <div className={`article-thread-item`}>
      <div className={`article-thread-item-circle`}>
        <i className={`fa-solid fa-circle`} />
      </div>

      <ArticleItemInfoForTimelines
        className={`article-thread-item-content`}
        smallDateBadge={true}
      >
        <ArticleItemInfoForTimelinesHeader
          itemWrapper={itemWrapper}
          dateInterval={false}
        />
        <ArticleItemInfoForTimelinesBody itemWrapper={itemWrapper} />
        {durationText && (
          <div className="article-thread-item-duration">
            {durationText}
          </div>
        )}
        <ArticleItemInfoForTimelinesPreviewFooter itemWrapper={itemWrapper} />
      </ArticleItemInfoForTimelines>
    </div>
  );
}

/**
 * @param {Boolean} hasMore
 * @return {JSX.Element}
 * @constructor
 */
function ArticleThreadTrailingItem({ hasMore }) {
  return (
    <div className={`article-thread-item article-thread-item-trailing`}>
      <div className={`article-thread-item-circle`}>
        <i className={hasMore ? `fa-solid fa-ellipsis opacity-50` : ``} />
      </div>
    </div>
  );
}

export default ArticleThread;
