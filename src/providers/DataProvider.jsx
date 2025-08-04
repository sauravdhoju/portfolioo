import React, { createContext, useContext, useEffect, useState } from "react";
import { useUtils } from "/src/hooks/utils.js";

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

const DataProviderStatus = {
  STATUS_IDLE: "data_provider_status_idle",
  STATUS_PREPARING_FOR_LOADING: "data_provider_status_preparing_for_loading",
  STATUS_LOADING: "data_provider_status_loading",
  STATUS_LOADED: "data_provider_status_loaded",
  STATUS_EVALUATED: "data_provider_status_evaluated",
};

function DataProvider({ children, settings }) {
  const utils = useUtils();

  const [status, setStatus] = useState(DataProviderStatus.STATUS_IDLE);
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    if (status === DataProviderStatus.STATUS_IDLE) {
      setStatus(DataProviderStatus.STATUS_PREPARING_FOR_LOADING);
    }
  }, [status]);

  useEffect(() => {
    if (status === DataProviderStatus.STATUS_PREPARING_FOR_LOADING) {
      setJsonData({});
      setStatus(DataProviderStatus.STATUS_LOADING);
    }
  }, [status]);

  useEffect(() => {
    if (status === DataProviderStatus.STATUS_LOADING) {
      _loadData()
        .then((response) => {
          setJsonData(response);
          setStatus(DataProviderStatus.STATUS_LOADED);
        })
        .catch((error) => {
          utils.log.throwError("DataProvider", error.message);
        });
    }
  }, [status]);

  useEffect(() => {
    if (status === DataProviderStatus.STATUS_LOADED) {
      const validation = _validateData();
      if (!validation.success) {
        utils.log.throwError("DataProvider", validation.message);
        return;
      }
      setStatus(DataProviderStatus.STATUS_EVALUATED);
    }
  }, [status]);

  const _loadData = async () => {
    const jStrings = await utils.file.loadJSON("/data/strings.json");
    const jProfile = await utils.file.loadJSON("/data/profile.json");
    const jCategories = await utils.file.loadJSON("/data/categories.json");
    const jSections = await utils.file.loadJSON("/data/sections.json");

    const categories = jCategories.categories;
    const sections = jSections.sections;
    _bindCategoriesAndSections(categories, sections);
    await _loadSectionsData(sections);

    return {
      strings: jStrings,
      profile: jProfile,
      settings: settings,
      sections: sections,
      categories: categories,
    };
  };

  const _bindCategoriesAndSections = (categories, sections) => {
    for (const category of categories) {
      category.sections = [];
    }

    for (const section of sections) {
      const sectionCategoryId = section.categoryId;
      const sectionCategory = categories.find(
        (category) => category.id === sectionCategoryId
      );
      if (!sectionCategory) {
        utils.log.throwError(
          "DataProvider",
          `Section with id "${section.id}" has invalid category id "${sectionCategoryId}". Make sure the category exists within categories.json`
        );
        return;
      }
      sectionCategory.sections.push(section);
      section.category = sectionCategory;
    }
  };

  const _loadSectionsData = async (sections) => {
    for (const section of sections) {
      const sectionJsonPath = section.jsonPath;
      if (sectionJsonPath) {
        try {
          section.data = await utils.file.loadJSON(sectionJsonPath);
        } catch {
          section.data = {};
        }
      }
    }
  };

  const _validateData = () => {
    const emptyCategories = (jsonData.categories || []).filter(
      (category) => category.sections.length === 0
    );
    if (emptyCategories.length > 0) {
      return {
        success: false,
        message: `The following ${emptyCategories.length} categories are empty: "${emptyCategories
          .map((c) => c.id)
          .join(", ")}". Make sure all categories have at least one section.`,
      };
    }
    return { success: true };
  };

  const getProfile = () => jsonData?.profile || {};
  const getSettings = () => jsonData?.settings || {};
  const getStrings = () => jsonData?.strings || {};
  const getSections = () => jsonData?.sections || [];
  const getCategories = () => jsonData?.categories || [];

  return (
    <DataContext.Provider
      value={{
        getProfile,
        getSettings,
        getStrings,
        getSections,
        getCategories,
      }}
    >
      {status === DataProviderStatus.STATUS_EVALUATED ? children : null}
    </DataContext.Provider>
  );
}

export default DataProvider;
