const fs = require("fs");
const path = require("path");

// deviconsパッケージのiconsディレクトリのパスを設定
const iconsPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "devicon",
  "icons"
);
const outputPath = path.join(__dirname, "..", "consts", "icons.ts");

// ディレクトリを読み取り、結果を配列に格納
fs.readdir(iconsPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error("ディレクトリの読み取り中にエラーが発生しました:", err);
    return;
  }

  const iconDirs = files
    .filter((file) => file.isDirectory())
    .map((dir) => {
      // dir配下の画像名を取得
      const iconFiles = fs.readdirSync(path.join(iconsPath, dir.name));
      return {
        [dir.name]: iconFiles.map((file) => path.parse(file).name).sort(),
      };
    });

  // 結果をTypeScriptファイルとして保存
  const tsContent = `export const iconNames = ${JSON.stringify(
    iconDirs,
    null,
    2
  )} as const;`;
  fs.writeFileSync(outputPath, tsContent, "utf8");
  console.log(`Icons saved to ${outputPath}`);
});
