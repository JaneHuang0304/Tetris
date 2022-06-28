
import { _decorator, Component, Node, Prefab, input, Input, EventKeyboard, KeyCode, Sprite, instantiate, Vec2, Vec3 } from 'cc';
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

    public gameArray: Array <Array<Node>> = [[]];

    start () {
        this.iniGameArry();
        if (this.GameUI){
            if (this.TPrfb){
                
                //let TspCtr = this.GameUI.node.getComponent(TCtr); // 
                // T不是一個component
                // 從目前的階層關係上 T是ＧＡＭＥＵＩ底下的ＮＯＤＥ
                //所以應該要從node.children去拿
                // 這下面的拿法是Ｔ已經存在, 
                // let TNode = this.GameUI.node.children[0];
                // let TChildren = TNode.children;
                // TNode.getComponent(TCtr).gameCtr = this;

                // 但Ｐrefab應該要是你從code去新增的
                // 所以應該要這樣子
                let NodeT = instantiate(this.TPrfb);
                let TCtrl = NodeT.getComponent(TCtr);
                this.GameUI.node.addChild(NodeT);
                NodeT.setPosition(new Vec3(120, 120, 0));
                NodeT.active = true;
                TCtrl.gameCtr = this;
            }
        }
    }

    addToGameArray(ItemNode: Node){
        let nowPos = ItemNode.getPosition();
        
        let childrenNodes = ItemNode.children.map((item) => item );
        
        childrenNodes.forEach((node)=> {
            let pos = node.getPosition();
            let locX = (nowPos.x + pos.x) / 40;
            let locY = (nowPos.y + pos.y) / 40;
            this.gameArray[locX][locY] = node;
            node.setParent(this.GameUI.node);
            node.setPosition(new Vec3(locX * 40, locY * 40, 0));
        });
        ItemNode.active = false;
        ItemNode.destroy();
    }

    iniGameArry(){
        for(let i = 0; i < 10; i++){
            this.gameArray.push([]);
            for(let j = 0; j < 15; j++){
                this.gameArray[i].push(null);
            }
        }
    }

    addSprite(){
        if (this.GameUI){

        }
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
