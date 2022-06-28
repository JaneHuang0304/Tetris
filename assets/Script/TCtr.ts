
import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode } from 'cc';
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
    private Sparry = [];

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.setTrans();
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode){
            case KeyCode.ARROW_RIGHT:
                
                break;

            case KeyCode.ARROW_LEFT:
                
                break;

            case KeyCode.ARROW_UP:
                this.setTrans();
                break;

            case KeyCode.ARROW_DOWN:

                break;
        }  
    }

    setTrans(){
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

        this.node.children.forEach((node, index) => {
            let pos = node.getPosition();
            node.setPosition(SpPos[index]);
        });

        this.getSpArrayPos();
    }

    getSpArrayPos(){
        this.Sparry = [];
        let nowPos = this.node.getPosition();
        console.log(`nowPos:: ${nowPos}`);
        this.node.children.forEach((node, index) => {
            let pos = node.getPosition();
            console.log(`pos::${pos}`);
            let PosX = (nowPos.x + pos.x) / 40;
            let PosY = (nowPos.y + pos.y) / 40;
            this.Sparry.push([PosX, PosY]);
            console.log(`-> [${PosX}, ${PosY}]`);
        });
        console.log(`==============`);
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
