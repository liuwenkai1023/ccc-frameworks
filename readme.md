# 基于Cocos Creater的游戏框架


### 框架介绍

- 框架核心模块包含界面、事件、数据、音频、调度和存储管理器 
- 框架提供类似cocos2dx-lua中mvc模块，方便界面管理
- 框架把常用操作和模块封装到基础组件，减少额外操作
- 框架提供截图、界面适配、热更组件等常用组件
- 框架提供网络请求、Base64加密、贝塞尔曲线运动计算等常用工具类
- 框架支持不同平台sdk的快速适配（适配器模式）

### 框架目录
```
assets
├── resources #动态加载资源目录
│   ├── configs  #配置文件目录
│   ├── prefabs  #预制体目录
│   ├── sounds   #音频文件目录
│   ├── textures #纹理资源目录
│   ├── ...
├── scripts #脚本目录
│   ├── app #游戏逻辑目录
│   ├── base #框架主目录
│   │   ├── components  #框架自带的组件
│   │   ├── core #框架的核心文件
│   │   │   ├── audio   #音频管理器
│   │   │   ├── data    #数据管理器
│   │   │   ├── event   #事件管理器
│   │   │   ├── mvc     #mvc(类似2dx-lua那一套)
│   │   │   ├── storage #本地存储管理器
│   │   │   ├── timer   #调度管理器
│   │   ├── extensions  #扩展目录(按需添加或移除扩展即可)
│   │   │   ├── expr-eval #表达式插件
│   │   │   ├── fgui      #fgui扩展
│   │   │   ├── pako      #gzip压缩插件
│   │   │   ├── protobuf  #protobuf插件
│   │   │   ├── shader    #shader扩展(暂时移除)
│   │   │   ├── qrcode    #二维码插件
│   │   │   │   ├──components #对应二维码绘制组件目录(其它扩展同理)
│   │   │   ├── ... 
│   │   ├── utils #工具类目录
│   │   │   ├── polyfill #用作补丁,将某些平台不支持但又需要用到的功能以js插件形式引入
│   ├── sdk #sdk-adapter，用于不同平台适配
├── settings #伴随引擎启动进行设置更改
├── textures #非动态加载资源目录
```

### 框架附带组件
- BaseComponent `基础组件` `建议继承`
- ViewBase  `mvc基础组件`
- FitUI     `ui适配组件`
- ScreenCapture `截图组件`
- ~~ShaderSprite~~  `扩展组件`
- QRCode    `扩展组件`

### 框架附带工具
- excel 配置打表工具（配套框架中的数据管理器 DataManager）
- protobuf-tools 用于生成*.proto对应的提示文件等
- 热更新版本构建工具

### 附言
不要问有没有详细文档，没有，也不需要。打开AppStart场景即可运行，入口脚本同场景名，使用和示例相对简单。
看不懂请先移步[ Cocos Creator 用户手册](https://docs.cocos.com/creator/2.2/manual/zh/)。
