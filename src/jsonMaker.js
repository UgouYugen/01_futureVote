import * as fs from "node:fs";
import * as readline from "node:readline";
import { fileURLToPath } from "node:url";

const jsonMaker = async (filename) => {
  // regs:ファイルの一行の中の抽出したい値を探す時に用いる正規表現。カンマ区切り3つ目のデータを判定する。
  const regs = [/^.*区$/, /^開票所名$/, /^投票率$/, /^得票率$/];
  // dirname:csvファイルのパス
  const filepath = process.cwd() + "/src/data/nhk_original/" + filename;
  // prefName:ファイル名から県名を抽出するための正規表現
  let prefName = filename.match(/nhksenkyo_shusen(.*)_20211031.csv/)[1];
  // areaObj:選挙区毎にデータをまとめる空のオブジェクトを用意。
  let areaObj = {};
  areaObj[prefName] = {};
  // areaName:選挙区名。県別jsonファイルのツリーのトップになる。グローバル変数。
  let areaName;
  // name:候補者名
  let name = "";
  // jsonString:県別のjsonファイル
  let jsonString;
  // rs:ReadStreamを作成
  const rs = fs.createReadStream(filepath);
  // readline.Interfaceクラスを作成
  const rl = readline.createInterface({
    input: rs,
  });
  // <line_1>:regsを基に特定のデータを取得
  rl.on("line", (line) => {
    // line_sep:csvファイルの一行をカンマ区切りにする
    const line_sep = line.split(",");
    // console.log(line_sep);
    // 改行だけであれば終わり
    if (line_sep === undefined) {
      return;
    }
    // reg:csvファイルの3つ目のデータを用いて、正規表現に対応しているものを取得
    const reg = regs.find((reg) => reg.test(line_sep[2]));
    // 必要な値を取得
    if (reg === regs[0]) {
      // areaName:選挙区名[str]
      areaName = line_sep[2];
      // areaObjに特定の空のオブジェクトを作成
      areaObj[prefName][areaName] = {};
      areaObj[prefName][areaName]["persons"] = {};
      return;
    } else if (reg === regs[1]) {
      // areaNames:各地区名[配列]
      const areaNames = line_sep.slice(7).filter((i) => i !== "");
      areaObj[prefName][areaName]["areaNames"] = areaNames;
      return;
    } else if (reg === regs[2]) {
      // rateAll:投票率[str]
      const rateAll = line_sep[6].padStart(5) + "%";
      areaObj[prefName][areaName]["rateAll"] = rateAll;
      return;
    } else if (
      line_sep[3] !== "(％)" &&
      line_sep[3] !== "" &&
      line_sep[3] !== undefined
    ) {
      // persons:候補者データ[配列]
      const persons = [line_sep[3], line_sep[5]];
      name = line_sep[2];
      areaObj[prefName][areaName]["persons"][name] = persons;
      return;
    } else if (reg === regs[3]) {
      // rateEach:候補者得票率:[str]
      const rateEach = line_sep[6].padStart(5) + "%";
      areaObj[prefName][areaName]["persons"][name].push(rateEach);
      return;
    }
  });

  // Promiseを明示的に返す
  return new Promise((resolve, reject) => {
    rl.on("close", () => {
      resolve(areaObj);
    });
    rl.on("error", (err) => {
      reject(err);
    });
  });
};

export default jsonMaker;

// 単体テスト用
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const filename = "nhksenkyo_shusenakita_20211031.csv";
  const hh = jsonMaker(filename)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(result);
    });
}
