
import { _decorator, Component, Node, Prefab, input, Input, EventKeyboard, KeyCode, Sprite, instantiate, Vec2, Vec3 } from 'cc';
import { TCtr } from './TCtr';
import { LCtr } from './LCtr';
import { JCtr } from './JCtr';
import { OCtr } from './OCtr';
import { ICtr } from './ICtr';
import { ZCtr } from './ZCtr';
import { SCtr } from './SCtr';
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
    private SpType = [TCtr, OCtr, ICtr, ZCtr, SCtr, LCtr, JCtr];


    start () {
        this.iniGameArry();
        this.addSprite();
    }

    //將到底部的方塊加入陣列
    addToGameArray(ItemNode: Node){
        let nowPos = ItemNode.getPosition();
        
        let childrenNodes = ItemNode.children.map((item) => item);
        
        childrenNodes.forEach((node)=> {
            let pos = node.getPosition();
            let locX = (nowPos.x + pos.x) / 40;
            let locY = (nowPos.y + pos.y) / 40;
            this.gameArray[locX][locY] = node;
            console.log(`add node to [${locX}][${locY}]`);
            //將方塊結點移至gameUI
            node.setParent(this.GameUI.node);
            node.setPosition(new Vec3(locX * 40, locY * 40, 0));
        });

        //咦原本外誆，釋放原本外誆記憶體
        ItemNode.active = false;
        ItemNode.destroy();
        //加入新圖形
        this.addSprite();
    }

    //初始gameUI陣列
    iniGameArry(){
        for(let i = 0; i < 10; i++){
            this.gameArray.push([]);
            for(let j = 0; j < 15; j++){
                this.gameArray[i].push(null);
            }
        }
    }

    //檢查node是否有東西
    hasNodeAt(locX, locY: number){
        return this.gameArray[locX][locY] != null;
    }

    //檢查左右是否超出邊界
    hasHorOut(SpArry: Array <Vec3>, nowPos: Vec3){
        let Pos = new Vec3(0, 0, 0);
        let outPosX = 0;
        let outPosY = 0;
        let notMove = false;
        SpArry.forEach((row) => {
            let locX = (nowPos.x + row.x) / 40;
            let locY = (nowPos.y + row.y) / 40;
            if (locX < 0){
                outPosX = outPosX < locX ? outPosX : locX;
            }

            if (locX > 9){
                outPosX = outPosX > locX - 9 ? outPosX : locX - 9;
            }

            if (locY < 0){
                outPosY = outPosY < locY ? outPosY : locY;
            }
        });

        if (outPosX != 0 || outPosY != 0){
            nowPos.x = nowPos.x + (outPosX * -40);
            SpArry.forEach((row) => {
                let locX = (nowPos.x + row.x) / 40;
                let locY = (nowPos.y + row.y) / 40;
                if (this.gameArray[locX][locY] != null){
                    notMove = true;
                }
            });

            if (!notMove){
                Pos.x = outPosX * -40;
                Pos.y = outPosY * -40;
            } else{
                Pos = null;
            }
        }

        return Pos;
    }

    //加入新圖形
    addSprite(){
        // let rand = Math.floor(Math.random() * 7);
        if (this.GameUI){
            let NodeT = instantiate(this.TPrfb);
            let TCtrl = NodeT.getComponent(TCtr);
            this.GameUI.node.addChild(NodeT);
            NodeT.setPosition(new Vec3(120, 520, 0));
            NodeT.active = true;
            TCtrl.gameCtr = this;
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
