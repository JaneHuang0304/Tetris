
import { _decorator, Component, Node, Prefab, input, Input, EventKeyboard, KeyCode, Sprite, instantiate, Vec2, Vec3, RichTextComponent, CubicSplineNumberValue } from 'cc';
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

    @property({type: Node})
    public NextPrfb: Node | null = null;

    @property({type: Prefab})
    public SpritePrfb: Prefab | null = null;

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

    public typeList: Array<Prefab>;
    public gameArray: Array <Array<Node>> = [[]];
    private nextType: number; 

    start () {
        this.typeList = [this.TPrfb, this.OPrfb, this.IPrfb, this.JPrfb, this.LPrfb, this.ZPrfb, this.SPrfb];

        this.iniGameArry();
        this.addNextSprite();
        this.addSprite();
        
        //// test use
        //this.fullgameUI();
        //this.reomveFillRow();
    }

    fullgameUI(){

        let ignores = [
            { row: 2, col: 3}, { row: 2, col: 5},
            { row: 5, col: 1}, { row: 5, col: 5},
            { row: 6, col: 1},
            { row: 8, col: 2},
        ];
        for(let col = 0; col < 10; col++){
            for(let row = 0; row < 12; row++){
                let finditem = ignores.find((pos) => 
                    pos.col == col && pos.row == row
                );
                if(finditem == undefined){
                    let SpNode = instantiate(this.SpritePrfb);
                    this.GameUI.node.addChild(SpNode);
                    SpNode.setPosition(new Vec3(col * 40, row * 40, 0));
                    SpNode.active = true;
                    this.gameArray[col][row] = SpNode;
                }
            }
        }       
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
        //檢查是否有滿格需要清除
        this.reomveFillRow();
        //加入新圖形
        if (!this.checkGameOver()){
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
        let isGameOver = false;
        if (this.gameArray[4][13] != null){
            isGameOver = true;
        }
        return isGameOver;
    }

    //移除滿格方塊
    reomveFillRow(){

        let isFillRow = [];
        let notfillRow = [];
        for(let row = 0; row < 15; row++){
            let nullCnt = 0;
            for(let col = 0; col < 10; col++){
                if (this.gameArray[col][row] == null){
                    nullCnt += 1;
                }
            }

            if (nullCnt == 0){
                isFillRow.push(row);
            }else{
                notfillRow.push(row);
            }
        }
        //移除滿格方塊
        isFillRow.forEach((row) => {
            for(let col = 0; col < 10; col++){
                this.gameArray[col][row].active = false;
                this.gameArray[col][row].destroy();
                this.gameArray[col][row] = null;
            }
        });
        //滿格陣列是空的不執行後面的程式
        if (isFillRow.length == 0) {
            return;
        }               
        //移動留下來的方塊位置
        notfillRow.forEach((row, Notindex) => {
            this.gameArray.forEach((col, index) => {
                if (col[row] != null && Notindex != row){ 
                    col[row].setPosition(new Vec3(index * 40, Notindex * 40, 0));
                    col[Notindex] = col[row];
                    col[row] = null;
                }
            });
        });

    }

    //加入新圖形
    addSprite(){
        if (this.GameUI){
            let SpNode = instantiate(this.typeList[this.nextType]);
            let SpCtrl = SpNode.getComponent(TetrisCtrl);
            this.GameUI.node.addChild(SpNode);
            SpNode.setPosition(new Vec3(120, 520, 0));
            SpNode.active = true;
            SpCtrl.gameCtr = this;
            this.addNextSprite();
        }
    }

    //產生下一個圖形
    addNextSprite(){
        if (this.NextPrfb){
            this.nextType = Math.floor(Math.random() * this.typeList.length);

            // let node = instantiate(list[this.nextType]);
            // let ctrl = node.getComponent(TetrisCtrl);
            // ctrl.setTrans();
            
            // ctrl.SpPos.forEach((pos, index) => {
            //     this.NextPrfb.children[index].setPosition(pos);
            // });
            // ctrl.destroy();
            // node.destroy();
            // return;
            let cubePos = [];
            switch(this.nextType){
                case 0:
                    cubePos.push(new Vec3(0, 80, 0));
                    cubePos.push(new Vec3(40, 80, 0));
                    cubePos.push(new Vec3(80, 80, 0));
                    cubePos.push(new Vec3(40, 40, 0));
                break;

                case 1:
                    cubePos.push(new Vec3(20, 80, 0));
                    cubePos.push(new Vec3(60, 80, 0));
                    cubePos.push(new Vec3(20, 40, 0));
                    cubePos.push(new Vec3(60, 40, 0));
                break;

                case 2:
                    cubePos.push(new Vec3(40, 0, 0));
                    cubePos.push(new Vec3(40, 40, 0));
                    cubePos.push(new Vec3(40, 80, 0));
                    cubePos.push(new Vec3(40, 120, 0));
                break;

                case 3:
                    cubePos.push(new Vec3(60, 100, 0));
                    cubePos.push(new Vec3(60, 60, 0));
                    cubePos.push(new Vec3(60, 20, 0));
                    cubePos.push(new Vec3(20, 20, 0));
                break;

                case 4:
                    cubePos.push(new Vec3(20, 100, 0));
                    cubePos.push(new Vec3(20, 60, 0));
                    cubePos.push(new Vec3(20, 20, 0));
                    cubePos.push(new Vec3(60, 20, 0));
                break;

                case 5:
                    cubePos.push(new Vec3(0, 80, 0));
                    cubePos.push(new Vec3(40, 80, 0));
                    cubePos.push(new Vec3(40, 40, 0));
                    cubePos.push(new Vec3(80, 40, 0));
                break;

                case 6:
                    cubePos.push(new Vec3(40, 80, 0));
                    cubePos.push(new Vec3(80, 80, 0));
                    cubePos.push(new Vec3(40, 40, 0));
                    cubePos.push(new Vec3(0, 40, 0));
                break;
            }

            this.NextPrfb.children.forEach((node, index) => {
                node.setPosition(cubePos[index]);
            });

        }       
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
