import { SendMessageMode, ContentMessage } from "./chaimet";
import { plainToClass } from "class-transformer";

let isActiveMode = false;
chrome.action.onClicked.addListener(async (tab) => {
  if (Number.isNaN(tab.id)) {
    return;
  }
  if (isActiveMode) {
    chrome.action.setBadgeText({ text: "", tabId: Number(tab.id) });
  } else {
    chrome.action.setBadgeText({ text: "有効", tabId: Number(tab.id) });
  }
  isActiveMode = !isActiveMode;
  await chrome.scripting.executeScript({
    target: { tabId: Number(tab.id) },
    files: ["content.js"],
  });
});

let fromTabId = -1;
const baseUrl: string = "https://cjjc.weblio.jp/content/";
chrome.runtime.onMessage.addListener(async (request, sender, sendMessage) => {
  fromTabId = sender?.tab?.id ?? -1;
  if (fromTabId == -1) return;
  const contentMsg = plainToClass(
    ContentMessage,
    request.msg as ContentMessage
  );
  if (contentMsg.type === SendMessageMode.SelectMsg) {
    const word = encodeURI(contentMsg.searchWord);
    try {
      const res = await fetch(baseUrl + word, {
        method: "GET",
        mode: "cors",
      });
      const txt = await res.text();
      chrome.tabs.sendMessage(fromTabId, {
        type: "getWordInfo",
        dom: txt,
        isActiveMode: isActiveMode,
      });
    } catch (error) {
      console.log(error);
    }
  }
});
