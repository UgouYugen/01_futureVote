import * as fs from "node:fs";
import * as readline from "node:readline";

const filename = "./data/nhk_original/nhksenkyo_shusenaichi_20211031.csv";

// ReadStreamを作成
const r_stream = fs.createReadStream(filename);

// readline.Interfaceクラスを作成
const rl = readline.createInterface({
  input: r_stream,
});

let frag1 = false;

const regs = [/^.*区$/, /^開票所名$/, /^投票率$/];

// rl.on("line", (lineString) => {
//   console.log(lineString);
// });

rl.on("line", (line) => {
  const line_sep = line.split(",");
  const reg1 = regs.find((reg) => reg.test(line_sep[2]));
  if (reg1 === regs[0]) {
    const args_1 = line_sep[2];
    console.log(args_1);
  } else if (reg1 === regs[1]) {
    const args_2 = line_sep.slice(7).filter((i) => i !== "");
    console.log(args_2);
  } else if (reg1 === regs[2]) {
    const args_3 = line_sep[6].padStart(5);
    console.log(args_3 + "%");
  } else if (line_sep[3] !=="(％)" && line_sep[3] !== "") {
    const personData = [line_sep[2], line_sep[3], line_sep[5]];
    console.log(personData)
    frag1 = true;
  } else if (frag1 === true) {
    const args_4 = line_sep[6].padStart(5);
    console.log(args_4 + "%");
    frag1 = false;
  }
});
