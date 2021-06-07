import { WordInfo } from "./chaimet";
import { plainToClass } from 'class-transformer';

let lastSelectedStr : string;
let selection : Selection | null = null;
let doc = window.document;
let markerTextChar = "\ufeff";
let tooltipEl : HTMLDivElement;
let markerEl, markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);

let func = () =>{
  selection = window.getSelection();
  let currentStr = selection?.toString();
  if (!currentStr) {
    if(tooltipEl) tooltipEl.style.visibility = 'hidden';
    return;
  }
  if (currentStr === lastSelectedStr) {
    return;
  }
  lastSelectedStr = currentStr;
  // send current selected text 
  chrome.runtime.sendMessage({
    type: 'selectedMsg',
    msg: lastSelectedStr,
    href: window.location.href
  })
  console.log(selection?.toString());
}
setInterval(func, 500);


let mouseEv : MouseEvent;
document.addEventListener("mousemove",(ev : MouseEvent) => {
  mouseEv = ev;
})

chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
  if (request.type === 'getWordInfo') {
    let wordInfo = plainToClass(WordInfo, request.msg as WordInfo);
    wordInfo.toConsoleLog();
    if(selection == null) return
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
      tooltipEl.style.visibility = 'visible';
      let str = '';
      str += '<button id="chaimet-add-word" padding-right="3px">⊕単語</button>';
      str += wordInfo.pinyin+ '</br>';
      str +=  wordInfo.description;
      tooltipEl.innerHTML = str;
      // 現在のマウスポジションからツールチップの位置を特定させる
      let left = mouseEv.pageX;
      let top = mouseEv.pageY;
      left += 5;
      top += 5;
      tooltipEl.style.left = left + "px";
      tooltipEl.style.top = top + "px";

      markerEl.parentNode?.removeChild(markerEl);
    }
  }
})

function CreateTooltipElement() {
  tooltipEl = doc.createElement("div");
  tooltipEl.style.border = "solid darkblue 1px";
  tooltipEl.style.backgroundColor = "lightgoldenrodyellow";
  tooltipEl.style.position = "absolute";
  tooltipEl.style.zIndex = "100";
  doc.body.appendChild(tooltipEl);
}
