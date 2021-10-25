import { SendMessageMode, ContentMessage } from "./chaimet";
import { plainToClass } from "class-transformer";
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (Number.isNaN(tab.id)) {
      return;
    }
    const tabId = Number(tab.id);
    chrome.action.setBadgeText({ text: "有効", tabId: tabId });

    // 過去に有効化したことがあるかで読み込むか切替したかったが
    // 再読み込み時にtabIdが同じで読込まれなくなるため断念
    await chrome.scripting.executeScript({
      target: { tabId: Number(tab.id) },
      files: ["content.js"],
    });
  } catch (error) {
    console.log(error);
  }
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
    const requestUrl = baseUrl + word;
    const res = await fetch(requestUrl, {
      method: "GET",
      mode: "cors",
    }).catch((e) => {
      console.log(e);
      return null;
    });
    const txt = await res?.text();
    chrome.tabs.sendMessage(fromTabId, {
      type: "getWordInfo",
      dom: txt,
      requestUrl: requestUrl,
    });
  }
});
