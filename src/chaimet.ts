export interface IWordInfo {
    get pinyin(): string;
    get description(): string;
    toConsoleLog(): void;
}
export class WordInfo implements IWordInfo {
    private _href: string
    private _searchUrl: string;
    public get searchUrl(): string {
        return this._searchUrl;
    }
    private _pinyinEle: HTMLCollectionOf<HTMLElement>
    private _descriptionEle: HTMLCollectionOf<HTMLElement>

    private _pinyin: string = "";
    public get pinyin(): string {
        return this._pinyin;
    }
    private set pinyin(v: string) {
        this._pinyin = v;
    }


    private _description: string = "";
    public get description(): string {
        return this._description;
    }
    public set description(v: string) {
        this._description = v;
    }
    constructor(href: string, searchUrl : string, pinyinEle: HTMLCollectionOf<HTMLElement>, descriptionEle: HTMLCollectionOf<HTMLElement>) {
        this._href = href;
        this._pinyinEle = pinyinEle;
        this._descriptionEle = descriptionEle;
        this._searchUrl = searchUrl;
        this.setPinyin();
        this.setDescription();
        console.log(this._href);
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
        if (this._pinyinEle == null) return;
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

export enum SendMessageMode {
    None = 0,
    SelectMsg = 1
}
export interface IMessage {
    type: SendMessageMode
}
export class ContentMessage implements IMessage {

    private _type: SendMessageMode = SendMessageMode.None;
    public get type(): SendMessageMode {
        return this._type;
    }
    public set type(v: SendMessageMode) {
        this._type = v;
    }

    private _searchWord: string = "";
    public get searchWord(): string {
        return this._searchWord;
    }
    public set searchWord(v: string) {
        this._searchWord = v;
    }

    private _hRef: string = "";
    public get hRef(): string {
        return this._hRef;
    }
    public set hRef(v: string) {
        this._hRef = v;
    }

    private _selectedRageData: string = "";
    public get selectedRageData(): string {
        return this._selectedRageData;
    }
    public set selectedRageData(v: string) {
        this._selectedRageData = v;
    }

    constructor(type: SendMessageMode) {
        this.type = type;
    }
}