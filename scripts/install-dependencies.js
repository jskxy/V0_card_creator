// 安装必要的依赖包
const dependencies = ["html-to-image", "jszip"]

console.log("需要安装的依赖包：")
dependencies.forEach((dep) => {
  console.log(`- ${dep}`)
})

console.log("\n请在项目根目录运行以下命令：")
console.log(`npm install ${dependencies.join(" ")}`)

console.log("\n或者使用 yarn：")
console.log(`yarn add ${dependencies.join(" ")}`)
