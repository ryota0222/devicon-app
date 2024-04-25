const fs = require("fs");
const path = require("path");

// deviconsパッケージのiconsディレクトリのパスを設定
const iconsPath = path.join(__dirname, "..", "node_modules", "devicon", "icons");
const outputPath = path.join(__dirname, "..", "consts", "icons.ts");

// ディレクトリを読み取り、結果を配列に格納
fs.readdir(iconsPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error("ディレクトリの読み取り中にエラーが発生しました:", err);
        return;
    }

    const iconDirs = files
        .filter(file => file.isDirectory())
        .map(dir => dir.name);

    // 結果をTypeScriptファイルとして保存
    const tsContent = `export const iconNames = ${JSON.stringify(iconDirs, null, 2)} as const;`;
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    console.log(`Icons saved to ${outputPath}`);
});