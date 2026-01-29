/* =====================
   GOOGLE SHEETS API WITH CACHING
===================== */

// Cache storage
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

/* =====================
   PARSE GOOGLE SHEET
===================== */
function parseGoogleSheet(text) {
  try {
    const jsonString = text.substring(47).slice(0, -2);
    const data = JSON.parse(jsonString);
    return data.table.rows || [];
  } catch (error) {
    console.error("Error parsing Google Sheet:", error);
    throw new Error("Failed to parse sheet data");
  }
}

/* =====================
   FETCH SHEET WITH CACHING
===================== */
function fetchSheet(sheetId) {
  // Check cache first
  const cached = cache.get(sheetId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for sheet: ${sheetId}`);
    return Promise.resolve(cached.data);
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then(text => {
      const data = parseGoogleSheet(text);
      
      // Store in cache
      cache.set(sheetId, {
        data: data,
        timestamp: Date.now()
      });
      
      return data;
    })
    .catch(error => {
      console.error(`Error fetching sheet ${sheetId}:`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log("Using expired cache due to fetch error");
        return cached.data;
      }
      
      // Show error notification
      if (typeof showNotification === 'function') {
        showNotification(
          "Connection Error",
          "Unable to load content. Please check your internet connection.",
          "error"
        );
      }
      
      throw error;
    });
}

/* =====================
   CACHED FETCH (ALIAS)
===================== */
window.cachedFetchSheet = fetchSheet;

/* =====================
   CLEAR CACHE FUNCTION
===================== */
window.clearSheetCache = function() {
  cache.clear();
  console.log("Sheet cache cleared");
  if (typeof showNotification === 'function') {
    showNotification("Cache Cleared", "Content cache has been cleared", "success");
  }
};

/* =====================
   PREFETCH SHEETS
===================== */
window.prefetchSheets = function(sheetIds) {
  console.log("Prefetching sheets...");
  const promises = sheetIds.map(id => 
    fetchSheet(id).catch(err => console.error(`Failed to prefetch ${id}:`, err))
  );
  return Promise.all(promises);
};

/* =====================
   RETRY MECHANISM
===================== */
function fetchSheetWithRetry(sheetId, retries = 3, delay = 1000) {
  return fetchSheet(sheetId).catch(error => {
    if (retries > 0) {
      console.log(`Retrying fetch for ${sheetId}. Retries left: ${retries}`);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(fetchSheetWithRetry(sheetId, retries - 1, delay * 2));
        }, delay);
      });
    }
    throw error;
  });
}

window.fetchSheetWithRetry = fetchSheetWithRetry;
