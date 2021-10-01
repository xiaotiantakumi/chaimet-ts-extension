// const moment = require('moment');
import axios from "axios";
import { WordInfo, SendMessageMode, ContentMessage } from "./chaimet";
import { plainToClass } from "class-transformer";
import { JSDOM } from "jsdom";

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
      const jsdom = new JSDOM();
      const jsdom2 = new JSDOM();
      console.log(jsdom2);
      const parser = new jsdom.window.DOMParser();
      const doc = parser.parseFromString(txt, "text/html");
      const titleEle = doc.getElementsByClassName(
        "pnyn"
      ) as HTMLCollectionOf<HTMLElement>;
      const descriptionEle = doc.getElementsByClassName(
        "level0"
      ) as HTMLCollectionOf<HTMLElement>;
      const wordInfo = new WordInfo(
        contentMsg.hRef,
        res.url,
        titleEle,
        descriptionEle
      );
      chrome.tabs.sendMessage(fromTabId, {
        type: "getWordInfo",
        msg: wordInfo,
      });
      // すべてのタブを取得して何かしらの操作をする
      // chrome.tabs.query({}, afterGetAllTabs);
    } catch (error) {
      console.log(error);
    }
  }
});

const urlPtn = "";
function afterGetAllTabs(tabs: chrome.tabs.Tab[]) {
  let hasTab = false;
  tabs.forEach((tab) => {
    if (urlPtn == tab.url) {
      hasTab = true;
      // ここで該当するタブをアクティブにする。タブIDが必要となる。

      chrome.tabs.update(tab.id ?? -1, { selected: true });
      // chrome.tabs.sendMessage(tab.id ?? -1, wordInfo);
    } else {
      tab.active = false;
    }
  });
  // タブが見つからなかった時の処理
  // if(hasTab == false && formTabId != -1){
  // }
}
