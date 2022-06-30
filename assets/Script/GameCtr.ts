
import { _decorator, Component, Node, Prefab, input, Input, EventKeyboard, KeyCode, Sprite, instantiate, Vec2, Vec3 } from 'cc';
import { TCtr } from './TCtr';
import { LCtr } from './LCtr';
import { JCtr } from './JCtr';
import { OCtr } from './OCtr';
import { ICtr } from './ICtr';
import { ZCtr } from './ZCtr';
import { SCtr } from './SCtr';
import { TetrisCtrl } from './TetrisCtrl';
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
    public TPrfb: Prefab | null = null;

    @property({type: Prefab})
    public IPrfb: Prefab | null = null;

    @property({type: Prefab})
    public OPrfb: Prefab | null = null;

    @property({type: Prefab})
    public LPrfb: Prefab | null = null;

    @property({type: Prefab})
    public JPrfb: Prefab | null = null;

    @property({type: Prefab})
    public ZPrfb: Prefab | null = null;

    @property({type: Prefab})
    public SPrfb: Prefab | null = null;

    public gameArray: Array <Array<Node>> = [[]];
    public isGameOver = false;

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
            //將方塊結點移至gameUI
            node.setParent(this.GameUI.node);
            node.setPosition(new Vec3(locX * 40, locY * 40, 0));
        });

        //咦原本外誆，釋放原本外誆記憶體
        ItemNode.active = false;
        ItemNode.destroy();
        //加入新圖形
        if (!this.isGameOver){
            this.addSprite();
        }
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

    //檢查是否超出邊界
    hasHorOut(SpArry: Array <Vec3>, nowPos: Vec3){
        let Pos = new Vec3(0, 0, 0);
        let outPosX = 0;
        let outPosY = 0;
        let outCnt = 0;
        let MaxX = 0;
        let outMaxX = 0;
        let notMove = false;
        //取得XY軸超出的最大範圍
        SpArry.forEach((row) => {
            let locX = (nowPos.x + row.x) / 40;
            let locY = (nowPos.y + row.y) / 40;
            MaxX = MaxX > locX ? MaxX : locX;
            //超出邊界
            if (locX < 0){
                outPosX = outPosX > locX ? locX : outPosX;
            }

            if (locX > 9){
                outPosX = outPosX > locX - 9 ? outPosX : locX - 9;
            }

            if (locY < 0){
                outPosY = outPosY > locY ? locY : outPosY;
            }

            //沒有超出邊界檢查有沒有方塊重疊
            if (outPosX == 0 && outPosY == 0){
                if (this.hasNodeAt(locX, locY)){
                    outCnt += 1;
                    outMaxX = outMaxX > locX ? outMaxX : locX;
                }  
            }
        
        });

        //計算超出邊界需移動的位置，不能移動回傳null
        if (outPosX != 0 || outPosY != 0){
            nowPos.x = nowPos.x + (outPosX * -40);
            SpArry.forEach((row) => {
                let locX = (nowPos.x + row.x) / 40;
                let locY = (nowPos.y + row.y) / 40;
                if (this.hasNodeAt(locX, locY)){
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

        //計算方塊重疊需要移動的位置
        if (outPosX == 0 && outPosY == 0 && outCnt != 0){
            let now_Pos = nowPos;
            //判斷是超出左邊還是右邊
            outPosX =  MaxX == outMaxX ? outCnt * -40 : outCnt * 40;
            now_Pos.x = nowPos.x + outPosX;
            SpArry.forEach((row) => {
                let locX = (now_Pos.x + row.x) / 40;
                let locY = (now_Pos.y + row.y) / 40;
                if (locX < 0 || locX > 9){
                    notMove = true;
                }else{
                    if (this.hasNodeAt(locX, locY)){
                        notMove = true;
                    }
                }
            });

            if (!notMove){
                Pos.x = outPosX;
            } else {
                Pos = null;
            }
        }

        return Pos;
    }

    //檢查遊戲是否結束
    checkGameOver(){
        if (this.gameArray[4][13] != null){
            this.isGameOver = true;
        }
    }

    //移除滿格方塊
    reomveItem(){

    }

    //加入新圖形
    addSprite(){
        if (this.GameUI){
            let list = [this.TPrfb, this.OPrfb, this.IPrfb, this.JPrfb, this.LPrfb, this.ZPrfb, this.SPrfb];
            let random = Math.floor(Math.random() * list.length);
            let SpNode = instantiate(list[random]);
            let SpCtrl = SpNode.getComponent(TetrisCtrl);
            this.GameUI.node.addChild(SpNode);
            SpNode.setPosition(new Vec3(120, 520, 0));
            SpNode.active = true;
            SpCtrl.gameCtr = this;
        }
    }

    //產生下一個圖形
    addNextSprite(){
        
    }

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
