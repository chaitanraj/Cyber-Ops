// Background script for Cyber-Ops Phishing Detector
const API_BASE_URL = 'http://localhost:5000'; // Your Express server URL

// Create context menu when extension loads
chrome.runtime.onInstalled.addListener(() => {
  console.log('Cyber-Ops extension installed');
  
  // Create context menu items
  try {
    // Context menu for links
    chrome.contextMenus.create({
      id: "checkLink",
      title: "🛡️ Check with Cyber-Ops",
      contexts: ["link"]
    });

    // Context menu for current page
    chrome.contextMenus.create({
      id: "checkPage",
      title: "🛡️ Check this page with Cyber-Ops", 
      contexts: ["page"]
    });

    // Context menu for selected text (if it looks like a URL)
    chrome.contextMenus.create({
      id: "checkSelection",
      title: "🛡️ Check selected URL with Cyber-Ops",
      contexts: ["selection"]
    });
    
    console.log('Context menus created successfully');
  } catch (error) {
    console.error('Error creating context menus:', error);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked:', info.menuItemId);
  
  let urlToCheck = null;

  // Add null checks for safety
  if (!info) {
    console.error('Context menu info is undefined');
    return;
  }

  switch (info.menuItemId) {
    case "checkLink":
      urlToCheck = info.linkUrl;
      break;
    case "checkPage":
      urlToCheck = tab?.url;
      break;
    case "checkSelection":
      // Check if selected text looks like a URL
      const selection = info.selectionText?.trim();
      if (selection && isValidURL(selection)) {
        urlToCheck = selection.startsWith('http') ? selection : 'https://' + selection;
      } else {
        showNotification("Invalid URL", "Selected text doesn't appear to be a valid URL");
        return;
      }
      break;
  }

  if (urlToCheck) {
    console.log('Checking URL:', urlToCheck);
    checkURL(urlToCheck);
  } else {
    console.log('No valid URL to check');
    showNotification("Error", "No valid URL found to check");
  }
});

// Check if text looks like a URL
function isValidURL(text) {
  if (!text) return false;
  
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  return urlPattern.test(text);
}

// Check URL against your API
async function checkURL(url) {
  try {
    console.log('Starting URL check for:', url);
    
    // Show checking notification
    showNotification("Cyber-Ops Analysis", `Checking: ${getDomainFromUrl(url)}...`);

    const response = await fetch(`${API_BASE_URL}/api/check-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response:', result);
    
    // Show result notification
    showResultNotification(url, result);

  } catch (error) {
    console.error('Error checking URL:', error);
    showNotification(
      "Analysis Failed", 
      `Could not analyze URL: ${error.message}`
    );
  }
}

// Show result notification
function showResultNotification(url, result) {
  const domain = getDomainFromUrl(url);
  
  try {
    if (result.isPhishing) {
      // Dangerous site
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: '⚠️ PHISHING ALERT!',
        message: `${domain} appears to be dangerous!\nConfidence: ${Math.round((result.confidence || 0) * 100)}%`,
        priority: 2
      });
    } else {
      // Safe site
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: '✅ Site appears safe',
        message: `${domain} looks legitimate\nConfidence: ${Math.round((result.confidence || 0) * 100)}%`,
        priority: 1
      });
    }
  } catch (error) {
    console.error('Error showing notification:', error);
    showNotification("Result", `Analysis complete for ${domain}`);
  }
}

// Generic notification helper
function showNotification(title, message) {
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: title,
      message: message
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Notification error:', chrome.runtime.lastError);
      } else {
        console.log('Notification created:', notificationId);
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

// Extract domain from URL for display
function getDomainFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return url.substring(0, 50) + (url.length > 50 ? '...' : '');
  }
}

// Handle service worker errors
self.addEventListener('error', (event) => {
  console.error('Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});