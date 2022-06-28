
import { _decorator, Component, Node, Prefab, input, Input, EventKeyboard, KeyCode, Sprite } from 'cc';
import { TCtr } from './TCtr';
import { GameUICtr } from './GameUICtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameCtr
 * DateTime = Mon Jun 27 2022 16:22:50 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = GameCtr.ts
 * FileBasenameNoExtension = GameCtr
 * URL = db://assets/Script/GameCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('GameCtr')
export class GameCtr extends Component {

    @property({ type: Sprite })
    public GameUI: Sprite | null = null;

    @property({type: Prefab})
    public SpritePrfb: Prefab | null = null;

    @property({type: Prefab})
    public TPrfb: Prefab | null = null;

    start () {
        
    }


    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
