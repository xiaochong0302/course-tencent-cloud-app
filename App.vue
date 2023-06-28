<script>
    export default {
        onLaunch: function() {
            // 增加对Android H5播放m3u8支持, 参考：https://segmentfault.com/a/1190000039976865
            // #ifdef H5
            if (uni.getSystemInfoSync().platform != 'ios') {
                var script = document.createElement('script')
                script.src = 'https://cdn.staticfile.org/hls.js/1.1.5/hls.min.js'
                script.onload = function() {
                    let init = function(video) {
                        if (!video.getAttribute('hls-inited')) {
                            let hls = null
                            let load = function() {
                                let src = video.src
                                if (!src || src.indexOf('.m3u8') < 0) return
                                if (!hls) {
                                    hls = new Hls()
                                    hls.attachMedia(video)
                                }
                                hls.loadSource(src)
                            }
                            video.addEventListener('error', function() {
                                load()
                            }, false)
                            video.addEventListener('DOMNodeRemovedFromDocument', function() {
                                if (hls) hls.destroy()
                            }, false)
                            video.setAttribute('hls-inited', 'ok')
                        }
                    }
                    document.body.addEventListener('DOMNodeInserted', function(e) {
                        let ele = e.relatedNode
                        let videoObj = ele.getElementsByTagName('video')
                        if (videoObj.length > 0) {
                            for (let i = 0; i < videoObj.length; i++) {
                                init(videoObj[i])
                            }
                        }
                    })
                }
                var s = document.getElementsByTagName('script')[0]
                s.parentNode.insertBefore(script, s)
            }
            // #endif
        },
        onShow: function() {
            console.log('On Show')
        },
        onHide: function() {
            console.log('On Hide')
        },
    }
</script>

<style lang="scss">
    @import "uview-ui/index.scss";
    @import "static/css/common.css";
    @import "static/css/content.css";
</style>