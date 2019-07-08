# Cocos Creater 游戏框架

### 基于CocosCreator开发的游戏框架。

- [x] UI管理 (常规UI管理方案)
- [x] Sdk管理 (常规Sdk管理方案)
- [ ] Config管理 (配置管理方案)
- [x] Event管理 (观察者模式)
- [x] Audio管理 (对系统Audio引擎的简单封装)
- [x] Timer管理 (通过Scheduler实现的Timer封装)
- [x] Shader管理 (整合后的一套Shader管理方案)
- [x] Storage管理 (常规Storage管理方案)
- [x] Utils
  - [x] Gzip (gzip压缩支持库)
  - [x] Base64 (支持中文、效率较高)
  - [x] QRCode  (二维码扩展支持库)
  - [x] HttpUtil (网络请求、文件下载等)
  - [x] SingleFactory (单例工厂，单例较多时方便管理)
  - [x] BezierMaker (贝塞尔曲线点位置计算)
- [x] 扩展组件
  - [x] 基础组件 (封装部分方法，所有的组件都建议继承它)
  - [x] 热更新组件 (对官方热更新进行了修改，组件只关心热更事件发送)
  - [x] 二维码组件 (二维码组件，二维码常规参数修改)
  - [x] ShaderSprite组件 (内置部分Shader效果，更多Shaer可以自行添加)

- [ ] 更多
  - [x] protocol buffers (序列化数据结构协议)
  - [x] expression evaluator (数学表达式求值支持)
  - [ ] more ...