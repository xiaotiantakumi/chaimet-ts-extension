// class WordInfo {
//     _site : string
//     constructor(site : string) {
//       this._site = site;  
//     }
// }
export interface IWordInfo{
    get pinyin() : string;
    get description() : string;
    toConsoleLog() : void;
}
export class WordInfo implements IWordInfo {
    private _site : string
    private _pinyinEle : HTMLCollectionOf<HTMLElement>
    private _descriptionEle: HTMLCollectionOf<HTMLElement>
    
    private _pinyin : string = "";
    public get pinyin() : string {
        return this._pinyin;
    }
    private set pinyin(v : string) {
        this._pinyin = v;
    }
    
    
    private _description : string = "";
    public get description() : string {
        return this._description;
    }
    public set description(v : string) {
        this._description = v;
    }
    
    constructor(site : string, pinyinEle : HTMLCollectionOf<HTMLElement>, descriptionEle: HTMLCollectionOf<HTMLElement>) {
        this._site = site;
        this._pinyinEle = pinyinEle;
        this._descriptionEle = descriptionEle;
        this.setPinyin();
        this.setDescription();
        console.log(this._site);
    }
    public toConsoleLog() {
        if (this.pinyin) {
            console.log(this.pinyin);
        }
        if (this._description) {
            console.log(this._description);
        }
    }
    private setPinyin() {
        let item = this._pinyinEle[0];
        if (item) {
            this.pinyin = item.innerText;
            return;
        }
        this.pinyin
    }
    private setDescription() {
        let result = '';
        if (!this._descriptionEle) return result;
        let length = this._descriptionEle.length > 10 ? 10 : this._descriptionEle.length;
        for (let i = 0; i < length; i++) {
            if (i != 0) {
                result += '<br>';
            }
            result += this._descriptionEle[i].innerText
        }
        this._description = result;
    }
}
