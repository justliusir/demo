Page({
    //数据
    data:{
        dominantemotion:null,
        happy:0,
        angry:0,
        disgust:0,
        fear:0,
        neutral:0,
        sad:0,
        surprise:0,
        isface:false,
        isOk:false

    },
    // 第一次加载时调用
    onLoad(){
        console.log('ip:',this.data.ip,'host:',this.data.host)
        // this.loginForm(data)
    },
    // 开始
    start: function(data) {
        this.setData({
            isOk:true,
        })
    },
    //停止
    stop:function(){
        this.setData({
            isOk:false,
        })
        console.log('reset!!!!!!!!!!')

    },
    //
    onShow: function(){
        var that =this;
        /**
         * 防止用户拿不到最新数据(因为页面切换会重新计时)
         * 无条件请求一次最新数据
         */
        // console.log('请求接口：刷新数据(无条件执行)')
        /**
         * 每隔一段时间请求服务器刷新数据(客户状态)
         * 当页面显示时开启定时器(开启实时刷新)
         * 每隔1分钟请求刷新一次
         * @注意：用户切换后页面会重新计时
         */
        setInterval(()=>{ 
            if (this.data.isOk){
                console.log(this.data.isOk)

                 //拍摄照片
                wx.createCameraContext().takePhoto({
                    quality: 'high',//拍摄质量(high:高质量 normal:普通质量 low:高质量)
                    success: (res) => {
                        //拍摄成功
                        //照片文件的临时文件
                        var file = res.tempImagePath;
                        console.log(file)
                        //上传图片处理成base64
                        wx.getFileSystemManager().readFile({
                            filePath: file,
                            encoding:"base64",
                            success: function (data){
                                console.log(data)//返回base64编码结果，但是图片的话没有data:image/png
                                var str = JSON.stringify(data)
                                var temp =JSON.parse(str)
                                //   上传
                                console.log('---------------')
                                console.log({"img":"data:image/jpeg;base64,"+temp['data']})
                                wx.request({
                                    url: 'https://www.lanhung.com/analyze',
                                    header:{
                                        "Content-Type": "application/json"
                                    },
                                    data: {
                                        "face_img":["data:image/jpeg;base64,"+temp['data']]
                                    },
                                    // data: {
                                    //     "face_img":data
                                    // },
                                    method: 'POST',
                                    success: (res) => {
                                        console.log(that.data.ip)
                                        //上传成功
                                        console.log(res)
                                        if(res.data['statusCode']==200){
                                            that.setData({
                                                angry:res.data['data']['instance_1']['emotion']['angry'].toFixed(5),
                                                happy:res.data['data']['instance_1']['emotion']['happy'].toFixed(5),
                                                disgust:res.data['data']['instance_1']['emotion']['disgust'].toFixed(5),
                                                fear:res.data['data']['instance_1']['emotion']['fear'].toFixed(5),
                                                neutral:res.data['data']['instance_1']['emotion']['neutral'].toFixed(5),
                                                sad:res.data['data']['instance_1']['emotion']['sad'].toFixed(5),
                                                surprise:res.data['data']['instance_1']['emotion']['surprise'].toFixed(5),
                                            })
                                            console.log('hhh:'+that.data.ip)
                        
                                    } 
                                    },
                                    fail: (res) => {
                                        //上传失败
                                        wx.showToast({
                                            // title: '上传失败！！！！！',
                                            // icon: 'error'
                                        })
                                    },
                                    complete: (res) => {},
                                })
                        
                            }
                        })
                
                    },
                    fail: (res) => {
                        //拍摄失败
                        wx.showToast({
                            // title: '拍摄失败！！！！！',
                            // icon: 'error'
                        })
                    },            
                })
                
            }
            
           
    
        }, 1000)//间隔时间
        
    },   
})
