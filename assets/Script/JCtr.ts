
import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode } from 'cc';
import { GameCtr } from './GameCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = JCtr
 * DateTime = Tue Jun 28 2022 16:17:36 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = JCtr.ts
 * FileBasenameNoExtension = JCtr
 * URL = db://assets/Script/JCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('JCtr')
export class JCtr extends Component {
    public angle = 0;
    public gameCtr: GameCtr;

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
    }

    setTrans(){
        //設置旋轉位置
        let SpPos: Array <Vec3> = [];
        switch(this.angle){
            case 0:
                SpPos.push(new Vec3(40, 80, 0));
                SpPos.push(new Vec3(40, 40, 0));
                SpPos.push(new Vec3(40, 0, 0));
                SpPos.push(new Vec3(0, 0, 0));
                this.angle = 90;
            break;

            case 90:
                SpPos.push(new Vec3(0, 40, 0));
                SpPos.push(new Vec3(0, 80, 0));
                SpPos.push(new Vec3(40, 40, 0));
                SpPos.push(new Vec3(80, 40, 0));
                this.angle = 180;
                break;

            case 180:
                SpPos.push(new Vec3(0, 0, 0));
                SpPos.push(new Vec3(0, 40, 0));
                SpPos.push(new Vec3(0, 80, 0));
                SpPos.push(new Vec3(40, 80, 0));
                this.angle = 270;
                break;

            case 270:
                SpPos.push(new Vec3(0, 80, 0));
                SpPos.push(new Vec3(40, 80, 0));
                SpPos.push(new Vec3(80, 80, 0));
                SpPos.push(new Vec3(80, 40, 0));   
                this.angle = 0;             
                break;
        }

        this.node.children.forEach((node, index) => {
            let pos = node.getPosition();
            node.setPosition(SpPos[index]);
        });

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
