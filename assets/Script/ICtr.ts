
import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Vec3 } from 'cc';
import { GameCtr } from './GameCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ICtr
 * DateTime = Tue Jun 28 2022 16:04:06 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = ICtr.ts
 * FileBasenameNoExtension = ICtr
 * URL = db://assets/Script/ICtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('ICtr')
export class ICtr extends Component {
    public angle = 0;
    private Sparry = [];
    public gameCtr: GameCtr;

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.setTrans();
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode){
            case KeyCode.ARROW_RIGHT:
                this.setMove('r');
                break;

            case KeyCode.ARROW_LEFT:
                this.setMove('l');
                break;

            case KeyCode.ARROW_UP:
                this.setTrans();
                break;

            case KeyCode.ARROW_DOWN:

                break;
        }  
    }

    setMove(drt: string){
        //左右移動
        let movePos: Vec3;
        let nowPos = this.node.getPosition();
        if(drt == 'r'){
            movePos = new Vec3(40, 0, 0);
        }

        if(drt == 'l'){
            movePos = new Vec3(-40, 0, 0);
        }

        Vec3.add(nowPos, nowPos, movePos);
        this.node.setPosition(nowPos);
    }

    setTrans(){
        //設置旋轉位置
        let SpPos: Array <Vec3> = [];
        switch(this.angle){
            case 0:
                SpPos.push(new Vec3(40, 120, 0));
                SpPos.push(new Vec3(40, 80, 0));
                SpPos.push(new Vec3(40, 40, 0));
                SpPos.push(new Vec3(40, 0, 0));
                this.angle = 90;
            break;

            case 90:
                SpPos.push(new Vec3(0, 80, 0));
                SpPos.push(new Vec3(40, 80, 0));
                SpPos.push(new Vec3(80, 80, 0));
                SpPos.push(new Vec3(120, 80, 0));
                this.angle = 0;
                break;
        }

        this.node.children.forEach((node, index) => {
            let pos = node.getPosition();
            node.setPosition(SpPos[index]);
        });

        this.getSpArrayPos();
    }

    getSpArrayPos(){
        //取得每個方塊相對位置
        this.Sparry = [];
        let nowPos = this.node.getPosition();
        this.node.children.forEach((node) => {
            let pos = node.getPosition();
            let PosX = (nowPos.x + pos.x) / 40;
            let PosY = (nowPos.y + pos.y) / 40;
            this.Sparry.push([PosX, PosY]);
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
