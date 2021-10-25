import { WordInfo, SendMessageMode, ContentMessage } from "./chaimet";

// 最後に選択した文字列(再表示させるかを判定するために使用)
let lastSelectedStr: string;
// 現在ユーザが選択している文字列
let selection: Selection | null = null;
// document
const doc: Document = window.document;
const markerTextChar: string = "\ufeff";
let tooltipEl: HTMLDivElement;
let markerEl: HTMLSpanElement;
const markerId: string =
  "sel_" + new Date().getTime() + "_" + Math.random().toString().substring(2);
let contentMessage: ContentMessage;

let sendBgMsgfunc = () => {
  try {
    selection = window.getSelection();
    let currentStr = selection?.toString();
    if (!currentStr) {
      if (tooltipEl) tooltipEl.style.visibility = "hidden";
      return;
    }
    if (currentStr === lastSelectedStr) {
      return;
    }
    lastSelectedStr = currentStr;
    // send current selected text
    contentMessage = new ContentMessage(SendMessageMode.SelectMsg);
    contentMessage.searchWord = lastSelectedStr;
    contentMessage.hRef = window.location.href;
    contentMessage.selectedRageData =
      selection?.anchorNode?.nodeValue?.trim() ?? "";
    chrome.runtime.sendMessage({
      msg: contentMessage,
    });
    console.log(selection?.toString());
  } catch (error) {
    console.log(error);
  }
};
setInterval(sendBgMsgfunc, 500);

let mouseEv: MouseEvent;
document.addEventListener("mousemove", (ev: MouseEvent) => {
  mouseEv = ev;
});

chrome.runtime.onMessage.addListener(async (request, sender, sendMessage) => {
  try {
    if (request.type === "getWordInfo") {
      let requestDocument = new DOMParser().parseFromString(
        request.dom,
        "text/html"
      );
      let titleEle = requestDocument.getElementsByClassName(
        "pnyn"
      ) as HTMLCollectionOf<HTMLElement>;
      let descriptionEle = requestDocument.getElementsByClassName(
        "level0"
      ) as HTMLCollectionOf<HTMLElement>;
      const wordInfo = new WordInfo(
        contentMessage.hRef,
        request?.requestUrl,
        titleEle,
        descriptionEle
      );
      wordInfo.toConsoleLog();
      if (selection == null) return;
      let range = selection.getRangeAt(0).cloneRange();
      range.collapse(false);
      // Create the marker element containing a single invisible character using DOM methods and insert it
      markerEl = doc.createElement("span");
      markerEl.id = markerId;
      markerEl.appendChild(doc.createTextNode(markerTextChar));
      range.insertNode(markerEl);
      if (markerEl) {
        // Lazily create element to be placed next to the selection
        if (!tooltipEl) {
          CreateTooltipElement();
        }
        if (!wordInfo.pinyin) {
          return;
        }
        tooltipEl.style.visibility = "visible";
        let str = "";
        str +=
          `<a href="${wordInfo.searchUrl}" target="_blank" rel="noopener noreferrer" >` +
          wordInfo.pinyin +
          "</a>" +
          "</br>";
        str += "</br>";
        str += wordInfo.description;
        tooltipEl.innerHTML = str;
        // 現在のマウスポジションからツールチップの位置を特定させる
        if (mouseEv) {
          let left = mouseEv.pageX;
          let top = mouseEv.pageY;
          left += 5;
          top += 5;
          tooltipEl.style.left = left + "px";
          tooltipEl.style.top = top + "px";
        }

        markerEl.parentNode?.removeChild(markerEl);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

function CreateTooltipElement() {
  tooltipEl = doc.createElement("div");
  tooltipEl.style.border = "solid black 3px";
  tooltipEl.style.backgroundColor = "lightyellow";
  tooltipEl.style.position = "absolute";
  tooltipEl.style.zIndex = "100";
  tooltipEl.style.borderRadius = "20px";
  tooltipEl.style.padding = "10px";
  doc.body.appendChild(tooltipEl);
}
