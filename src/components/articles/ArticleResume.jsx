import "./ArticleResume.scss"
import React, { useState } from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import { Accordion, AccordionItem } from "react-bootstrap"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleResume({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

    return (
        <Article id={id}
                 type={Article.Types.SPACING_DEFAULT}
                 dataWrapper={dataWrapper}
                 className={`article-resume`}
                 selectedItemCategoryId={selectedItemCategoryId}
                 setSelectedItemCategoryId={setSelectedItemCategoryId}>
            <ArticleResumeItems dataWrapper={dataWrapper} 
                                selectedItemCategoryId={selectedItemCategoryId}/>
        </Article>
    )
}

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {String} selectedItemCategoryId
 * @return {JSX.Element}
 * @constructor
 */
function ArticleResumeItems({ dataWrapper, selectedItemCategoryId }) {
    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)
    const defaultActiveKey = filteredItems.length ? filteredItems[0].uniqueId : null

    return (
        <Accordion className="article-resume-items" defaultActiveKey={defaultActiveKey}>
            {filteredItems.map((itemWrapper, key) => (
                <ArticleResumeItem itemWrapper={itemWrapper} key={key}/>
            ))}
        </Accordion>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticleResumeItem({ itemWrapper }) {
    return (
        <AccordionItem eventKey={itemWrapper.uniqueId} className="article-resume-item">
            <Accordion.Header>
                <div dangerouslySetInnerHTML={{__html: itemWrapper.locales.title}} />
            </Accordion.Header>
            <Accordion.Body>
                <div dangerouslySetInnerHTML={{__html: itemWrapper.locales.text}} />
            </Accordion.Body>
        </AccordionItem>
    )
}

export default ArticleResume
