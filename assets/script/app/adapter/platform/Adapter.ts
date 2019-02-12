export default abstract class Adapter {

    // public abstract test();

    /**
     * 调用Java静态方法(Android)
     * @param className 类全名
     * @param methodNmae 方法名
     * @param paramType Java类型签名 
     * int     -> I
     * float   -> F
     * boolean -> Z 
     * string  -> Ljava/lang/String;
     * @param params 参数
     */
    public callJavaStaticFunc(className: string, methodNmae: string, paramTypeSignatures: string, ...params) {
        if (cc.sys.isNative && cc.sys.platform == cc.sys.ANDROID) {
            return jsb.reflection.callStaticMethod(className, methodNmae, paramTypeSignatures, ...params);
        }
    }


    /**
     * 调用OC静态方法(IOS)
     * @param className 类全名
     * @param methodNmae 方法名
     * @param params 参数
     */
    public callOcStaticFunc(className: string, methodNmae: string, ...params) {
        if (cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE) {
            return jsb.reflection.callStaticMethod(className, methodNmae, ...params);
        }
    }
}