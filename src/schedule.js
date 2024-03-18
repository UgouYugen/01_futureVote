import * as schedule from "node-schedule";
import * as iconv from "iconv-lite";

// TweetTimer[class]:TwitterBotの投稿時間を管理するクラス
const TweetTimer = class {
  // constructorの設定
  constructor(timeRule = {}) {
    this.timeZone = "Asia/Tokyo";
    this.timeRule = timeRule;
    this.func;
  }

  // timer[method]：timeRuleに従って、関数を実行する
  timer() {
    schedule.scheduleJob(this.timeRule, () => {
      console.log("hello");
    });
  }

  //setfunc[method]:funcのsetter
  setfunc(func) {
    this.func = func;
  }
  //setemitTime[method]:timeRuleのsetter
  setemitTime(timeRule) {
    this.timeRule = timeRule;
  }
};



// export:TweetTimer[class]
export default TweetTimer;

// 単体テスト

const test = new TweetTimer({ hour: 18, minute: 1, tz: "Asia/Tokyo" });
test.timer();




