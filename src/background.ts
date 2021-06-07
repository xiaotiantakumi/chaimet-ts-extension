// const moment = require('moment');
import axios from 'axios';
import { WordInfo } from './chaimet'

let fromTabId = -1;
const baseUrl: string = "https://cjjc.weblio.jp/content/";
chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
  fromTabId = sender?.tab?.id ?? -1;
  if (fromTabId == -1) return;

  if (request.type === 'selectedMsg') {
    let word = encodeURI(request.msg);
    axios.get(baseUrl + word)
      .then((res) => {
        let doc = new DOMParser().parseFromString(res.data, "text/html");
        let titleEle = doc.getElementsByClassName('pnyn') as HTMLCollectionOf<HTMLElement>;
        let descriptionEle = doc.getElementsByClassName('level0') as HTMLCollectionOf<HTMLElement>;
        let wordInfo = new WordInfo(request.href, titleEle, descriptionEle);
        chrome.tabs.sendMessage(fromTabId, {
          type: 'getWordInfo',
          msg: wordInfo
        });

        // すべてのタブを取得して何かしらの操作をする
        chrome.tabs.query({}, afterGetAllTabs);
      })
      .catch((error) => {
        console.log('ERROR!! occurred in Backend.')
      });
  }
})

const urlPtn = '';
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