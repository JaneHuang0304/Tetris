
import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode } from 'cc';
import { GameCtr } from './GameCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TetrisCtrl
 * DateTime = Thu Jun 30 2022 20:35:24 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = TetrisCtrl.ts
 * FileBasenameNoExtension = TetrisCtrl
 * URL = db://assets/Script/TetrisCtrl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('TetrisCtrl')
export class TetrisCtrl extends Component {
    public angle = 0;
    public gameCtr: GameCtr;
    public nowTime = 0;
    public isEnd = false;
    public isMove = false;

    public SpPos: Array<Vec3> = [];

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.doTrans();
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode){
            case KeyCode.ARROW_RIGHT:
                this.setHorMove('r');
                break;

            case KeyCode.ARROW_LEFT:
                this.setHorMove('l');
                break;

            case KeyCode.ARROW_UP:
                this.doTrans();
                break;

            case KeyCode.ARROW_DOWN:

                break;
        }  
    }

    //設置旋轉位置
    doTrans() {
        this.setTrans();
        this.transVerify();
    }

    setHorMove(drt: string){
        //左右移動
        this.isMove = true;
        let isOut = false;
        let movePos: Vec3 = new Vec3(0, 0, 0);
        let nowPos = this.node.getPosition();
        movePos.x = drt == 'r' ? 40 : -40;

        this.node.children.forEach((node)=>{
            let pos = node.getPosition();
            let locX = (nowPos.x + pos.x + movePos.x) / 40;
            let locY = (nowPos.y + pos.y) / 40;
            //檢查是否超出邊界or重疊其他方塊
            if (locX < 0 || locX > 9){
                isOut = true;
            }else{
                if (this.gameCtr.hasNodeAt(locX, locY)){
                    isOut = true;
                }
            }
        });

        if (!isOut){
            Vec3.add(nowPos, nowPos, movePos);
            this.node.setPosition(nowPos);
        }

        this.isMove = false;
    }

    public setTrans(){
        throw "please override this func";
    }

    //調整旋轉後的位置
    transVerify() {
        let adjPos = this.gameCtr.hasHorOut(this.SpPos, this.node.getPosition());
        if (adjPos != null){
            let nowPos = this.node.getPosition();
            Vec3.add(nowPos, nowPos, adjPos);
            this.node.setPosition(nowPos);
            this.node.children.forEach((node, index) => {
                let pos = node.getPosition();
                node.setPosition(this.SpPos[index]);
            });
        }
    }

    update (deltaTime: number) {
        if(this.isEnd) return;
        if(this.isMove) return;
        //向下移動
        this.nowTime += deltaTime;
        if(this.nowTime >= 0.3){
            let isOut = false;
            let moveDown = new Vec3(0, -40, 0);
            let nowPos = this.node.getPosition();

            this.nowTime = 0;
            this.node.children.forEach((node) => {
                let pos = node.getPosition();
                let locX = (nowPos.x + pos.x) / 40;
                let locY = (nowPos.y + pos.y + moveDown.y) / 40;
                if (this.gameCtr.hasNodeAt(locX, locY)) {
                    isOut = true;
                }

                if (locY < 0) {
                    isOut = true;
                }
            });

            //超出邊界就結束，否則移動
            if(!isOut){
                Vec3.add(nowPos, nowPos, moveDown);
                this.node.setPosition(nowPos);
            } else{
                this.isEnd = true;
                this.gameCtr.addToGameArray(this.node);
            }
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
