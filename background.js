// Define badge background colors (OFF = grey, ON = green)
const bgOFF = '#272727';
const bgON = '#096F00';

// Set up badge
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
  chrome.action.setBadgeBackgroundColor({
    color: bgOFF,
  })
});

// Define pages on which extension can run
const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'
const mdnDocs = 'https://developer.mozilla.org/en-US/docs'

chrome.action.onClicked.addListener(async (tab) => {
  // Check if URL starts with one of the specified URLs
  if (tab.url.startsWith(extensions) ||
    tab.url.startsWith(webstore) ||
    tab.url.startsWith(mdnDocs)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Define badge background color dependent on next state
    const bgColor = nextState === 'ON' ? bgON : bgOFF;


    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    // Set the action badge color
    await chrome.action.setBadgeBackgroundColor({
      tabId: tab.id,
      color: bgColor,
    })

    // Initialize stylesheet var
    let stylesheet = undefined;

    // Specify stylesheet depending on which site it is
    if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
      stylesheet = 'focus-mode-chrome.css';
    } else if (tab.url.startsWith(mdnDocs)) {
      stylesheet = 'focus-mode-mdn.css';
    };

    if (nextState === "ON") {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: [stylesheet],
        target: { tabId: tab.id },
      });
    } else if (nextState === "OFF") {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: [stylesheet],
        target: { tabId: tab.id },
      });
    }
  }
});