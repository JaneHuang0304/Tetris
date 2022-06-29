
import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode } from 'cc';
import { GameCtr } from './GameCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TCtr
 * DateTime = Mon Jun 27 2022 20:26:06 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = TCtr.ts
 * FileBasenameNoExtension = TCtr
 * URL = db://assets/Script/TCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('TCtr')
export class TCtr extends Component {

    public angle = 0;
    public gameCtr: GameCtr;
    private nowTime = 0;
    private isEnd = false;
    private isMove = false;

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.setTrans();
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
                this.setTrans();
                break;

            case KeyCode.ARROW_DOWN:

                break;
        }  
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
            if (locX < 0 || locX > 9){
                isOut = true;
            }
        });

        if (!isOut){
            Vec3.add(nowPos, nowPos, movePos);
            this.node.setPosition(nowPos);
        }

        this.isMove = false;
    }

    setTrans(){
        //設置旋轉位置
        let adjPos: Vec3;
        this.isMove = true;
        let SpPos: Array <Vec3> = [];
        switch(this.angle){
            case 0:
                SpPos.push(new Vec3(0, 40, 0));
                SpPos.push(new Vec3(40, 40, 0));
                SpPos.push(new Vec3(80, 40, 0));
                SpPos.push(new Vec3(40, 0, 0));
                this.angle = 90;
            break;

            case 90:
                SpPos.push(new Vec3(80, 40, 0));
                SpPos.push(new Vec3(80, 0, 0));
                SpPos.push(new Vec3(80, -40, 0));
                SpPos.push(new Vec3(40, 0, 0));
                this.angle = 180;
                break;

            case 180:
                SpPos.push(new Vec3(80, -40, 0));
                SpPos.push(new Vec3(40, -40, 0));
                SpPos.push(new Vec3(0, -40, 0));
                SpPos.push(new Vec3(40, 0, 0));
                this.angle = 270;
                break;

            case 270:
                SpPos.push(new Vec3(0, -40, 0));
                SpPos.push(new Vec3(0, 0, 0));
                SpPos.push(new Vec3(0, 40, 0));
                SpPos.push(new Vec3(40, 0, 0));   
                this.angle = 0;             
                break;
        }

        //判斷旋轉要調整的位置
        adjPos = this.gameCtr.hasHorOut(SpPos, this.node.getPosition());

        if (adjPos != null){
            let nowPos = this.node.getPosition();
            Vec3.add(nowPos, nowPos, adjPos);
            this.node.setPosition(nowPos);
            this.node.children.forEach((node, index) => {
                let pos = node.getPosition();
                node.setPosition(SpPos[index]);
            });
        }

        this.isMove = false;
    }

    update (deltaTime: number) {
        if(this.isEnd) return;
        if(this.isMove) return;
        //向下移動
        this.nowTime += deltaTime;
        if(this.nowTime >= 0.8){
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
